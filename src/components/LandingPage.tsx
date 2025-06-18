import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  Modal,
  CircularProgress,
  Backdrop,
  Fade,
  Alert,
  LinearProgress,
} from "@mui/material";
import axios from "axios";
import Navbar from "./Navbar";
import Footer from "./Footer";

const modalStyle = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
  display: "flex",
  flexDirection: "column",
  gap: 2,
};

const LandingPage = () => {
  const [openUploadModal, setOpenUploadModal] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [token] = useState(localStorage.getItem("token"));
  const [userName] = useState(localStorage.getItem("userName"));

  const handleDownloadTemplate = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/v1/files/template", {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "template.xlsx");
      document.body.appendChild(link);
      link.click();
    } catch {
      alert("Error al descargar la plantilla.");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
  };

  const handleUploadAndValidate = async () => {
    if (!file) return;

    setUploading(true);
    setValidationErrors([]);
    setUploadProgress(0);
    setUploadComplete(false);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("description", "Archivo subido desde el frontend");

    let uploadedFileId: string | null = null;

    try {
      const uploadRes = await axios.post(
        "http://localhost:3000/api/v1/files/upload",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            const percent = Math.round(
              (progressEvent.loaded * 100) / (progressEvent.total || 1)
            );
            setUploadProgress(percent);
            if (percent === 100) {
              setUploadComplete(true);
            }
          },
        }
      );
      uploadedFileId = uploadRes.data.data.file.id;
    } catch (err: any) {
      const msg = err.response?.data?.message || "Error al subir el archivo.";
      alert(`Error en subida: ${msg}`);
      setUploading(false);
      return;
    }

    try {
      const validateRes = await axios.post(
        `http://localhost:3000/api/v1/files/${uploadedFileId}/validate`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const validation = validateRes.data?.data?.validation;
      const totalCourses = validation?.summary?.totalCourses || 0;

      if (validation?.isValid && totalCourses > 0) {
        try {
          // Paso adicional: análisis del archivo
          await axios.post(
            `http://localhost:3000/api/v1/files/${uploadedFileId}/analyze`,
            {},
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          alert("Archivo válido y analizado. Redirigiendo para crear el plan...");
          localStorage.setItem("uploadedFileId", uploadedFileId!);
          window.location.href = "/crear-plan";
        } catch (analyzeError: any) {
          const msg =
            analyzeError.response?.data?.message || "Error al analizar el archivo.";
          alert(`Error: ${msg}`);
        }
      } else if (totalCourses === 0) {
        alert("El archivo fue subido pero no contiene ramos válidos. Por favor revisa la estructura.");
      } else {
        setValidationErrors(validation?.errors || ["Archivo inválido"]);
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || "Error al validar el archivo.";
      alert(`Error en validación: ${msg}`);
    } finally {
      setUploading(false);
      setUploadProgress(0);
      setUploadComplete(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "linear-gradient(135deg, #e0f2ff, #ffffff)",
      }}
    >
      <Navbar />

      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          px: 2,
        }}
      >
        <Typography variant="h3" sx={{ fontWeight: "bold", mb: 2 }}>
          Organiza tu semestre con{" "}
          <Box component="span" sx={{ color: "#007AFF" }}>
            Prior
          </Box>
          <Box component="span" sx={{ color: "#FF4081" }}>
            IA
          </Box>
        </Typography>

        <Typography variant="body1" sx={{ color: "#555", maxWidth: 600, mb: 4 }}>
          Una herramienta inteligente y visual para planificar tu carga académica sin complicaciones.
        </Typography>

        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", justifyContent: "center" }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={handleDownloadTemplate}
          >
            Descargar plantilla
          </Button>

          <Button
            variant="outlined"
            color="secondary"
            size="large"
            onClick={() => {
              if (!token) {
                alert("Debes iniciar sesión para subir tu archivo.");
                return;
              }
              setOpenUploadModal(true);
            }}
          >
            Subir plantilla
          </Button>
        </Box>

        {validationErrors.length > 0 && (
          <Box sx={{ mt: 3, maxWidth: 400 }}>
            <Alert severity="error">
              <strong>Errores de validación:</strong>
              <ul>
                {validationErrors.map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            </Alert>
          </Box>
        )}
      </Box>

      <Modal
        open={openUploadModal}
        onClose={() => setOpenUploadModal(false)}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{ timeout: 300 }}
      >
        <Fade in={openUploadModal}>
          <Box sx={modalStyle}>
            <Typography variant="h6">Subir plantilla Excel</Typography>

            <input type="file" accept=".xlsx" onChange={handleFileChange} />

            {uploading && (
              <Box sx={{ width: "100%", mt: 2 }}>
                <LinearProgress variant="determinate" value={uploadProgress} />
              </Box>
            )}

            {uploadComplete && (
              <Alert severity="info" sx={{ mt: 2 }}>
                ¡Archivo subido! Validando automáticamente...
              </Alert>
            )}

            <Button
              onClick={handleUploadAndValidate}
              disabled={uploading || !file}
            >
              {uploading ? <CircularProgress size={20} /> : "Subir y validar"}
            </Button>
          </Box>
        </Fade>
      </Modal>

      <Footer />
    </Box>
  );
};

export default LandingPage;
