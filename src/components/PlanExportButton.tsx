import React, { useState } from "react";
import { Button, CircularProgress } from "@mui/material";
import axios from "axios";

type Props = {
  planId: string;
  format: "pdf" | "excel";
};

const PlanExportButton = ({ planId, format }: Props) => {
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  const handleExport = async () => {
    setLoading(true);

    try {
      const endpoint =
        format === "pdf"
          ? "http://localhost:3000/api/v1/export/pdf/study-plan"
          : "http://localhost:3000/api/v1/export/excel/academic-data";

      const payload =
        format === "pdf"
          ? { planId }
          : { userId: null, includeAnalytics: true }; // backend puede usar el token para detectar user

      const res = await axios.post(endpoint, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const fileUrl = res.data.data?.url || res.data.data?.downloadUrl;
      if (fileUrl) {
        window.open(fileUrl, "_blank");
      } else {
        alert("No se pudo obtener el archivo exportado");
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message;
      alert("Error al exportar: " + msg);
    } finally {
      setLoading(false);
    }
  };

  const label = format === "pdf" ? "Exportar PDF" : "Exportar Excel";

  return (
    <Button
      variant="outlined"
      onClick={handleExport}
      disabled={loading}
      sx={{ minWidth: 140 }}
    >
      {loading ? <CircularProgress size={20} /> : label}
    </Button>
  );
};

export default PlanExportButton;
