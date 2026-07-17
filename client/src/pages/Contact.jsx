/**
 * Contact — customer contact form page.
 * No support endpoint exists; form is disabled and does not claim success.
 * Route: /contact
 */
import { Mail, MapPin, Phone } from "lucide-react";
import { Input, Textarea, Card, SectionHeader, Button } from "../components/ui";

const Contact = () => {
  return (
    <div className="py-10 md:py-14 mb-nav animate-fade-in max-w-5xl mx-auto">
      <SectionHeader
        eyebrow="Support"
        title="Contact us"
        subtitle="Questions about orders, delivery, or partnerships? Reach us via the details below."
      />
      <div className="grid md:grid-cols-5 gap-6">
        <div className="md:col-span-2 space-y-3">
          {[
            { icon: Mail, label: "Email", value: "hello@ynagrocery.com" },
            { icon: Phone, label: "Phone", value: "+966 11 000 0000" },
            { icon: MapPin, label: "Location", value: "Riyadh, Saudi Arabia" },
          ].map(({ icon: Icon, label, value }) => (
            <Card key={label} className="p-4! flex items-start gap-3">
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
        <Card className="md:col-span-3 p-6!">
          <form
            onSubmit={(e) => e.preventDefault()}
            className="space-y-4"
            aria-disabled="true"
          >
            <p className="text-sm text-text-secondary">
              Online message submission is not available yet. Please email{" "}
              <a href="mailto:hello@ynagrocery.com" className="text-primary font-semibold">
                hello@ynagrocery.com
              </a>{" "}
              instead.
            </p>
            <Input label="Name" name="name" disabled />
            <Input label="Email" type="email" name="email" disabled />
            <Textarea label="Message" name="message" disabled />
            <Button type="submit" disabled className="w-full sm:w-auto">
              Send message
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Contact;
