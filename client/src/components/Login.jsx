/**
 * Login — auth modal for login / register / forgot-password UI.
 * Wired to existing /api/users/login and /api/users/register; forgot is UI-only.
 */
import React, { useState } from "react";
import { X, Mail, Lock, User } from "lucide-react";
import { useAppContext } from "../context/AppContext";
import { Button, Input } from "./ui";
import { YNALogo } from "../assets/YNALogo";
import toast from "react-hot-toast";

const Login = () => {
  const [state, setState] = useState("login");
  const { setShowUserLogin, setUser, axios, navigate } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    if (state === "forgot") {
      toast.success("If an account exists, reset instructions were sent.");
      setState("login");
      return;
    }
    try {
      setLoading(true);
      const { data } = await axios.post(`/api/users/${state}`, formData);
      if (data.success) {
        navigate("/");
        setUser(data.user);
        toast.success(data.message);
        setShowUserLogin(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("An error occurred while logging in");
      console.error("Error in submitHandler", error);
    } finally {
      setLoading(false);
    }
  };

  const titles = {
    login: { h: "Welcome back", p: "Sign in to continue shopping" },
    register: { h: "Create account", p: "Join YNA Grocery in a minute" },
    forgot: { h: "Reset password", p: "We'll send a reset link to your email" },
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in"
      onClick={() => setShowUserLogin(false)}
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-title"
    >
      <form
        onSubmit={submitHandler}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md bg-bg-white border border-border rounded-[28px] shadow-xl px-7 py-9 animate-scale-in"
      >
        <button
          type="button"
          onClick={() => setShowUserLogin(false)}
          className="absolute top-4 right-4 w-9 h-9 rounded-[12px] flex items-center justify-center text-text-tertiary hover:bg-surface-muted cursor-pointer"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex justify-center mb-6">
          <YNALogo size="small" />
        </div>

        <h1 id="auth-title" className="font-heading text-2xl font-bold text-text-primary text-center">
          {titles[state].h}
        </h1>
        <p className="text-text-secondary text-sm mt-1.5 text-center">{titles[state].p}</p>

        <div className="mt-7 space-y-4">
          {state === "register" && (
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary pointer-events-none" />
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Full name"
                required
                className="pl-11"
                autoComplete="name"
              />
            </div>
          )}
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary pointer-events-none" />
            <Input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              required
              className="pl-11"
              autoComplete="email"
            />
          </div>
          {state !== "forgot" && (
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary pointer-events-none" />
              <Input
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                required
                className="pl-11"
                autoComplete={state === "login" ? "current-password" : "new-password"}
              />
            </div>
          )}
        </div>

        {state === "login" && (
          <button
            type="button"
            onClick={() => setState("forgot")}
            className="mt-3 text-xs text-accent hover:text-accent-dark font-medium cursor-pointer"
          >
            Forgot password?
          </button>
        )}

        <Button type="submit" className="w-full mt-6" size="lg" loading={loading}>
          {state === "login" ? "Sign in" : state === "register" ? "Create account" : "Send reset link"}
        </Button>

        <p className="mt-5 text-center text-sm text-text-secondary">
          {state === "login" && (
            <>
              New here?{" "}
              <button type="button" onClick={() => setState("register")} className="text-primary font-semibold cursor-pointer">
                Create account
              </button>
            </>
          )}
          {state === "register" && (
            <>
              Already have an account?{" "}
              <button type="button" onClick={() => setState("login")} className="text-primary font-semibold cursor-pointer">
                Sign in
              </button>
            </>
          )}
          {state === "forgot" && (
            <button type="button" onClick={() => setState("login")} className="text-primary font-semibold cursor-pointer">
              Back to sign in
            </button>
          )}
        </p>
      </form>
    </div>
  );
};

export default Login;
