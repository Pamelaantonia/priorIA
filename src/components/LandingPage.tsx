import React from "react";
import { Box, Button, Container, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import styles from "./landingPage.styles";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useAuth0 } from "@auth0/auth0-react";

const features = [
  {
    title: "Descarga de plantilla",
    description: "Descarga nuestra plantilla estandarizada para ingresar tu información académica.",
    icon: "⬇️",
  },
  {
    title: "Cargar plantilla",
    description: "Sube tu plantilla completada para iniciar el procesamiento de tu plan de estudio.",
    icon: "📤",
  },
  {
    title: "Planificaciones",
    description: "Revisa los resultados del procesamiento y obtén tu plan de estudio optimizado.",
    icon: "📋",
  },
];

export default function LandingPage() {
  const { isAuthenticated } = useAuth0();

  return (
    <Box sx={styles.page}>
      <Navbar />

      {/* Hero Section */}
      <Box sx={styles.hero}>
        <Typography sx={styles.title}>Bienvenido a PriorIA</Typography>
        <Typography sx={styles.subtitle}>
          La herramienta que te ayuda a planificar tu carga académica de manera eficiente.
        </Typography>

        <Box sx={styles.buttonGroup}>
          <Button variant="contained" color="primary" sx={styles.actionButton}>
            Descargar plantilla
          </Button>

          {isAuthenticated && (
            <Button variant="outlined" sx={styles.actionButton}>
              Cargar plantilla
            </Button>
          )}
        </Box>
      </Box>

      {/* Funcionalidades */}
      <Container maxWidth={false} sx={styles.section}>
        <Typography sx={styles.sectionTitle}>Funcionalidades principales</Typography>
        <Box display="flex" justifyContent="center" flexWrap="wrap" gap={3}>
          {features.map((item) => (
            <Box
              key={item.title}
              sx={{
                ...styles.card,
                flex: "1 1 300px",
              }}
            >
              <Typography sx={styles.cardIcon}>{item.icon}</Typography>
              <Typography sx={styles.cardTitle}>{item.title}</Typography>
              <Typography sx={styles.cardText}>{item.description}</Typography>
            </Box>
          ))}
        </Box>
      </Container>

      <Footer />
    </Box>
  );
}
