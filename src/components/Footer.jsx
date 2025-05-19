import React from "react"
import { Box, Typography } from "@mui/material"

export default function Footer() {
  return (
    <Box sx={{ textAlign: "center", padding: "1.5rem", backgroundColor: "#f5f5f5", marginTop: "auto" }}>
      <Typography variant="body2" color="text.secondary">
        © 2025 PriorIA - Todos los derechos reservados
      </Typography>
    </Box>
  )
}
