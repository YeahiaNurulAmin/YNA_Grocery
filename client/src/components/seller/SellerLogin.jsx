/**
 * SellerLogin — seller/admin authentication gate for /seller routes.
 * Posts to /api/seller/login; signup toggle remains UI-only.
 */
import { useState, useEffect } from "react";
import { Mail, Lock } from "lucide-react";
import { useAppContext } from "../../context/AppContext";
import { Button, Input } from "../ui";
import { YNALogo } from "../../assets/YNALogo";
import toast from "react-hot-toast";

const SellerLogin = () => {
  const { isSeller, setIsSeller, navigate, axios } = useAppContext();
  const [state, setState] = useState("login");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (isSeller) navigate("/seller");
  }, [isSeller, navigate]);

  const submitHandler = async (e) => {
    try {
      e.preventDefault();
      if (state !== "login") {
        toast.error("Seller signup is not available — use admin credentials.");
        return;
      }
      setLoading(true);
      const { data } = await axios.post("/api/seller/login", {
        email: formData.email,
        password: formData.password,
      });
      if (data.success) {
        setIsSeller(true);
        navigate("/seller");
        toast.success("Logged in successfully");
      } else {
        toast.error(data.message || "Login failed");
      }
    } catch (error) {
      toast.error("An error occurred during login");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (isSeller) return null;

  return (
    <div className="min-h-screen flex items-center justify-center gradient-hero px-4 py-12">
      <form
        onSubmit={submitHandler}
        className="w-full max-w-md bg-bg-white border border-border rounded-[28px] shadow-xl px-8 py-10 animate-scale-in"
      >
        <div className="flex justify-center mb-6">
          <YNALogo size="small" />
        </div>
        <h1 className="font-heading text-2xl font-bold text-center text-text-primary">
          Seller login
        </h1>
        <p className="text-sm text-text-secondary text-center mt-1.5">
          Sign in to manage products and orders
        </p>

        <div className="mt-8 space-y-4">
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
            <Input
              type="email"
              name="email"
              placeholder="Email"
              className="pl-11"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
            <Input
              type="password"
              name="password"
              placeholder="Password"
              className="pl-11"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <Button type="submit" className="w-full mt-6" size="lg" loading={loading}>
          Sign in
        </Button>

        <p className="text-center text-sm text-text-secondary mt-5">
          {state === "login" ? "Need an account?" : "Have an account?"}{" "}
          <button
            type="button"
            onClick={() => setState((prev) => (prev === "login" ? "register" : "login"))}
            className="text-primary font-semibold cursor-pointer"
          >
            {state === "login" ? "Sign up" : "Sign in"}
          </button>
        </p>
      </form>
    </div>
  );
};

export default SellerLogin;
