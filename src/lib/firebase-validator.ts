import { auth } from "./firebase";

export const validateFirebaseConfig = async () => {
  const errors: string[] = [];

  // Check environment variables
  const requiredVars = {
    VITE_FIREBASE_API_KEY: import.meta.env.VITE_FIREBASE_API_KEY,
    VITE_FIREBASE_AUTH_DOMAIN: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    VITE_FIREBASE_PROJECT_ID: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    VITE_FIREBASE_APP_ID: import.meta.env.VITE_FIREBASE_APP_ID,
  };

  Object.entries(requiredVars).forEach(([key, value]) => {
    if (!value) {
      errors.push(`Missing environment variable: ${key}`);
    }
  });

  // Check if Firebase is initialized
  try {
    if (!auth.app) {
      errors.push("Firebase app not initialized");
    }
  } catch (error) {
    errors.push(`Firebase initialization error: ${error}`);
  }

  // Check if auth domain is accessible
  const authDomain = import.meta.env.VITE_FIREBASE_AUTH_DOMAIN;
  if (authDomain) {
    try {
      // Try to fetch the Firebase auth config
      const response = await fetch(
        `https://${authDomain}/__/auth/config?appId=${import.meta.env.VITE_FIREBASE_APP_ID}`,
        {
          method: "HEAD",
          mode: "no-cors",
        },
      );
      // If we get here without error, the domain is likely accessible
    } catch (error) {
      errors.push(`Firebase auth domain not accessible: ${authDomain}`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const getFirebaseProjectUrl = () => {
  const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;
  return `https://console.firebase.google.com/project/${projectId}/authentication/providers`;
};
