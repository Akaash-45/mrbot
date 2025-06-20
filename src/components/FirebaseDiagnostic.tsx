import React, { useState, useEffect } from "react";
import { validateFirebaseConfig } from "../lib/firebase-validator";
import {
  AlertTriangle,
  CheckCircle,
  XCircle,
  ExternalLink,
} from "lucide-react";

export const FirebaseDiagnostic: React.FC = () => {
  const [diagnostics, setDiagnostics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    runDiagnostics();
  }, []);

  const runDiagnostics = async () => {
    setLoading(true);

    const result = {
      envVars: {
        apiKey: !!import.meta.env.VITE_FIREBASE_API_KEY,
        authDomain: !!import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
        projectId: !!import.meta.env.VITE_FIREBASE_PROJECT_ID,
        appId: !!import.meta.env.VITE_FIREBASE_APP_ID,
      },
      validation: await validateFirebaseConfig(),
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    };

    setDiagnostics(result);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg">
          <div className="text-center">Running Firebase diagnostics...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold flex items-center">
              <AlertTriangle className="w-6 h-6 mr-2 text-yellow-600" />
              Firebase Diagnostic Report
            </h2>
            <button
              onClick={() => window.location.reload()}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          {/* Environment Variables Check */}
          <div className="mb-6">
            <h3 className="font-semibold mb-3">Environment Variables:</h3>
            <div className="space-y-2">
              {Object.entries(diagnostics.envVars).map(([key, exists]) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-sm font-mono">{key}:</span>
                  {exists ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-600" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Firebase Validation */}
          <div className="mb-6">
            <h3 className="font-semibold mb-3">Firebase Configuration:</h3>
            <div className="p-4 border rounded-lg">
              <div className="flex items-center mb-2">
                <span className="mr-2">Status:</span>
                {diagnostics.validation.isValid ? (
                  <div className="flex items-center text-green-600">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Valid
                  </div>
                ) : (
                  <div className="flex items-center text-red-600">
                    <XCircle className="w-4 h-4 mr-1" />
                    Invalid
                  </div>
                )}
              </div>

              {diagnostics.validation.errors.length > 0 && (
                <div className="mt-3">
                  <div className="text-sm font-medium text-red-600 mb-2">
                    Errors:
                  </div>
                  <ul className="text-sm text-red-600 space-y-1">
                    {diagnostics.validation.errors.map(
                      (error: string, index: number) => (
                        <li key={index} className="flex items-start">
                          <span className="mr-2">•</span>
                          <span>{error}</span>
                        </li>
                      ),
                    )}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Project Information */}
          <div className="mb-6">
            <h3 className="font-semibold mb-3">Project Information:</h3>
            <div className="space-y-2 text-sm">
              <div>
                <strong>Project ID:</strong>{" "}
                {diagnostics.projectId || "Not set"}
              </div>
              <div>
                <strong>Auth Domain:</strong>{" "}
                {diagnostics.authDomain || "Not set"}
              </div>
            </div>
          </div>

          {/* Quick Fix Actions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold mb-3 text-blue-800">
              Quick Fix Actions:
            </h3>
            <div className="space-y-3">
              <div>
                <strong>1. Enable Authentication in Firebase Console:</strong>
                <div className="mt-1">
                  <a
                    href={`https://console.firebase.google.com/project/${diagnostics.projectId}/authentication/providers`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-blue-600 hover:text-blue-800"
                  >
                    Open Firebase Authentication Settings
                    <ExternalLink className="w-4 h-4 ml-1" />
                  </a>
                </div>
              </div>

              <div>
                <strong>2. Enable these sign-in methods:</strong>
                <ul className="mt-1 text-sm text-gray-600 ml-4">
                  <li>• Email/Password</li>
                  <li>• Google (optional)</li>
                  <li>• GitHub (optional)</li>
                </ul>
              </div>

              <div>
                <strong>3. Add authorized domains:</strong>
                <div className="mt-1">
                  <a
                    href={`https://console.firebase.google.com/project/${diagnostics.projectId}/authentication/settings`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-blue-600 hover:text-blue-800"
                  >
                    Manage Authorized Domains
                    <ExternalLink className="w-4 h-4 ml-1" />
                  </a>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Add: localhost, 127.0.0.1
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={runDiagnostics}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Run Again
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
