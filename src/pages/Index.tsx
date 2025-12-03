import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // For now, redirect to auth page
    navigate("/auth");
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <p className="text-foreground">Cargando...</p>
    </div>
  );
};

export default Index;
