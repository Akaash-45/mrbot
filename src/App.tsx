import { useState, useEffect } from "react";
import { AuthProvider } from "./contexts/AuthContext";
import { Dashboard } from "./components/Dashboard";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { FirebaseDiagnostic } from "./components/FirebaseDiagnostic";
import { Toaster } from "react-hot-toast";
import { validateEnvironment } from "./lib/env";
import { validateFirebaseConfig } from "./lib/firebase-validator";

function App() {
  const [showDiagnostic, setShowDiagnostic] = useState(false);
  const [firebaseValid, setFirebaseValid] = useState<boolean | null>(null);

  useEffect(() => {
    checkFirebaseConfig();
  }, []);

  const checkFirebaseConfig = async () => {
    const validation = await validateFirebaseConfig();
    setFirebaseValid(validation.isValid);

    // Show diagnostic if there are errors
    if (!validation.isValid) {
      setShowDiagnostic(true);
    }
  };

  // Validate environment variables on app start
  if (!validateEnvironment()) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-white flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            Configuration Error
          </h2>
          <p className="text-gray-600 mb-4">
            Missing required environment variables. Please check your .env file.
          </p>
          <p className="text-sm text-gray-500">
            Copy .env.example to .env and fill in your configuration values.
          </p>
        </div>
      </div>
    );
  }

  // Show Firebase diagnostic if needed
  if (showDiagnostic && firebaseValid === false) {
    return <FirebaseDiagnostic />;
  }

  return (
    <ErrorBoundary>
      <AuthProvider>
        <div className="min-h-screen">
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: "#1f2937",
                color: "#ffffff",
                border: "1px solid #374151",
                borderRadius: "12px",
                boxShadow:
                  "0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)",
                fontWeight: "500",
                fontSize: "14px",
                maxWidth: "400px",
              },
              success: {
                iconTheme: {
                  primary: "#ffffff",
                  secondary: "#1f2937",
                },
                style: {
                  border: "1px solid #ffffff",
                },
              },
              error: {
                iconTheme: {
                  primary: "#ffffff",
                  secondary: "#1f2937",
                },
                style: {
                  border: "1px solid #ef4444",
                  background: "#1f2937",
                },
              },
            }}
          />
          <Dashboard />
        </div>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
