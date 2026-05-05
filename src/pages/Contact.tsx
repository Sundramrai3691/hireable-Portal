import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Mail, MessageSquare, Phone, MapPin, Send, Clock } from "lucide-react";

const Contact = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      console.log("Contact form submission:", formData);

      toast({
        title: "Message sent",
        description: "Thank you for contacting us. We'll get back to you within 24 hours.",
      });

      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });

      setIsSubmitting(false);
    }, 1500);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen pt-16">
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h1 className="gradient-text mb-4 text-4xl font-bold">Get in Touch</h1>
            <p className="text-lg text-muted-foreground">
              Have questions? We would love to hear from you. Send us a message and we will respond as soon as possible.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-1">
              <Card className="glass-card border-none">
                <CardContent className="p-6">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="gradient-primary flex h-10 w-10 items-center justify-center rounded-lg">
                      <Mail className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Email Us</h3>
                      <p className="text-sm text-muted-foreground">Send us an email anytime</p>
                    </div>
                  </div>
                  <p className="font-medium text-primary">hello@placemate.app</p>
                </CardContent>
              </Card>

              <Card className="glass-card border-none">
                <CardContent className="p-6">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="gradient-secondary flex h-10 w-10 items-center justify-center rounded-lg">
                      <Phone className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Call Us</h3>
                      <p className="text-sm text-muted-foreground">Mon-Fri from 9am to 6pm</p>
                    </div>
                  </div>
                  <p className="font-medium text-primary">+91 99999 99999</p>
                </CardContent>
              </Card>

              <Card className="glass-card border-none">
                <CardContent className="p-6">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="gradient-primary flex h-10 w-10 items-center justify-center rounded-lg">
                      <MapPin className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Visit Us</h3>
                      <p className="text-sm text-muted-foreground">Come say hello</p>
                    </div>
                  </div>
                  <p className="font-medium text-primary">
                    Bengaluru, India
                    <br />
                    Remote-first support
                  </p>
                </CardContent>
              </Card>

              <Card className="glass-card border-none">
                <CardContent className="p-6">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="gradient-secondary flex h-10 w-10 items-center justify-center rounded-lg">
                      <Clock className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Support Hours</h3>
                      <p className="text-sm text-muted-foreground">Our support team is available</p>
                    </div>
                  </div>
                  <div className="text-sm">
                    <p><strong>Monday - Friday:</strong> 10:00 AM - 7:00 PM IST</p>
                    <p><strong>Saturday:</strong> 11:00 AM - 3:00 PM IST</p>
                    <p><strong>Sunday:</strong> Closed</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-2">
              <Card className="glass-card border-none">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Send us a Message
                  </CardTitle>
                  <CardDescription>
                    Fill out the form below and we will get back to you as soon as possible.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          placeholder="Your full name"
                          value={formData.name}
                          onChange={(e) => handleInputChange("name", e.target.value)}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="your.email@example.com"
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject *</Label>
                      <Input
                        id="subject"
                        placeholder="What is this regarding?"
                        value={formData.subject}
                        onChange={(e) => handleInputChange("subject", e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message *</Label>
                      <Textarea
                        id="message"
                        placeholder="Tell us more about how we can help you..."
                        value={formData.message}
                        onChange={(e) => handleInputChange("message", e.target.value)}
                        className="min-h-32"
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      variant="hero"
                      size="lg"
                      disabled={isSubmitting}
                      className="w-full md:w-auto"
                    >
                      {isSubmitting ? (
                        "Sending..."
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="mt-16">
            <div className="mb-8 text-center">
              <h2 className="mb-4 text-2xl font-bold">Frequently Asked Questions</h2>
              <p className="text-muted-foreground">
                Quick answers to common questions about PlaceMate
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <Card className="glass-card border-none">
                <CardContent className="p-6">
                  <h3 className="mb-2 font-semibold">How quickly do you respond?</h3>
                  <p className="text-sm text-muted-foreground">
                    We typically respond to all inquiries within 24 hours during business days.
                  </p>
                </CardContent>
              </Card>

              <Card className="glass-card border-none">
                <CardContent className="p-6">
                  <h3 className="mb-2 font-semibold">Do you offer student support?</h3>
                  <p className="text-sm text-muted-foreground">
                    Yes. Reach out for product help, prep guidance, or feature suggestions related to placement season.
                  </p>
                </CardContent>
              </Card>

              <Card className="glass-card border-none">
                <CardContent className="p-6">
                  <h3 className="mb-2 font-semibold">Can I suggest a company to track?</h3>
                  <p className="text-sm text-muted-foreground">
                    Absolutely. Send us the company name and drive details and we can add it to the placement intelligence layer.
                  </p>
                </CardContent>
              </Card>

              <Card className="glass-card border-none">
                <CardContent className="p-6">
                  <h3 className="mb-2 font-semibold">Is there a help center?</h3>
                  <p className="text-sm text-muted-foreground">
                    We are building one. For now, the fastest path is to message us directly from this page.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
