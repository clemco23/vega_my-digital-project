export const subscribeToNewsletter = async (email) => {
  const response = await fetch("http://localhost:3000/api/newsletter", {
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