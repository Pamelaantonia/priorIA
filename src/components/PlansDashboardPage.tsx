import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  CircularProgress,
  Alert,
  Grid,
  Chip,
  Stack,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

const PlansDashboardPage = () => {
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [token] = useState(localStorage.getItem("token"));
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/v1/study-plans", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setPlans(res.data.data.plans || []);
      } catch (err: any) {
        const msg = err.response?.data?.message || "Error al obtener los planes";
        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, [token]);

  const statusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "success";
      case "processing":
        return "warning";
      case "error":
        return "error";
      default:
        return "default";
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />
      <Box sx={{ flex: 1, p: { xs: 3, md: 6 }, maxWidth: 1200, mx: "auto" }}>
        <Typography variant="h4" gutterBottom>
          Mis Planes de Estudio
        </Typography>

        {loading ? (
          <CircularProgress />
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : plans.length === 0 ? (
          <Typography>No has creado planes aún.</Typography>
        ) : (
          <Grid container spacing={3}>
            {plans.map((plan, idx) => (
              <Grid item xs={12} sm={6} md={4} key={idx}>
                <Paper
                  elevation={3}
                  sx={{
                    p: 3,
                    borderRadius: 2,
                    display: "flex",
                    flexDirection: "column",
                    gap: 1,
                    height: "100%",
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {plan.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Período académico: {plan.academic_period}
                  </Typography>
                  <Chip
                    label={plan.status}
                    color={statusColor(plan.status)}
                    size="small"
                    sx={{ mt: 1, width: "fit-content" }}
                  />

                  <Box sx={{ flexGrow: 1 }} />

                  <Stack spacing={1} sx={{ mt: 2 }}>
                    <Button
                      variant="outlined"
                      size="small"
                      fullWidth
                      onClick={() => navigate(`/plan/${plan.id}`)}
                    >
                      Ver detalles
                    </Button>
                  </Stack>
                </Paper>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
      <Footer />
    </Box>
  );
};

export default PlansDashboardPage;
