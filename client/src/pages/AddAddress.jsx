/**
 * AddAddress — shipping address form for checkout.
 * Route: /add-address. Posts to existing /api/address/add.
 */
import { useState, useEffect } from "react";
import { MapPin } from "lucide-react";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import { useLanguage } from "../context/LanguageContext";
import { Button, Input, Card, SectionHeader } from "../components/ui";
import toast from "react-hot-toast";

const AddAddress = () => {
  const { navigate, axios, user } = useAppContext();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    phone: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      setLoading(true);
      const { data } = await axios.post("/api/address/add", { address: formData });
      if (data.success) {
        toast.success(t("addaddress.success"));
        navigate("/cart");
      } else {
        toast.error(data.message || t("addaddress.failed"));
      }
    } catch (error) {
      toast.error(t("addaddress.error"));
      console.error("Error adding address:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) navigate("/cart");
  }, []);

  return (
    <div className="py-10 md:py-14 mb-nav animate-fade-in">
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 items-center">
        <div>
          <SectionHeader
            eyebrow={t("addaddress.eyebrow")}
            title={t("addaddress.title")}
            subtitle={t("addaddress.subtitle")}
            className="mb-6"
          />
          <Card className="p-6!">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Input name="firstName" label={t("addaddress.first_name")} value={formData.firstName} onChange={handleChange} required />
                <Input name="lastName" label={t("addaddress.last_name")} value={formData.lastName} onChange={handleChange} required />
              </div>
              <Input name="email" type="email" label={t("addaddress.email")} value={formData.email} onChange={handleChange} required />
              <Input name="street" label={t("addaddress.street")} value={formData.street} onChange={handleChange} required />
              <div className="grid grid-cols-2 gap-3">
                <Input name="city" label={t("addaddress.city")} value={formData.city} onChange={handleChange} required />
                <Input name="state" label={t("addaddress.state")} value={formData.state} onChange={handleChange} required />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Input name="zipCode" label={t("addaddress.zip")} value={formData.zipCode} onChange={handleChange} required />
                <Input name="country" label={t("addaddress.country")} value={formData.country} onChange={handleChange} required />
              </div>
              <Input name="phone" type="tel" label={t("addaddress.phone")} value={formData.phone} onChange={handleChange} required />
              <Button type="submit" className="w-full" size="lg" loading={loading}>
                <MapPin className="w-4 h-4" /> {t("addaddress.save")}
              </Button>
            </form>
          </Card>
        </div>
        <div className="hidden md:flex justify-center">
          <img
            src={assets.add_address_iamge}
            alt="Add address"
            className="max-w-md w-full opacity-90"
          />
        </div>
      </div>
    </div>
  );
};

export default AddAddress;
