import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function GoogleCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");
    const userParam = searchParams.get("user");

    if (!token || !userParam) {
      navigate("/login");
      return;
    }

    try {
      const user = JSON.parse(userParam);

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      navigate("/");
    } catch (error) {
      console.error("Erreur Google callback:", error);
      navigate("/login");
    }
  }, [searchParams, navigate]);

  return <p>Connexion Google en cours...</p>;
}