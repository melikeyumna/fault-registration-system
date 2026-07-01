import { BrowserRouter, Routes, Route, NavLink, Link, Navigate, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import {
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Alert,
  Box,
  Typography,
  Chip,
} from "@mui/material";
import "./App.css";

// MUI theme mirroring the existing dark / purple design tokens defined in App.css.
// Colors, radii and spacing values below are copied 1:1 from App.css so the
// visual language stays unchanged after introducing Material UI components.
const theme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#7c3aed", light: "#c4b5fd", dark: "#4c1d95" },
    secondary: { main: "#805aba" },
    background: { default: "#05040a", paper: "#11101a" },
    text: { primary: "#f3f2f7", secondary: "#a9a3bf" },
  },
  typography: {
    fontFamily: '"Manrope", sans-serif',
  },
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: "#09080f",
          borderRadius: 12,
          color: "#fff",
          "& fieldset": { borderColor: "#25213a" },
          "&:hover fieldset": { borderColor: "#25213a" },
          "&.Mui-focused fieldset": {
            borderColor: "#7c3aed",
            boxShadow: "0 0 0 3px rgba(124, 58, 237, 0.15)",
          },
        },
        input: {
          padding: "16px 18px",
          fontSize: 15,
          "&::placeholder": { color: "#7f7896", opacity: 1 },
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          backgroundColor: "#11101a",
          border: "1px solid #25213a",
          color: "#fff",
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          "&:hover": { backgroundColor: "#1a1826" },
          "&.Mui-selected": { backgroundColor: "#242034" },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: "#11101a",
          border: "1px solid #2f2b40",
          borderRadius: 18,
          boxShadow: "0 40px 100px rgba(0, 0, 0, 0.6)",
        },
      },
    },
  },
});

// Button style objects copied from the existing .primary-btn / .secondary-btn /
// .delete-confirm-btn / card-actions button rules in App.css, applied via sx
// so MUI's default Button styling never overrides the current design.
const primaryBtnSx = {
  background: "#805aba",
  color: "#f5f5f5",
  border: "1px solid #2f2b40",
  borderRadius: "14px",
  padding: "14px 24px",
  fontWeight: 800,
  fontSize: 14,
  textTransform: "none",
  "&:hover": { background: "#242034", borderColor: "#46405d" },
};

const secondaryBtnSx = {
  background: "#11101a",
  color: "white",
  border: "1px solid #25213a",
  borderRadius: "14px",
  padding: "14px 24px",
  fontWeight: 800,
  fontSize: 14,
  textTransform: "none",
  "&:hover": { background: "#1a1826" },
};

const dangerBtnSx = {
  background: "#8a203d",
  color: "white",
  border: "none",
  borderRadius: "12px",
  padding: "14px 22px",
  fontWeight: 700,
  textTransform: "none",
  "&:hover": { background: "#a32649" },
};

const cardActionBtnSx = {
  border: "1px solid #25213a",
  background: "#151321",
  color: "white",
  padding: "10px 16px",
  borderRadius: "12px",
  textTransform: "none",
  "&:hover": { background: "#211d32" },
};

const cardActionDangerBtnSx = {
  ...cardActionBtnSx,
  color: "#fecaca",
  "&:hover": { background: "#3b111d" },
};

const logoutBtnSx = {
  color: "#9c96b4",
  textTransform: "none",
  fontWeight: 400,
  fontSize: 14,
  padding: 0,
  minWidth: "auto",
  "&:hover": { color: "#c4b5fd", background: "transparent" },
};

// Chip sx per fault status, copied from the .badge.open / .badge.in_progress /
// .badge.closed rules in App.css.
const statusChipSx = {
  OPEN: { backgroundColor: "rgba(34, 197, 94, 0.14)", color: "#86efac" },
  IN_PROGRESS: { backgroundColor: "rgba(250, 204, 21, 0.14)", color: "#fde68a" },
  CLOSED: { backgroundColor: "rgba(124, 58, 237, 0.16)", color: "#c4b5fd" },
};

