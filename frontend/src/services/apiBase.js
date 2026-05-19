const rawApiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export const apiBaseUrl = rawApiUrl.endsWith("/api")
  ? rawApiUrl
  : `${rawApiUrl.replace(/\/+$/, "")}/api`;

export const backendOrigin = apiBaseUrl.replace(/\/api$/, "");
