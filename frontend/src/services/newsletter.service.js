const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const subscribeToNewsletter = async (email) => {
  const response = await fetch(`${API_URL}/api/newsletter`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Erreur lors de l'inscription.");
  }

  return data;
};