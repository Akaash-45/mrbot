import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth, googleProvider, githubProvider } from "../lib/firebase";
import {
  validateFirebaseConfig,
  getFirebaseProjectUrl,
} from "../lib/firebase-validator";
import toast from "react-hot-toast";
import { X, Github, Eye, EyeOff } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setShowPassword(false);
    setShowForgotPassword(false);
    setLoading(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const getFirebaseErrorMessage = (error: any) => {
    const errorCode = error.code;
    console.error("Firebase Auth Error:", errorCode, error.message);

    switch (errorCode) {
      case "auth/user-not-found":
        return "No account found with this email address.";
      case "auth/wrong-password":
        return "Incorrect password. Please try again.";
      case "auth/email-already-in-use":
        return "An account with this email already exists.";
      case "auth/weak-password":
        return "Password should be at least 6 characters long.";
      case "auth/invalid-email":
        return "Please enter a valid email address.";
      case "auth/too-many-requests":
        return "Too many failed attempts. Please try again later.";
      case "auth/popup-closed-by-user":
        return "Sign-in was cancelled.";
      case "auth/network-request-failed":
        return "Network error. Please check your connection.";
      case "auth/invalid-api-key":
        return "Invalid Firebase API key. Please check your configuration.";
      case "auth/app-deleted":
        return "Firebase project has been deleted. Please check your configuration.";
      case "auth/app-not-authorized":
        return "App not authorized to use Firebase Authentication. Check your Firebase console.";
      case "auth/web-storage-unsupported":
        return "Browser storage is not supported or disabled.";
      case "auth/operation-not-allowed":
        return "This authentication method is not enabled. Please enable it in Firebase console.";
      default:
        // Show both error code and message for debugging
        return `Authentication Error (${errorCode}): ${error.message}`;
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      toast.error("Please fill in all fields.");
      return;
    }

    setLoading(true);

    try {
      // Validate Firebase configuration first
      const validation = await validateFirebaseConfig();
      if (!validation.isValid) {
        console.error("Firebase configuration errors:", validation.errors);
        toast.error(
          "Firebase configuration error. Please check the console for details.",
        );
        validation.errors.forEach((error) => console.error(error));
        setLoading(false);
        return;
      }

      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        toast.success("Welcome back! Successfully signed in.");
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
        toast.success("Welcome! Account created successfully.");
      }
      handleClose();
    } catch (error: any) {
      console.error("Authentication error:", error);
      const errorMessage = getFirebaseErrorMessage(error);
      toast.error(errorMessage);

      // Show additional help for configuration errors
      if (
        error.code?.includes("auth/invalid-api-key") ||
        error.code?.includes("auth/app-not-authorized")
      ) {
        setTimeout(() => {
          toast.error(
            `Please check Firebase console: ${getFirebaseProjectUrl()}`,
            { duration: 8000 },
          );
        }, 1000);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSocialAuth = async (provider: any, providerName: string) => {
    setLoading(true);
    try {
      await signInWithPopup(auth, provider);
      toast.success(`Welcome! Successfully signed in with ${providerName}.`);
      handleClose();
    } catch (error: any) {
      toast.error(getFirebaseErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      toast.error("Please enter your email address first.");
      return;
    }

    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("Password reset email sent! Check your inbox.");
      setShowForgotPassword(false);
    } catch (error: any) {
      toast.error(getFirebaseErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", duration: 0.5 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-gray-900 rounded-2xl shadow-2xl overflow-hidden border border-gray-800"
          >
            {/* Header */}
            <div className="relative p-6 bg-black text-white">
              <button
                onClick={handleClose}
                className="absolute right-4 top-4 p-2 hover:bg-gray-800 rounded-full transition-colors text-white"
              >
                <X size={20} />
              </button>
              <h2 className="text-2xl font-bold text-center">
                {showForgotPassword
                  ? "Reset Password"
                  : isLogin
                    ? "Welcome Back"
                    : "Create Account"}
              </h2>
              <p className="text-center text-gray-400 mt-1">
                {showForgotPassword
                  ? "Enter your email to reset password"
                  : isLogin
                    ? "Sign in to your account"
                    : "Join us today"}
              </p>
            </div>

            <div className="p-6">
              {showForgotPassword ? (
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="reset-email"
                      className="block text-sm font-medium text-white mb-2"
                    >
                      Email Address
                    </label>
                    <input
                      id="reset-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full border border-gray-700 bg-gray-800 text-white focus:border-white focus:ring-1 focus:ring-white p-3 rounded-lg outline-none transition-colors placeholder-gray-500"
                      placeholder="Enter your email"
                      disabled={loading}
                    />
                  </div>
                  <button
                    onClick={handleForgotPassword}
                    className="w-full bg-white text-black hover:bg-gray-200 p-3 rounded-lg font-medium transition-all disabled:opacity-50"
                    disabled={loading}
                  >
                    {loading ? "Sending..." : "Send Reset Email"}
                  </button>
                  <button
                    onClick={() => setShowForgotPassword(false)}
                    className="w-full text-gray-400 hover:text-white transition-colors"
                  >
                    Back to Sign In
                  </button>
                </div>
              ) : (
                <>
                  <form onSubmit={handleEmailAuth} className="space-y-4 mb-6">
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-white mb-2"
                      >
                        Email Address
                      </label>
                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full border border-gray-700 bg-gray-800 text-white focus:border-white focus:ring-1 focus:ring-white p-3 rounded-lg outline-none transition-colors placeholder-gray-500"
                        placeholder="Enter your email"
                        disabled={loading}
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="password"
                        className="block text-sm font-medium text-white mb-2"
                      >
                        Password
                      </label>
                      <div className="relative">
                        <input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full border border-gray-700 bg-gray-800 text-white focus:border-white focus:ring-1 focus:ring-white p-3 pr-12 rounded-lg outline-none transition-colors placeholder-gray-500"
                          placeholder="Enter your password"
                          disabled={loading}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                        >
                          {showPassword ? (
                            <EyeOff size={20} />
                          ) : (
                            <Eye size={20} />
                          )}
                        </button>
                      </div>
                    </div>

                    {isLogin && (
                      <button
                        type="button"
                        onClick={() => setShowForgotPassword(true)}
                        className="text-sm text-gray-400 hover:text-white transition-colors"
                      >
                        Forgot your password?
                      </button>
                    )}

                    <button
                      type="submit"
                      className="w-full bg-white text-black hover:bg-gray-200 p-3 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={loading}
                    >
                      {loading
                        ? "Processing..."
                        : isLogin
                          ? "Sign In"
                          : "Create Account"}
                    </button>
                  </form>

                  <div className="relative mb-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-700"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-gray-900 text-gray-400">
                        Or continue with
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    <button
                      onClick={() => handleSocialAuth(googleProvider, "Google")}
                      className="w-full border border-gray-700 bg-gray-800 hover:bg-gray-700 text-white p-3 rounded-lg flex items-center justify-center space-x-2 transition-colors disabled:opacity-50"
                      disabled={loading}
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                      <span>Continue with Google</span>
                    </button>
                    <button
                      onClick={() => handleSocialAuth(githubProvider, "GitHub")}
                      className="w-full border border-gray-700 bg-gray-800 hover:bg-gray-700 text-white p-3 rounded-lg flex items-center justify-center space-x-2 transition-colors disabled:opacity-50"
                      disabled={loading}
                    >
                      <Github className="w-5 h-5" />
                      <span>Continue with GitHub</span>
                    </button>
                  </div>

                  <div className="text-center">
                    <button
                      onClick={() => setIsLogin(!isLogin)}
                      className="text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      {isLogin
                        ? "Don't have an account? Sign up"
                        : "Already have an account? Sign in"}
                    </button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