const statusLabels = {
  OPEN: "Açık",
  IN_PROGRESS: "İşlemde",
  CLOSED: "Kapatıldı",
};

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
      <ThemeProvider theme={theme}>
        <div className="app">
          <main className="auth-page">
            <section className="auth-card">
              <p className="eyebrow">Session Kontrolü</p>
              <h1>Yükleniyor</h1>
              <p className="auth-text">Aktif oturum kontrol ediliyor...</p>
            </section>
          </main>
        </div>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
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
    </ThemeProvider>
  );
}


function LogoutModal({ onCancel, onConfirm }) {
  return (
    <Dialog open maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontSize: 30, fontWeight: 700 }}>Çıkış Yapılsın mı?</DialogTitle>

      <DialogContent>
        <DialogContentText sx={{ color: "#a9a3bf", lineHeight: 1.7 }}>
          Aktif oturumunuz sonlandırılacaktır. Devam etmek istiyor musunuz?
        </DialogContentText>
      </DialogContent>

      <DialogActions sx={{ padding: "0 24px 24px", gap: "12px" }}>
        <Button sx={secondaryBtnSx} onClick={onCancel}>
          İptal
        </Button>

        <Button sx={dangerBtnSx} onClick={onConfirm}>
          Çıkış Yap
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function Navbar({ currentUser, onLogout }) {
  return (
    <Box component="nav" className="navbar">
      <Link to="/" className="brand">Arıza Kayıt Sistemi</Link>

      <Box className="nav-links">
        <NavLink to="/">Ana Sayfa</NavLink>

        {currentUser && <NavLink to="/faults">Arızalar</NavLink>}

        {!currentUser ? (
          <>
            <NavLink to="/login">Giriş Yap</NavLink>
            <NavLink to="/register" className="nav-register">Kayıt Ol</NavLink>
          </>
        ) : (
          <Button sx={logoutBtnSx} onClick={onLogout} disableRipple>Çıkış Yap</Button>
        )}
      </Box>
    </Box>
  );
}

function Home({ faults, currentUser }) {
  const open = faults.filter((f) => f.status === "OPEN").length;
  const progress = faults.filter((f) => f.status === "IN_PROGRESS").length;
  const closed = faults.filter((f) => f.status === "CLOSED").length;

  return (
    <Box component="main" className="home">
      <Box component="section" className="hero">
        <Typography component="p" variant="inherit" className="eyebrow">
          Arıza Yönetim Sistemi
        </Typography>

        <Typography component="h1" variant="inherit">
          Arıza Kayıtlarını Kolayca Yönetin.
        </Typography>

        <Typography component="p" variant="inherit" className="hero-text">
          Arıza kayıtlarını oluşturun, takip edin, güncelleyin ve tek bir panel
          üzerinden yönetin.
        </Typography>

        {currentUser ? (
          <Button component={Link} to="/faults" sx={primaryBtnSx}>
            Arıza Paneli
          </Button>
        ) : (
          <Box className="hero-actions">
            <Button component={Link} to="/login" sx={primaryBtnSx}>
              Giriş Yap
            </Button>

            <Button component={Link} to="/register" sx={secondaryBtnSx}>
              Kayıt Ol
            </Button>
          </Box>
        )}
      </Box>

      {currentUser && (
        <Box component="section" className="stats">
          <Stat title="Toplam" value={faults.length} />
          <Stat title="Açık" value={open} />
          <Stat title="İşlemde" value={progress} />
          <Stat title="Kapatıldı" value={closed} />
        </Box>
      )}
    </Box>
  );
}

