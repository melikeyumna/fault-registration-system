import { BrowserRouter, Routes, Route, NavLink, Link, Navigate, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "http://localhost:8080/faults";
const AUTH_URL = "http://localhost:8080/auth";

function App() {
  const [faults, setFaults] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [isSessionChecked, setIsSessionChecked] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  async function fetchFaults() {
    const res = await fetch(API_URL, {
      credentials: "include",
    });

    if (res.status === 401) {
      setCurrentUser(null);
      setFaults([]);
      return;
    }

    const data = await res.json();
    setFaults(data);
  }

  function handleLogin(user) {
    setCurrentUser(user);
  }

  async function confirmLogout() {
    await fetch(`${AUTH_URL}/logout`, {
      method: "POST",
      credentials: "include",
    });

    setCurrentUser(null);
    setFaults([]);
    setShowLogoutModal(false);
  }

  function askLogout() {
    setShowLogoutModal(true);
  }

  function cancelLogout() {
    setShowLogoutModal(false);
  }

  useEffect(() => {
    async function checkSession() {
      try {
        const res = await fetch(`${AUTH_URL}/me`, {
          credentials: "include",
        });

        if (res.ok) {
          const user = await res.json();
          setCurrentUser(user);
        }
      } finally {
        setIsSessionChecked(true);
      }
    }

    checkSession();
  }, []);

  useEffect(() => {
    if (currentUser) {
      fetchFaults();
    }
  }, [currentUser]);

  if (!isSessionChecked) {
    return (
      <div className="app">
        <main className="auth-page">
          <section className="auth-card">
            <p className="eyebrow">Session Kontrolü</p>
            <h1>Yükleniyor</h1>
            <p className="auth-text">Aktif oturum kontrol ediliyor...</p>
          </section>
        </main>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div className="app">
        <Navbar currentUser={currentUser} onLogout={askLogout} />

        <Routes>
          <Route path="/" element={<Home faults={faults} currentUser={currentUser} />} />
          <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
          <Route path="/register" element={<RegisterPage onLogin={handleLogin} />} />
          <Route
            path="/faults"
            element={
              currentUser ? (
                <FaultsPage faults={faults} fetchFaults={fetchFaults} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
        </Routes>

        {showLogoutModal && (
          <LogoutModal onCancel={cancelLogout} onConfirm={confirmLogout} />
        )}
      </div>
    </BrowserRouter>
  );
}


function LogoutModal({ onCancel, onConfirm }) {
  return (
    <div className="modal-backdrop">
      <div className="delete-modal">
        <h2>Çıkış Yapılsın mı?</h2>

        <p>
          Aktif oturumunuz sonlandırılacaktır. Devam etmek istiyor musunuz?
        </p>

        <div className="modal-actions">
          <button className="secondary-btn" onClick={onCancel}>
            İptal
          </button>

          <button className="logout-confirm-btn" onClick={onConfirm}>
            Çıkış Yap
          </button>
        </div>
      </div>
    </div>
  );
}

function Navbar({ currentUser, onLogout }) {
  return (
    <nav className="navbar">
      <Link to="/" className="brand">Arıza Kayıt Sistemi</Link>

      <div className="nav-links">
        <NavLink to="/">Ana Sayfa</NavLink>

        {currentUser && <NavLink to="/faults">Arızalar</NavLink>}

        {!currentUser ? (
          <>
            <NavLink to="/login">Giriş Yap</NavLink>
            <NavLink to="/register" className="nav-register">Kayıt Ol</NavLink>
          </>
        ) : (
          <button className="logout-btn" onClick={onLogout}>Çıkış Yap</button>
        )}
      </div>
    </nav>
  );
}

function Home({ faults, currentUser }) {
  const open = faults.filter((f) => f.status === "OPEN").length;
  const progress = faults.filter((f) => f.status === "IN_PROGRESS").length;
  const closed = faults.filter((f) => f.status === "CLOSED").length;

  return (
    <main className="home">
      <section className="hero">
        <p className="eyebrow">Arıza Yönetim Sistemi</p>

        <h1>Arıza Kayıtlarını Kolayca Yönetin.</h1>

        <p className="hero-text">
          Arıza kayıtlarını oluşturun, takip edin, güncelleyin ve tek bir panel
          üzerinden yönetin.
        </p>

        {currentUser ? (
          <Link to="/faults" className="primary-btn">
            Arıza Paneli
          </Link>
        ) : (
          <div className="hero-actions">
            <Link to="/login" className="primary-btn">
              Giriş Yap
            </Link>

            <Link to="/register" className="secondary-btn">
              Kayıt Ol
            </Link>
          </div>
        )}
      </section>

      {currentUser && (
        <section className="stats">
          <Stat title="Toplam" value={faults.length} />
          <Stat title="Açık" value={open} />
          <Stat title="İşlemde" value={progress} />
          <Stat title="Kapatıldı" value={closed} />
        </section>
      )}
    </main>
  );
}

function Stat({ title, value }) {
  return (
    <div className="stat-card">
      <h2>{value}</h2>
      <p>{title}</p>
    </div>
  );
}

function LoginPage({ onLogin }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");

    const res = await fetch(`${AUTH_URL}/login`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setMessage(data.message || "Giriş yapılırken bir hata oluştu.");
      return;
    }

    onLogin(data);
    navigate("/faults");
  }

  return (
    <AuthLayout
      eyebrow="Tekrar Hoş Geldiniz"
      title="Giriş Yap"
      text="Arıza kayıtlarını görüntülemek ve yönetmek için hesabınıza giriş yapın."
    >
      <form className="auth-form" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="E-posta"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Şifre"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {message && <p className="form-message error-message">{message}</p>}

        <button className="primary-btn" type="submit">Giriş Yap</button>
      </form>

      <p className="auth-switch">
        Hesabınız yok mu? <Link to="/register">Kayıt olun</Link>
      </p>
    </AuthLayout>
  );
}

function RegisterPage({ onLogin }) {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");

    const res = await fetch(`${AUTH_URL}/register`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ fullName, email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setMessage(data.message || "Kayıt olurken bir hata oluştu.");
      return;
    }

    onLogin(data);
    navigate("/faults");
  }

  return (
    <AuthLayout
      eyebrow="Yeni Hesap"
      title="Kayıt Ol"
      text="Arıza kayıt paneline erişmek için yeni bir hesap oluşturun."
    >
      <form className="auth-form" onSubmit={handleSubmit}>
        <input
          placeholder="Ad Soyad"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="E-posta"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Şifre"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {message && <p className="form-message error-message">{message}</p>}

        <button className="primary-btn" type="submit">Kayıt Ol</button>
      </form>

      <p className="auth-switch">
        Zaten hesabınız var mı? <Link to="/login">Giriş yapın</Link>
      </p>
    </AuthLayout>
  );
}

function AuthLayout({ eyebrow, title, text, children }) {
  return (
    <main className="auth-page">
      <section className="auth-card">
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p className="auth-text">{text}</p>
        {children}
      </section>
    </main>
  );
}

function FaultsPage({ faults, fetchFaults }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [reportedBy, setReportedBy] = useState("");
  const [status, setStatus] = useState("OPEN");
  const [editingId, setEditingId] = useState(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [faultToDelete, setFaultToDelete] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();

    const faultData = {
      title,
      description,
      reportedBy,
      status,
    };

    await fetch(editingId ? `${API_URL}/${editingId}` : API_URL, {
      method: editingId ? "PUT" : "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(faultData),
    });

    clearForm();
    fetchFaults();
  }

  function askDelete(fault) {
    setFaultToDelete(fault);
    setShowDeleteModal(true);
  }

  async function confirmDelete() {
    await fetch(`${API_URL}/${faultToDelete.id}`, {
      method: "DELETE",
      credentials: "include",
    });

    setShowDeleteModal(false);
    setFaultToDelete(null);

    fetchFaults();
  }

  function startEditing(fault) {
    setEditingId(fault.id);
    setTitle(fault.title);
    setDescription(fault.description);
    setReportedBy(fault.reportedBy);
    setStatus(fault.status);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function clearForm() {
    setEditingId(null);
    setTitle("");
    setDescription("");
    setReportedBy("");
    setStatus("OPEN");
  }

  return (
    <main className="dashboard">
      <section className="panel">
        <h1>{editingId ? "Arıza Güncelle" : "Yeni Arıza Kaydı"}</h1>

        <form onSubmit={handleSubmit} className="fault-form">
          <input
            placeholder="Başlık"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <input
            placeholder="Açıklama"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />

          <input
            placeholder="Bildiren Kişi"
            value={reportedBy}
            onChange={(e) => setReportedBy(e.target.value)}
            required
          />

          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="OPEN">AÇIK</option>
            <option value="IN_PROGRESS">İŞLEMDE</option>
            <option value="CLOSED">KAPATILDI</option>
          </select>

          <div className="button-row">
            <button className="primary-btn" type="submit">
              {editingId ? "Güncelle" : "Arıza Kaydı"}
            </button>

            {editingId && (
              <button className="secondary-btn" type="button" onClick={clearForm}>
                İptal
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="panel">
        <h1>Arıza Kayıtları</h1>

        <div className="fault-list">
          {faults.map((fault) => (
            <article className="fault-card" key={fault.id}>
              <div>
                <div className="fault-top">
                  <h2>{fault.title}</h2>

                  <span className={`badge ${fault.status.toLowerCase()}`}>
                    {fault.status === "OPEN"
                      ? "Açık"
                      : fault.status === "IN_PROGRESS"
                      ? "İşlemde"
                      : "Kapatıldı"}
                  </span>
                </div>

                <p>{fault.description}</p>
                <small>Bildiren: {fault.reportedBy}</small>
              </div>

              <div className="card-actions">
                <button onClick={() => startEditing(fault)}>Düzenle</button>

                <button className="danger" onClick={() => askDelete(fault)}>
                  Sil
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {showDeleteModal && (
        <div className="modal-backdrop">
          <div className="delete-modal">
            <h2>Arıza Silinsin mi?</h2>

            <p>
              "<strong>{faultToDelete?.title}</strong>" adlı arıza kaydı kalıcı olarak silinecektir.
              Devam etmek istiyor musunuz?
            </p>

            <div className="modal-actions">
              <button
                className="secondary-btn"
                onClick={() => {
                  setShowDeleteModal(false);
                  setFaultToDelete(null);
                }}
              >
                İptal
              </button>

              <button className="delete-confirm-btn" onClick={confirmDelete}>
                Sil
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default App;
