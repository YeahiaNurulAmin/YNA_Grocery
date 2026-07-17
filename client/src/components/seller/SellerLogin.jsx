/**
 * SellerLogin — seller/admin authentication gate for /seller routes.
 * Posts to /api/seller/login only (no signup toggle).
 */
import { useState, useEffect } from "react";
import { Mail, Lock } from "lucide-react";
import { useAppContext } from "../../context/AppContext";
import { Button, Input } from "../ui";
import { YNALogo } from "../../assets/YNALogo";
import toast from "react-hot-toast";

const SellerLogin = () => {
  const { isSeller, setIsSeller, navigate, axios } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (isSeller) navigate("/seller");
  }, [isSeller, navigate]);

  const submitHandler = async (e) => {
    try {
      e.preventDefault();
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
      const status = error.response?.status;
      const message = error.response?.data?.message;
      if (status === 401 && message) {
        toast.error(message);
      } else {
        toast.error(message || "An error occurred during login");
      }
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
      </form>
    </div>
  );
};

export default SellerLogin;
