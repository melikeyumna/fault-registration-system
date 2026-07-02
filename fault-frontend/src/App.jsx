import { BrowserRouter, Routes, Route, NavLink, Link, Navigate, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import {
  AppBar,
  Toolbar,
  Container,
  Grid,
  Stack,
  Card,
  CardContent,
  CardActions,
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
    MuiSelect: {
      styleOverrides: {
        select: {
          padding: "16px 18px",
          fontSize: 15,
          backgroundColor: "#09080f",
          borderRadius: 12,
          color: "#fff",
          display: "flex",
          alignItems: "center",
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
  fontWeight: 600,
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

const navRegisterBtnSx = {
  padding: "10px 16px",
  border: "1px solid #2f2b40",
  borderRadius: "12px",
  background: "#11101a",
  color: "#9c96b4",
  textTransform: "none",
  fontSize: 14,
  fontWeight: 500,
  "&.active, &:hover": {
    color: "#c4b5fd",
    background: "#1a1826",
    borderColor: "#4c3b73",
  },
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
        <Box className="app" sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
          <Container
            component="main"
            maxWidth={false}
            sx={{
              minHeight: "100vh",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              py: 7,
              px: 3,
            }}
          >
            <Card
              sx={{
                width: "100%",
                maxWidth: 520,
                borderRadius: "18px",
                background: "#11101a",
                border: "1px solid #25213a",
                boxShadow: "0 30px 80px rgba(0, 0, 0, 0.45)",
              }}
            >
              <CardContent sx={{ p: 5.25, "&:last-child": { pb: 5.25 }, textAlign: "center" }}>
                <Typography
                  variant="overline"
                  component="p"
                  sx={{
                    color: "#c4b5fd",
                    letterSpacing: "0.24em",
                    fontSize: 12,
                    fontWeight: 800,
                    lineHeight: 1.5,
                    mb: 1.5,
                    textAlign: "center",
                    width: "100%",
                  }}
                >
                  Session Kontrolü
                </Typography>
                <Typography
                  variant="h2"
                  component="h1"
                  sx={{
                    fontSize: { xs: 38, md: 46 },
                    fontWeight: 700,
                    lineHeight: 1.1,
                    letterSpacing: "-0.02em",
                    mb: 2,
                    color: "#f3f2f7",
                    textAlign: "center",
                    width: "100%",
                  }}
                >
                  Yükleniyor
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: "#a9a3bf",
                    lineHeight: 1.7,
                    textAlign: "center",
                    width: "100%",
                  }}
                >
                  Aktif oturum kontrol ediliyor...
                </Typography>
              </CardContent>
            </Card>
          </Container>
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Box className="app" sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
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
        </Box>
      </BrowserRouter>
    </ThemeProvider>
  );
}


function LogoutModal({ onCancel, onConfirm }) {
  return (
    <Dialog open maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontSize: 30, fontWeight: 700, px: 3, pt: 3.75, pb: 1.5 }}>
        Çıkış Yapılsın mı?
      </DialogTitle>

      <DialogContent sx={{ px: 3, pb: 3 }}>
        <DialogContentText sx={{ color: "#a9a3bf", lineHeight: 1.7 }}>
          Aktif oturumunuz sonlandırılacaktır. Devam etmek istiyor musunuz?
        </DialogContentText>
      </DialogContent>

      <DialogActions sx={{ padding: "0 24px 24px", gap: "12px", justifyContent: "flex-end" }}>
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
    <AppBar
      position="sticky"
      sx={{
        height: 82,
        justifyContent: "center",
        background: "rgba(5, 4, 10, 0.55)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid #25213a",
        boxShadow: "none",
      }}
    >
      <Container maxWidth="lg" sx={{ px: { xs: 3, md: 8 } }}>
        <Toolbar disableGutters sx={{ justifyContent: "space-between" }}>
          <Typography
            component={Link}
            to="/"
            sx={{
              fontSize: 18,
              fontWeight: 800,
              color: "#f4f4f8",
              textDecoration: "none",
            }}
          >
            Arıza Kayıt Sistemi
          </Typography>

          <Stack direction="row" spacing={{ xs: 2, sm: 4 }} alignItems="center">
            <Button
              component={NavLink}
              to="/"
              sx={{
                color: "#9c96b4",
                textTransform: "none",
                fontSize: 14,
                fontWeight: 500,
                minWidth: "auto",
                padding: 0,
                "&.active, &:hover": { color: "#c4b5fd", background: "transparent" },
              }}
              disableRipple
            >
              Ana Sayfa
            </Button>

            {currentUser && (
              <Button
                component={NavLink}
                to="/faults"
                sx={{
                  color: "#9c96b4",
                  textTransform: "none",
                  fontSize: 14,
                  fontWeight: 500,
                  minWidth: "auto",
                  padding: 0,
                  "&.active, &:hover": { color: "#c4b5fd", background: "transparent" },
                }}
                disableRipple
              >
                Arızalar
              </Button>
            )}

            {!currentUser ? (
              <>
                <Button
                  component={NavLink}
                  to="/login"
                  sx={{
                    color: "#9c96b4",
                    textTransform: "none",
                    fontSize: 14,
                    fontWeight: 500,
                    minWidth: "auto",
                    padding: 0,
                    "&.active, &:hover": { color: "#c4b5fd", background: "transparent" },
                  }}
                  disableRipple
                >
                  Giriş Yap
                </Button>
                <Button
                  component={NavLink}
                  to="/register"
                  sx={navRegisterBtnSx}
                >
                  Kayıt Ol
                </Button>
              </>
            ) : (
              <Button sx={logoutBtnSx} onClick={onLogout} disableRipple>
                Çıkış Yap
              </Button>
            )}
          </Stack>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

function Home({ faults, currentUser }) {
  const open = faults.filter((f) => f.status === "OPEN").length;
  const progress = faults.filter((f) => f.status === "IN_PROGRESS").length;
  const closed = faults.filter((f) => f.status === "CLOSED").length;

  return (
    <Box component="main" sx={{ padding: { xs: "60px 24px", md: "90px 64px" } }}>
      <Box
        component="section"
        sx={{
          maxWidth: 960,
          margin: "0 auto",
          textAlign: "center",
          padding: { xs: "60px 20px", md: "90px 20px" },
        }}
      >
        <Typography
          component="p"
          sx={{
            color: "#c4b5fd",
            textTransform: "uppercase",
            letterSpacing: "0.24em",
            fontSize: 12,
            fontWeight: 800,
            margin: 0,
          }}
        >
          Arıza Yönetim Sistemi
        </Typography>

        <Typography
          component="h1"
          sx={{
            fontSize: { xs: 42, md: 68 },
            lineHeight: 1.1,
            letterSpacing: "-0.03em",
            margin: "24px 0",
            fontWeight: 700,
            color: "#f3f2f7",
          }}
        >
          Arıza Kayıtlarını Kolayca Yönetin.
        </Typography>

        <Typography
          component="p"
          sx={{
            maxWidth: 640,
            margin: "0 auto 36px",
            color: "#a9a3bf",
            fontSize: 18,
            lineHeight: 1.7,
          }}
        >
          Arıza kayıtlarını oluşturun, takip edin, güncelleyin ve tek bir panel
          üzerinden yönetin.
        </Typography>

        {currentUser ? (
          <Button component={Link} to="/faults" sx={primaryBtnSx}>
            Arıza Paneli
          </Button>
        ) : (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: "14px",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: "center",
            }}
          >
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
        <Box
          component="section"
          sx={{
            maxWidth: 1050,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: { xs: "repeat(2, 1fr)", md: "repeat(4, 1fr)" },
            gap: "18px",
            width: "100%",
          }}
        >
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
    <Card
      sx={{
        background: "#11101a",
        border: "1px solid #25213a",
        borderRadius: "16px",
        boxShadow: "0 30px 80px rgba(0, 0, 0, 0.45)",
      }}
    >
      <CardContent sx={{ p: 4.25, "&:last-child": { pb: 4.25 }, textAlign: "center" }}>
        <Typography
          variant="h2"
          sx={{
            fontSize: 58,
            fontWeight: 700,
            letterSpacing: "-0.08em",
            color: "#f3f2f7",
            lineHeight: 1.1,
          }}
        >
          {value}
        </Typography>
        <Typography
          variant="caption"
          component="p"
          sx={{
            mt: 1.25,
            color: "#9c96b4",
            textTransform: "uppercase",
            letterSpacing: "0.2em",
            fontSize: 11,
            fontWeight: 800,
          }}
        >
          {title}
        </Typography>
      </CardContent>
    </Card>
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
      <Box component="form" onSubmit={handleSubmit} sx={{ display: "grid", gap: 1.75 }}>
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
              borderRadius: "12px",
            }}
          >
            {message}
          </Alert>
        )}

        <Button sx={primaryBtnSx} type="submit">Giriş Yap</Button>
      </Box>

      <Typography
        variant="body2"
        sx={{
          color: "#9c96b4",
          mt: 2.75,
          textAlign: "center",
          "& a": {
            color: "#c4b5fd",
            fontWeight: 800,
            textDecoration: "none",
            "&:hover": { textDecoration: "underline" },
          },
        }}
      >
        Hesabınız yok mu? <Link to="/register">Kayıt olun</Link>
      </Typography>
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
      <Box component="form" onSubmit={handleSubmit} sx={{ display: "grid", gap: 1.75 }}>
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
              borderRadius: "12px",
            }}
          >
            {message}
          </Alert>
        )}

        <Button sx={primaryBtnSx} type="submit">Kayıt Ol</Button>
      </Box>

      <Typography
        variant="body2"
        sx={{
          color: "#9c96b4",
          mt: 2.75,
          textAlign: "center",
          "& a": {
            color: "#c4b5fd",
            fontWeight: 800,
            textDecoration: "none",
            "&:hover": { textDecoration: "underline" },
          },
        }}
      >
        Zaten hesabınız var mı? <Link to="/login">Giriş yapın</Link>
      </Typography>
    </AuthLayout>
  );
}

