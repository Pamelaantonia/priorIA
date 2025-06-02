import React from "react";
import { AppBar, Toolbar, Box, Typography, Button } from "@mui/material";
import { useAuth0 } from "@auth0/auth0-react";

export default function Navbar() {
  const { loginWithRedirect, logout, isAuthenticated, user } = useAuth0();

  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", gap: "1.5rem" }}>
          <Typography variant="button" sx={{ color: "#007AFF", fontWeight: "bold" }}>Inicio</Typography>
          <Typography variant="button">Cargar Plantilla</Typography>
          <Typography variant="button">Planificaciones</Typography>
          <Typography variant="button">Mi Perfil</Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          {isAuthenticated && (
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {user?.name}
            </Typography>
          )}

          {!isAuthenticated ? (
            <Button variant="outlined" onClick={() => loginWithRedirect()}>
              Iniciar sesión
            </Button>
          ) : (
            <Button
              variant="contained"
              color="error"
              onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
            >
              Cerrar sesión
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
