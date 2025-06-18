import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  MenuItem,
  CircularProgress,
  Alert,
} from "@mui/material";
import axios from "axios";
import Navbar from "./Navbar";
import Footer from "./Footer";

const CreatePlanPage = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [academicPeriod, setAcademicPeriod] = useState("2024-2");
  const [priority, setPriority] = useState("high");
  const [profileType, setProfileType] = useState("balanced");
  const [maxCredits, setMaxCredits] = useState(22);
  const [difficulty, setDifficulty] = useState("medium");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [token] = useState(localStorage.getItem("token"));
  const [uploadedFileId, setUploadedFileId] = useState("");

  useEffect(() => {
    const fileId = localStorage.getItem("uploadedFileId");
    if (!fileId) {
      setError("No se encontró el archivo validado. Por favor vuelve a cargar uno.");
    } else {
      setUploadedFileId(fileId);
    }
  }, []);

  const handleSubmit = async () => {
    setSubmitting(true);
    setError("");
    setSuccessMessage("");

    try {
      const response = await axios.post(
        "http://localhost:3000/api/v1/study-plans",
        {
          title,
          description,
          uploaded_file_id: uploadedFileId,
          academic_period: academicPeriod,
          priority,
          preferences: {
            profile_type: profileType,
            max_credits_per_semester: maxCredits,
            preferred_difficulty: difficulty,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const planId = response.data?.data?.plan?.id;
      setSuccessMessage("Plan creado. Redirigiendo para esperar procesamiento...");
      setTimeout(() => {
        window.location.href = `/plan/${planId}`;
      }, 1500);
    } catch (err: any) {
      const msg = err.response?.data?.message || "Error al crear el plan";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#f8f9fa",
      }}
    >
      <Navbar />
      <Box sx={{ flex: 1, p: 4, maxWidth: 600, mx: "auto" }}>
        <Typography variant="h4" gutterBottom>
          Crear Plan de Estudio
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {successMessage && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {successMessage}
          </Alert>
        )}

        <TextField
          label="Título"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Descripción"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Período Académico"
          value={academicPeriod}
          onChange={(e) => setAcademicPeriod(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Prioridad"
          select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          fullWidth
          margin="normal"
        >
          <MenuItem value="high">Alta</MenuItem>
          <MenuItem value="medium">Media</MenuItem>
          <MenuItem value="low">Baja</MenuItem>
        </TextField>
        <TextField
          label="Tipo de perfil"
          select
          value={profileType}
          onChange={(e) => setProfileType(e.target.value)}
          fullWidth
          margin="normal"
        >
          <MenuItem value="balanced">Balanceado</MenuItem>
          <MenuItem value="light">Ligero</MenuItem>
          <MenuItem value="intensive">Intensivo</MenuItem>
        </TextField>
        <TextField
          label="Máx. créditos por semestre"
          type="number"
          value={maxCredits}
          onChange={(e) => setMaxCredits(parseInt(e.target.value))}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Dificultad preferida"
          select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          fullWidth
          margin="normal"
        >
          <MenuItem value="easy">Fácil</MenuItem>
          <MenuItem value="medium">Media</MenuItem>
          <MenuItem value="hard">Difícil</MenuItem>
        </TextField>

        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={submitting}
          sx={{ mt: 3 }}
        >
          {submitting ? <CircularProgress size={20} /> : "Crear Plan"}
        </Button>
      </Box>
      <Footer />
    </Box>
  );
};

export default CreatePlanPage;
