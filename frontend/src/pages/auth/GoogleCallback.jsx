import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getCurrentUser } from "../../services/auth.service";

export default function GoogleCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");
    const userParam = searchParams.get("user");
    let parsedUser = null;

    if (!token || !userParam) {
      navigate("/login");
      return;
    }

    const syncCurrentUser = async () => {
      try {
        const data = await getCurrentUser();
        localStorage.setItem("user", JSON.stringify(data.data));
      } catch (error) {
        console.error("Erreur sync profil Google:", error);
        if (parsedUser) {
          localStorage.setItem("user", JSON.stringify(parsedUser));
        }
      } finally {
        navigate("/");
      }
    };

    try {
      parsedUser = JSON.parse(userParam);

      localStorage.setItem("token", token);
      void syncCurrentUser();
    } catch (error) {
      console.error("Erreur Google callback:", error);
      navigate("/login");
    }
  }, [searchParams, navigate]);

  return <p>Connexion Google en cours...</p>;
}
