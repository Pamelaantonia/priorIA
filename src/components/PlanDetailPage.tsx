import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  CircularProgress,
  Typography,
  Alert,
  Paper,
  Divider,
  Stack,
  Button,
} from "@mui/material";
import axios from "axios";
import Navbar from "./Navbar";
import Footer from "./Footer";

const PlanDetailPage = () => {
  const { id: planId } = useParams();
  const [token] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [plan, setPlan] = useState<any>(null);
  const [retrying, setRetrying] = useState(false);

  const fetchPlan = async () => {
    const res = await axios.get(`http://localhost:3000/api/v1/study-plans/${planId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data.data.plan;
  };

  const waitUntilPlanReady = async () => {
    try {
      let currentPlan = await fetchPlan();
      while (currentPlan.status === "processing") {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        currentPlan = await fetchPlan();
      }
      setPlan(currentPlan);
    } catch (err: any) {
      const msg = err.response?.data?.message || "Error al cargar el plan";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    waitUntilPlanReady();
  }, [planId]);

  const handleRegenerate = async () => {
    setRetrying(true);
    try {
      await axios.post(
        `http://localhost:3000/api/v1/progress/plan/${planId}/regenerate`,
        {
          preferences: plan?.generation_metadata?.preferences || {},
          priority: plan?.priority,
          academic_period: plan?.academic_period,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Regeneración iniciada. Recargando...");
      setTimeout(() => window.location.reload(), 2000);
    } catch (err: any) {
      const msg = err.response?.data?.message || "No se pudo iniciar la regeneración.";
      alert(msg);
    } finally {
      setRetrying(false);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />
      <Box sx={{ flex: 1, p: 4, maxWidth: 1200, mx: "auto" }}>
        {loading ? (
          <CircularProgress />
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
          <>
            <Typography variant="h4" gutterBottom>
              {plan.title}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              Estado: {plan.status}
            </Typography>

            {plan.status === "error" && plan.generation_metadata?.error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                Error al generar el plan: {plan.generation_metadata.error}
              </Alert>
            )}

            {plan.status === "error" && (
              <Stack direction="row" spacing={2} sx={{ my: 2 }}>
                <Button
                  variant="contained"
                  color="warning"
                  onClick={handleRegenerate}
                  disabled={retrying}
                >
                  {retrying ? "Reintentando..." : "Reintentar generación"}
                </Button>
              </Stack>
            )}

            <Divider sx={{ my: 2 }} />

            {plan.subjects && plan.subjects.length > 0 ? (
              <Box
                sx={{
                  display: "grid",
                  gap: 2,
                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: "1fr 1fr",
                    md: "1fr 1fr 1fr",
                  },
                }}
              >
                {plan.subjects.map((subject: any, idx: number) => (
                  <Paper key={idx} sx={{ p: 2 }}>
                    <Typography variant="h6">{subject.name}</Typography>
                    <Typography variant="body2">Código: {subject.id}</Typography>
                    <Typography variant="body2">Créditos: {subject.credits}</Typography>
                    <Typography variant="body2">Semestre: {subject.semester}</Typography>
                    <Typography variant="body2">Tipo: {subject.type}</Typography>
                  </Paper>
                ))}
              </Box>
            ) : (
              <Typography>No hay materias aún.</Typography>
            )}

            {plan.ai_analysis && (
              <>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6">Análisis de IA</Typography>
                <Typography variant="body2">
                  Score: {plan.ai_analysis.recommendation_score}
                </Typography>
                <Typography variant="body2">
                  Dificultad: {plan.ai_analysis.difficulty_assessment}
                </Typography>
              </>
            )}
          </>
        )}
      </Box>
      <Footer />
    </Box>
  );
};

export default PlanDetailPage;