function AuthLayout({ eyebrow, title, text, children }) {
  return (
    <Container
      component="main"
      maxWidth={false}
      sx={{
        minHeight: "calc(100vh - 82px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        py: 7,
        px: 3,
      }}
    >
      <Card
        sx={{
          width: "100%",
          maxWidth: 520,
          borderRadius: "18px",
          background: "#11101a",
          border: "1px solid #25213a",
          boxShadow: "0 30px 80px rgba(0, 0, 0, 0.45)",
        }}
      >
        <CardContent sx={{ p: 5.25, "&:last-child": { pb: 5.25 } }}>
          <Typography
            variant="overline"
            component="p"
            sx={{
              color: "#c4b5fd",
              letterSpacing: "0.24em",
              fontSize: 12,
              fontWeight: 800,
              lineHeight: 1.5,
              mb: 1.5,
              textAlign: "center",
              width: "100%",
            }}
          >
            {eyebrow}
          </Typography>

          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: 38, md: 46 },
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              mb: 2,
              color: "#f3f2f7",
              textAlign: "center",
              width: "100%",
            }}
          >
            {title}
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: "#a9a3bf",
              lineHeight: 1.7,
              mb: 3.5,
              textAlign: "center",
              width: "100%",
            }}
          >
            {text}
          </Typography>

          {children}
        </CardContent>
      </Card>
    </Container>
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
    <Container component="main" maxWidth="lg" sx={{ py: 7, px: { xs: 3, md: 8 } }}>
      <Card
        sx={{
          borderRadius: "16px",
          mb: 3.5,
          background: "#11101a",
          border: "1px solid #25213a",
          boxShadow: "0 30px 80px rgba(0, 0, 0, 0.45)",
        }}
      >
        <CardContent sx={{ p: 4.25, "&:last-child": { pb: 4.25 } }}>
          <Typography
            variant="h2"
            component="h1"
            sx={{
              margin: "0 0 24px",
              fontSize: 34,
              fontWeight: 700,
              letterSpacing: "-0.06em",
              color: "#f3f2f7",
            }}
          >
            {editingId ? "Arıza Güncelle" : "Yeni Arıza Kaydı"}
          </Typography>

          <Box component="form" onSubmit={handleSubmit} sx={{ display: "grid", gap: 1.75 }}>
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

            <Stack direction="row" spacing={1.5} sx={{ mt: 2.25 }}>
              <Button sx={primaryBtnSx} type="submit">
                {editingId ? "Güncelle" : "Arıza Kaydı"}
              </Button>

              {editingId && (
                <Button sx={secondaryBtnSx} type="button" onClick={clearForm}>
                  İptal
                </Button>
              )}
            </Stack>
          </Box>
        </CardContent>
      </Card>

      <Card
        sx={{
          borderRadius: "16px",
          background: "#11101a",
          border: "1px solid #25213a",
          boxShadow: "0 30px 80px rgba(0, 0, 0, 0.45)",
        }}
      >
        <CardContent sx={{ p: 4.25, "&:last-child": { pb: 4.25 } }}>
          <Typography
            variant="h2"
            component="h1"
            sx={{
              margin: "0 0 24px",
              fontSize: 34,
              fontWeight: 700,
              letterSpacing: "-0.06em",
              color: "#f3f2f7",
            }}
          >
            Arıza Kayıtları
          </Typography>

          <Stack spacing={2}>
            {faults.map((fault) => (
              <Card
                key={fault.id}
                sx={{
                  background: "#11101a",
                  border: "1px solid #25213a",
                  borderRadius: "14px",
                  boxShadow: "0 30px 80px rgba(0, 0, 0, 0.45)",
                  transition: "0.2s ease",
                  "&:hover": {
                    transform: "translateY(-3px)",
                    borderColor: "#4c3b73",
                  },
                }}
              >
                <CardContent sx={{ p: 3, "&:last-child": { pb: 1.5 } }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      width: "100%",
                      mb: 1.5,
                    }}
                  >
                    <Typography
                      variant="h6"
                      component="h2"
                      sx={{
                        fontSize: 22,
                        fontWeight: 600,
                        color: "#f3f2f7",
                      }}
                    >
                      {fault.title}
                    </Typography>

                    <Chip
                      label={statusLabels[fault.status]}
                      size="small"
                      sx={{
                        fontWeight: 800,
                        fontSize: 12,
                        borderRadius: "999px",
                        padding: "8px 14px",
                        height: "auto",
                        "& .MuiChip-label": { padding: 0 },
                        ...statusChipSx[fault.status],
                      }}
                    />
                  </Box>

                  <Typography
                    variant="body1"
                    sx={{
                      color: "#c7c2d8",
                      lineHeight: 1.6,
                      mb: 1.5,
                    }}
                  >
                    {fault.description}
                  </Typography>

                  <Typography
                    variant="caption"
                    component="p"
                    sx={{
                      color: "#8f88a8",
                      fontSize: 12,
                    }}
                  >
                    Bildiren: {fault.reportedBy}
                  </Typography>
                </CardContent>

                <CardActions sx={{ px: 3, pb: 3, pt: 0, gap: 1.5, justifyContent: "flex-start" }}>
                  <Button sx={cardActionBtnSx} onClick={() => startEditing(fault)}>
                    Düzenle
                  </Button>

                  <Button sx={cardActionDangerBtnSx} onClick={() => askDelete(fault)}>
                    Sil
                  </Button>
                </CardActions>
              </Card>
            ))}
          </Stack>
        </CardContent>
      </Card>

      <Dialog open={showDeleteModal} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontSize: 30, fontWeight: 700, px: 3, pt: 3.75, pb: 1.5 }}>
          Arıza Silinsin mi?
        </DialogTitle>

        <DialogContent sx={{ px: 3, pb: 3 }}>
          <DialogContentText sx={{ color: "#a9a3bf", lineHeight: 1.7 }}>
            "<strong>{faultToDelete?.title}</strong>" adlı arıza kaydı kalıcı olarak silinecektir.
            Devam etmek istiyor musunuz?
          </DialogContentText>
        </DialogContent>

        <DialogActions sx={{ padding: "0 24px 24px", gap: "12px", justifyContent: "flex-end" }}>
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
    </Container>
  );
}

export default App;
