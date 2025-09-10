"use client";

import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/Button";
import { Phone, Mail, MapPin, Building2 } from "lucide-react";
import { ChangeEvent, FormEvent, useState } from "react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  return (
    <div className="flex p-6 md:p-10 justify-center min-h-screen bg-muted px-4">
      <div className="w-full max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold">Contact Us</h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Get in touch with the City of Argyle
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Contact Information */}
          <div className="bg-bg-secondary rounded-md shadow-md p-6 md:p-8">
            <h2 className="text-2xl font-semibold mb-6">Contact Information</h2>

            <div className="space-y-6">
              {/* City Hall */}
              <div className="flex items-start space-x-3">
                <Building2 className="w-5 h-5 mt-1 text-primary flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-lg">City Hall</h3>
                  <div className="text-muted-foreground mt-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <MapPin className="w-4 h-4" />
                      <span>Box 288, 701 Pacific Avenue</span>
                    </div>
                    <div className="ml-6">Argyle, MN 56713</div>
                    <div className="flex items-center space-x-2 mt-2">
                      <Phone className="w-4 h-4" />
                      <span>218-437-6621 (Phone/Fax)</span>
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                      <Mail className="w-4 h-4" />
                      <a
                        href="mailto:argyle@wiktel.com"
                        className="text-primary hover:underline"
                      >
                        argyle@wiktel.com
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* City Shop */}
              <div className="flex items-start space-x-3">
                <Building2 className="w-5 h-5 mt-1 text-primary flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-lg">City Shop</h3>
                  <div className="text-muted-foreground mt-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <MapPin className="w-4 h-4" />
                      <span>106 East 2nd Street</span>
                    </div>
                    <div className="flex items-center space-x-2 mt-2">
                      <Phone className="w-4 h-4" />
                      <span>218-437-6689</span>
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                      <Mail className="w-4 h-4" />
                      <a
                        href="mailto:argyleshop@wiktel.com"
                        className="text-primary hover:underline"
                      >
                        argyleshop@wiktel.com
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 p-4 bg-muted rounded-lg">
              <h3 className="font-medium mb-2">Office Hours</h3>
              <p className="text-sm text-muted-foreground">
                Please call ahead to confirm availability or to schedule an
                appointment.
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-bg-secondary rounded-md shadow-md p-6 md:p-8">
            <h2 className="text-2xl font-semibold mb-6">Send us a Message</h2>
            <p className="text-muted-foreground mb-6">
              Fill up the form below to send us a message.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium mb-1"
                  >
                    First Name
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
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium mb-1"
                  >
                    Last Name
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
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium mb-1"
                  >
                    Email Address
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="you@company.com"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium mb-1"
                  >
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
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium mb-1"
                >
                  Subject
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  required
                >
                  <option value="">Select a topic</option>
                  <option value="general">General Inquiry</option>
                  <option value="utilities">Utilities</option>
                  <option value="permits">Permits & Licenses</option>
                  <option value="public-works">Public Works</option>
                  <option value="city-services">City Services</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium mb-1"
                >
                  Your Message
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

              <Button type="submit" className="w-full">
                Send Message
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
