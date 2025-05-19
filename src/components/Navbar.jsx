import React from "react"
import { AppBar, Toolbar, Box, Typography } from "@mui/material"

export default function Navbar() {
  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", gap: "1.5rem" }}>
          <Typography variant="button" sx={{ color: "#007AFF", fontWeight: "bold" }}>Inicio</Typography>
          <Typography variant="button">Cargar Plantilla</Typography>
          <Typography variant="button">Planificaciones</Typography>
          <Typography variant="button">Mi Perfil</Typography>
        </Box>
      </Toolbar>
    </AppBar>
  )
}