function Stat({ title, value }) {
  return (
    <Box className="stat-card">
      <Typography component="h2" variant="inherit">{value}</Typography>
      <Typography component="p" variant="inherit">{title}</Typography>
    </Box>
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
        <TextField
          type="email"
          placeholder="E-posta"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          fullWidth
        />

        <TextField
          type="password"
          placeholder="Şifre"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          fullWidth
        />

        {message && (
          <Alert
            severity="error"
            sx={{
              backgroundColor: "rgba(138, 32, 61, 0.18)",
              color: "#fecaca",
              border: "1px solid rgba(254, 202, 202, 0.15)",
            }}
          >
            {message}
          </Alert>
        )}

        <Button sx={primaryBtnSx} type="submit">Giriş Yap</Button>
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
        <TextField
          placeholder="Ad Soyad"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
          fullWidth
        />

        <TextField
          type="email"
          placeholder="E-posta"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          fullWidth
        />

        <TextField
          type="password"
          placeholder="Şifre"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          fullWidth
        />

        {message && (
          <Alert
            severity="error"
            sx={{
              backgroundColor: "rgba(138, 32, 61, 0.18)",
              color: "#fecaca",
              border: "1px solid rgba(254, 202, 202, 0.15)",
            }}
          >
            {message}
          </Alert>
        )}

        <Button sx={primaryBtnSx} type="submit">Kayıt Ol</Button>
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
          <TextField
            placeholder="Başlık"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            fullWidth
          />

          <TextField
            placeholder="Açıklama"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            fullWidth
          />

          <TextField
            placeholder="Bildiren Kişi"
            value={reportedBy}
            onChange={(e) => setReportedBy(e.target.value)}
            required
            fullWidth
          />

          <FormControl fullWidth>
            <Select value={status} onChange={(e) => setStatus(e.target.value)}>
              <MenuItem value="OPEN">AÇIK</MenuItem>
              <MenuItem value="IN_PROGRESS">İŞLEMDE</MenuItem>
              <MenuItem value="CLOSED">KAPATILDI</MenuItem>
            </Select>
          </FormControl>

          <div className="button-row">
            <Button sx={primaryBtnSx} type="submit">
              {editingId ? "Güncelle" : "Arıza Kaydı"}
            </Button>

            {editingId && (
              <Button sx={secondaryBtnSx} type="button" onClick={clearForm}>
                İptal
              </Button>
            )}
          </div>
        </form>
      </section>

      <section className="panel">
        <h1>Arıza Kayıtları</h1>

        <Box className="fault-list">
          {faults.map((fault) => (
            <Box component="article" className="fault-card" key={fault.id}>
              <div>
                <div className="fault-top">
                  <Typography component="h2" variant="inherit">{fault.title}</Typography>

                  <Chip
                    label={statusLabels[fault.status]}
                    size="small"
                    sx={{
                      fontWeight: 800,
                      fontSize: 12,
                      ...statusChipSx[fault.status],
                    }}
                  />
                </div>

                <p>{fault.description}</p>
                <small>Bildiren: {fault.reportedBy}</small>
              </div>

              <div className="card-actions">
                <Button sx={cardActionBtnSx} onClick={() => startEditing(fault)}>
                  Düzenle
                </Button>

                <Button sx={cardActionDangerBtnSx} onClick={() => askDelete(fault)}>
                  Sil
                </Button>
              </div>
            </Box>
          ))}
        </Box>
      </section>

      <Dialog open={showDeleteModal} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontSize: 30, fontWeight: 700 }}>Arıza Silinsin mi?</DialogTitle>

        <DialogContent>
          <DialogContentText sx={{ color: "#a9a3bf", lineHeight: 1.7 }}>
            "<strong>{faultToDelete?.title}</strong>" adlı arıza kaydı kalıcı olarak silinecektir.
            Devam etmek istiyor musunuz?
          </DialogContentText>
        </DialogContent>

        <DialogActions sx={{ padding: "0 24px 24px", gap: "12px" }}>
          <Button
            sx={secondaryBtnSx}
            onClick={() => {
              setShowDeleteModal(false);
              setFaultToDelete(null);
            }}
          >
            İptal
          </Button>

          <Button sx={dangerBtnSx} onClick={confirmDelete}>
            Sil
          </Button>
        </DialogActions>
      </Dialog>
    </main>
  );
}

export default App;
