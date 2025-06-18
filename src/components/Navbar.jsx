import React from "react";
import { AppBar, Toolbar, Box, Typography, Button } from "@mui/material";

export default function Navbar() {
  const token = localStorage.getItem("token");
  const userName = localStorage.getItem("userName");

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
          <Button
            color="inherit"
            href="/"
            sx={{ p: 0, textTransform: "none", fontSize: "1.3rem", fontWeight: "bold" }}
          >
            <Box component="span" sx={{ color: "#007AFF" }}>
              Prior
            </Box>
            <Box component="span" sx={{ color: "#FF4081" }}>
              IA
            </Box>
          </Button>

          <Button
            color="inherit"
            onClick={() => {
              if (!token) {
                alert("Debes iniciar sesión para ver tus planificaciones.");
                return;
              }
              window.location.href = "/planes";
            }}
          >
            Planificaciones
          </Button>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          {token ? (
            <>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                ¡Hola, {userName || "Usuario"}!
              </Typography>
              <Button variant="contained" color="error" onClick={handleLogout}>
                Cerrar sesión
              </Button>
            </>
          ) : (
            <Button variant="contained" color="primary" href="/login">
              Iniciar sesión
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
