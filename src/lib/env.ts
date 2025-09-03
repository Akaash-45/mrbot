export const validateEnvironment = () => {
  const requiredEnvVars = [
    "VITE_FIREBASE_API_KEY",
    "VITE_FIREBASE_AUTH_DOMAIN",
    "VITE_FIREBASE_PROJECT_ID",
    "VITE_FIREBASE_STORAGE_BUCKET",
    "VITE_FIREBASE_MESSAGING_SENDER_ID",
    "VITE_FIREBASE_APP_ID",
    "VITE_GEMINI_API_KEY",
  ];

  const missingVars = requiredEnvVars.filter(
    (varName) => !import.meta.env[varName],
  );

  if (missingVars.length > 0) {
    console.error("Missing environment variables:", missingVars);
    return false;
  }

  return true;
};

export const getEnvVar = (name: string): string => {
  const value = import.meta.env[name];
  if (!value) {
    throw new Error(`Environment variable ${name} is not defined`);
  }
  return value;
};
