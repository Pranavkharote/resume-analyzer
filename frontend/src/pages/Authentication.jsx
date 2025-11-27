import React, { useContext, useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Paper,
  Box,
  Grid,
  Typography,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { AuthContext } from "../context/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const theme = createTheme({
  palette: {
    primary: { main: "#1976d2" },
    secondary: { main: "#f50057" },
    background: { default: "#f4f6f8" },
  },
  typography: { h5: { fontWeight: 600 } },
});

export default function Authentication() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [formState, setFormState] = useState(0); // 0 = Login, 1 = Register

  const passwordInputRef = useRef(null);

  const { handleRegister, handleLogin } = useContext(AuthContext);

  useEffect(() => {
    // Focus password input when switching to login
    if (formState === 0 && passwordInputRef.current) {
      passwordInputRef.current.focus();
    }
  }, [formState]);
  const router = useNavigate();

  const handleAuth = async () => {
    setError("");

    if (!email || !password || (formState === 1 && !name)) {
      setError("Please fill in all required fields.");
      return;
    }

    let result;

    if (formState === 0) {
      result = await handleLogin(email, password);
      if (result.success) {
        toast.success(result.message);
        setEmail(""); // optional: clear email after login redirect
        setPassword("");
        router("/upload/resume");
      } else {
        toast.error(result.message);
        setError(result.message);
      }
    } else {
      // Register
      result = await handleRegister(name, email, password);
      if (result.success) {
        toast.success(result.message);
        setFormState(0); // Switch to login
        setPassword(""); // Clear password
        setName(""); // Clear name
        // Keep email intact for login
      } else {
        toast.error(result.message);
        setError(result.message);
      }
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Grid
        container
        component="main"
        sx={{
          height: "100vh",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#f4f6f8", // light gray background
        }}
      >
        <CssBaseline />

        <Grid
          component={Paper}
          elevation={3}
          square
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 3,
            padding: 5,
            backgroundColor: "white",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
            <LockOutlinedIcon />
          </Avatar>

          <Typography
            component="h1"
            variant="h5"
            sx={{ mb: 3, fontWeight: "bold" }}
          >
            {formState === 0 ? "Welcome Back" : "Create Account"}
          </Typography>

          <Box sx={{ display: "flex", gap: 2, mb: 3, width: "100%" }}>
            <Button
              variant={formState === 0 ? "contained" : "outlined"}
              onClick={() => setFormState(0)}
              fullWidth
              size="large"
            >
              Sign In
            </Button>
            <Button
              variant={formState === 1 ? "contained" : "outlined"}
              onClick={() => setFormState(1)}
              fullWidth
              size="large"
            >
              Sign Up
            </Button>
          </Box>

          <Box component="form" noValidate sx={{ mt: 1, width: "100%" }}>
            {formState === 1 && (
              <TextField
                margin="normal"
                required
                fullWidth
                label="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
              />
            )}

            <TextField
              margin="normal"
              required
              fullWidth
              label="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoFocus={formState === 0}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              inputRef={passwordInputRef}
            />

            {/* {error && (
          <Typography sx={{ color: "error.main", mt: 1, mb: 1, textAlign: "center" }}>
            {error}
          </Typography>
        )} */}
            <Button
              type="button"
              fullWidth
              variant="contained"
              color="secondary"
              size="large"
              sx={{ mt: 4, mb: 2, fontWeight: "bold" }}
              onClick={handleAuth}
            >
              {formState === 0 ? "Login" : "Register"}
            </Button>
          </Box>
        </Grid>

        <ToastContainer
          position="bottom-right"
          autoClose={4000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
      </Grid>
    </ThemeProvider>
  );
}
