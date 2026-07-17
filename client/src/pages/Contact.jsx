/**
 * Contact — customer contact form page (UI + toast; no backend change).
 * Route: /contact
 */
import { useState } from "react";
import { Mail, MapPin, Phone } from "lucide-react";
import { Button, Input, Textarea, Card, SectionHeader } from "../components/ui";
import toast from "react-hot-toast";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);

  const onSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      toast.success("Message sent — we’ll get back to you soon.");
      setForm({ name: "", email: "", message: "" });
      setLoading(false);
    }, 600);
  };

  return (
    <div className="py-10 md:py-14 mb-nav animate-fade-in max-w-5xl mx-auto">
      <SectionHeader
        eyebrow="Support"
        title="Contact us"
        subtitle="Questions about orders, delivery, or partnerships? We’re here to help."
      />
      <div className="grid md:grid-cols-5 gap-6">
        <div className="md:col-span-2 space-y-3">
          {[
            { icon: Mail, label: "Email", value: "hello@ynagrocery.com" },
            { icon: Phone, label: "Phone", value: "+966 11 000 0000" },
            { icon: MapPin, label: "Location", value: "Riyadh, Saudi Arabia" },
          ].map(({ icon: Icon, label, value }) => (
            <Card key={label} className="!p-4 flex items-start gap-3">
              <div className="w-10 h-10 rounded-[14px] bg-bg-light-mint text-primary flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs text-text-tertiary">{label}</p>
                <p className="text-sm font-medium text-text-primary mt-0.5">{value}</p>
              </div>
            </Card>
          ))}
        </div>
        <Card className="md:col-span-3 !p-6">
          <form onSubmit={onSubmit} className="space-y-4">
            <Input label="Name" name="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            <Input label="Email" type="email" name="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            <Textarea label="Message" name="message" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required />
            <Button type="submit" loading={loading} className="w-full sm:w-auto">Send message</Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Contact;
