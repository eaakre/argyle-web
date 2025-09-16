"use client";

import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/Button";
import { Typography } from "@/components/ui/Typography";
import { Phone, Mail, MapPin, Building2 } from "lucide-react";
import { ChangeEvent, useState } from "react";
import { Dropdown } from "@/components/ui/Dropdown";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<null | "success" | "error">(
    null
  );

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Prepare submission data - include listing info if available
      const submissionData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        subject: formData.subject,
        message: formData.message,
      };

      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submissionData),
      });

      const data = await res.json();

      if (data.success) {
        setSubmitStatus("success");
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        });
      } else {
        setSubmitStatus("error");
        console.error(data.error);
      }
    } catch (err) {
      setSubmitStatus("error");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex p-6 md:p-10 justify-center min-h-screen bg-muted px-4">
      <div className="w-full max-w-6xl">
        <div className="text-center mb-8">
          <Typography variant="h1" center>
            Contact Us
          </Typography>
          <Typography variant="lead" color="muted" center noMargin>
            Get in touch with the City of Argyle
          </Typography>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Contact Information */}
          <div className="bg-bg-secondary rounded-md shadow-md p-6 md:p-8">
            <Typography variant="h2">Contact Information</Typography>

            <div className="space-y-6">
              {/* City Hall */}
              <div className="flex items-start space-x-3">
                <Building2 className="w-5 h-5 mt-1 text-primary flex-shrink-0" />
                <div>
                  <Typography variant="h5" noMargin>
                    City Hall
                  </Typography>
                  <div className="text-muted-foreground mt-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <MapPin className="w-4 h-4" />
                      <Typography variant="small" color="muted" noMargin>
                        Box 288, 701 Pacific Avenue
                      </Typography>
                    </div>
                    <div className="ml-6">
                      <Typography variant="small" color="muted" noMargin>
                        Argyle, MN 56713
                      </Typography>
                    </div>
                    <div className="flex items-center space-x-2 mt-2">
                      <Phone className="w-4 h-4" />
                      <Typography variant="small" color="muted" noMargin>
                        218-437-6621 (Phone/Fax)
                      </Typography>
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                      <Mail className="w-4 h-4" />
                      <a
                        href="mailto:argyle@wiktel.com"
                        className="text-primary hover:underline"
                      >
                        <Typography variant="small" color="muted" noMargin>
                          argyle@wiktel.com
                        </Typography>
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* City Shop */}
              <div className="flex items-start space-x-3">
                <Building2 className="w-5 h-5 mt-1 text-primary flex-shrink-0" />
                <div>
                  <Typography variant="h5" noMargin>
                    City Shop
                  </Typography>
                  <div className="text-muted-foreground mt-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <MapPin className="w-4 h-4" />
                      <Typography variant="small" color="muted" noMargin>
                        106 East 2nd Street
                      </Typography>
                    </div>
                    <div className="flex items-center space-x-2 mt-2">
                      <Phone className="w-4 h-4" />
                      <Typography variant="small" color="muted" noMargin>
                        218-437-6689
                      </Typography>
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                      <Mail className="w-4 h-4" />
                      <a
                        href="mailto:argyleshop@wiktel.com"
                        className="text-primary hover:underline"
                      >
                        <Typography variant="small" color="muted" noMargin>
                          argyleshop@wiktel.com
                        </Typography>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 p-4 bg-muted rounded-lg">
              <Typography variant="h6" noMargin className="mb-2">
                Office Hours
              </Typography>
              <Typography variant="small" color="muted" noMargin>
                Please call ahead to confirm availability or to schedule an
                appointment.
              </Typography>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-bg-secondary rounded-md shadow-md p-6 md:p-8">
            <Typography variant="h2">Send us a Message</Typography>
            <Typography variant="p" color="muted">
              Fill up the form below to send us a message.
            </Typography>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block font-medium mb-1">
                    First Name
                    <span className="text-destructive ml-1">*</span>
                  </label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="John"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block font-medium mb-1">
                    Last Name
                    <span className="text-md ml-1">*</span>
                  </label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Doe"
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="email" className="block font-medium mb-1">
                    Email Address
                    <span className="text-destructive ml-1">*</span>
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="you@email.com"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block font-medium mb-1">
                    Phone Number
                  </label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="(218) 123-4567"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block font-medium mb-1">
                  Subject
                  <span className="text-destructive ml-1">*</span>
                </label>
                <Dropdown
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select a topic</option>
                  <option value="general">General Inquiry</option>
                  <option value="utilities">Utilities</option>
                  <option value="permits">Permits & Licenses</option>
                  <option value="public-works">Public Works</option>
                  <option value="city-services">City Services</option>
                  <option value="other">Other</option>
                </Dropdown>
              </div>

              <div>
                <label htmlFor="message" className="block font-medium mb-1">
                  Your Message
                  <span className="text-destructive ml-1">*</span>
                </label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={5}
                  placeholder="Please describe your inquiry or concern..."
                  required
                />
              </div>

              <Button type="submit" variant="default" className="w-full">
                {isSubmitting ? "Sending Message..." : "Send Message"}
              </Button>

              {/* Status Messages */}
              {submitStatus === "success" && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center">
                    <svg
                      className="w-5 h-5 text-green-400 mr-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <p className="text-green-800 font-medium">
                      Message sent successfully!
                    </p>
                  </div>
                  <p className="text-green-700 mt-2 ml-8">
                    Erik will get back to you within 24-48 hours.
                  </p>
                </div>
              )}

              {submitStatus === "error" && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center">
                    <svg
                      className="w-5 h-5 text-red-400 mr-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <p className="text-red-800 font-medium">
                      Something went wrong
                    </p>
                  </div>
                  <p className="text-red-700 mt-2 ml-8">
                    Please try again or call Erik at (701) 318-7633
                  </p>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
