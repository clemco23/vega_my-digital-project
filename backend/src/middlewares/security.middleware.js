const TAG_PATTERN = /<[^>]*>/g;
const NULL_BYTE_PATTERN = /\0/g;

const sanitizeString = (value) => {
  if (typeof value !== "string") {
    return value;
  }

  return value.replace(NULL_BYTE_PATTERN, "").replace(TAG_PATTERN, "").trim();
};

const sanitizePayload = (value) => {
  if (Array.isArray(value)) {
    return value.map(sanitizePayload);
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, nestedValue]) => [
        key,
        sanitizePayload(nestedValue),
      ])
    );
  }

  return sanitizeString(value);
};

const sanitizeRequestPayload = (req, _res, next) => {
  if (req.body && typeof req.body === "object") {
    req.body = sanitizePayload(req.body);
  }

  if (req.query && typeof req.query === "object") {
    req.query = sanitizePayload(req.query);
  }

  next();
};

const applySecurityHeaders = (_req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()"
  );

  next();
};

module.exports = {
  applySecurityHeaders,
  sanitizeRequestPayload,
};
