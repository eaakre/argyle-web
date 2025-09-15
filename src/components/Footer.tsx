import Link from "next/link";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Clock,
  ExternalLink,
} from "lucide-react";
import { Typography } from "./ui/Typography";

export function Footer() {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { label: "City Office", href: "/city-services/city-office" },
    { label: "City Council", href: "/city-services/city-council" },
    { label: "History of Argyle", href: "/city-services/history" },
    { label: "Contact Us", href: "/contact" },
/*
    { label: "Photo Galleries", href: "/photos" },
*/
  ];

  const services = [
/*
    {
      label: "Cable TV / Telephone Service",
      href: "/city-services/cable-telephone",
    },
    { label: "Internet Service", href: "/city-services/internet" },
*/
    { label: "Business Resources", href: "/business" },
/*
    { label: "Schools", href: "/schools" },
*/
  ];

  const organizations = [
    {
      label: "Community Foundation",
      href: "/organizations/community-foundation",
    },
    { label: "Fire Department", href: "/organizations/argyle-fire-department" },
/*
    { label: "Historical Society", href: "/organizations/historical-society" },
    { label: "H.O.P.E. Program", href: "/organizations/hope-program" },
    { label: "Argyle Lions", href: "/organizations/lions" },
*/
  ];

  const emergencyContacts = [
/*
    { label: "Fire Emergency", phone: "911" },
    { label: "Non-Emergency", phone: "(218) 437-6621" },
*/
    { label: "City Hall", phone: "(218) 437-6621" },
  ];

  return (
    <footer className="relative overflow-hidden">
      <div className="bg-secondary w-full h-2"></div>
      <div className="bg-primary w-full h-4"></div>

      {/* Argyle Pattern Background */}
      <div
        className="absolute inset-0 opacity-2"
        style={{
          backgroundImage: `
            conic-gradient(from 90deg at 50% 50%, transparent 45deg, #FFFFFF 45deg, #FFFFFF 135deg, #DAA520 135deg, #DAA520 225deg, #6B1F2D 225deg, #6B1F2D 315deg, transparent 315deg),
            linear-gradient(45deg, transparent 48%, rgba(139, 69, 19, 0.3) 49%, rgba(139, 69, 19, 0.3) 51%, transparent 52%),
            linear-gradient(-45deg, transparent 48%, rgba(139, 69, 19, 0.3) 49%, rgba(139, 69, 19, 0.3) 51%, transparent 52%)
          `,
          backgroundSize: "80px 80px, 80px 80px, 80px 80px",
          backgroundPosition: "0 0, 0 0, 0 0",
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-12 md:px-20">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* City Information */}
          <div className="space-y-4">
            <Typography variant="footer-header" noMargin>
              City of Argyle
            </Typography>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <div className="space-y-0">
                  <Typography variant="footer-text" noMargin>
                    428 3rd Avenue NW
                  </Typography>
                  <Typography variant="footer-text" noMargin>
                    Argyle, MN 56713
                  </Typography>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 flex-shrink-0" />
                <a
                  href="tel:218-437-6621"
                  className="hover:text-primary-hover transition-colors"
                >
                  <Typography variant="footer-text" noMargin>
                    (218) 437-6621
                  </Typography>
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 flex-shrink-0" />
                <a
                  href="mailto:argyle@wiktel.com"
                  className="hover:text-primary-hover transition-colors"
                >
                  <Typography variant="footer-text" noMargin>
                    argyle@wiktel.com
                  </Typography>
                </a>
              </div>
              <div className="flex items-start space-x-3">
                <Clock className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <div className="space-y-0">
                  <Typography variant="footer-text" noMargin>
                    City Hall Hours:
                  </Typography>
                  <Typography variant="footer-text" noMargin>
                    Monday - Friday
                  </Typography>
                  <Typography variant="footer-text" noMargin>
                    9:00 AM - 4:00 PM
                  </Typography>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <Typography variant="footer-header" noMargin>
              Quick Links
            </Typography>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="hover:text-primary-hover transition-colors"
                  >
                    <Typography variant="footer-text" noMargin>
                      {link.label}
                    </Typography>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services & Resources */}
          <div className="space-y-4">
            <Typography variant="footer-header" noMargin>
              Services
            </Typography>
            <ul className="space-y-2">
              {services.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="hover:text-primary-hover transition-colors"
                  >
                    <Typography variant="footer-text" noMargin>
                      {link.label}
                    </Typography>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Organizations & Emergency */}
          <div className="space-y-4">
            <Typography variant="footer-header" noMargin>
              Organizations
            </Typography>
            <ul className="space-y-2">
              {organizations.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="hover:text-primary-hover transition-colors"
                  >
                    <Typography variant="footer-text" noMargin>
                      {link.label}
                    </Typography>
                  </Link>
                </li>
              ))}
            </ul>

            {/* Emergency Contacts */}
            <div className="pt-4 border-t border-primary-foreground/20">
              <Typography
                variant="footer-text"
                className="font-medium mb-3"
                noMargin
              >
                Emergency Contacts
              </Typography>
              <div className="space-y-2">
                {emergencyContacts.map((contact) => (
                  <div
                    key={contact.label}
                    className="flex justify-between items-center"
                  >
                    <Typography variant="footer-text" noMargin>
                      {contact.label}:
                    </Typography>
                    <a
                      href={`tel:${contact.phone}`}
                      className="font-medium hover:text-primary-hover transition-colors"
                    >
                      <Typography variant="footer-text" noMargin>
                        {contact.phone}
                      </Typography>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary-foreground/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright */}
            <Typography variant="footer-text" noMargin>
              © {currentYear} City of Argyle, Minnesota. All rights reserved.
            </Typography>

            {/* Links */}
            <div className="flex flex-wrap gap-6">
              <Link
                href="/accessibility"
                className="hover:text-primary-hover transition-colors"
              >
                <Typography variant="footer-text" noMargin>
                  Accessibility
                </Typography>
              </Link>
              <Link
                href="/privacy-policy"
                className="hover:text-primary-hover transition-colors"
              >
                <Typography variant="footer-text" noMargin>
                  Privacy Policy
                </Typography>
              </Link>
              <Link
                href="/terms-of-use"
                className="hover:text-primary-hover transition-colors"
              >
                <Typography variant="footer-text" noMargin>
                  Terms of Use
                </Typography>
              </Link>
              <a
                href="https://www.mn.gov"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary-hover transition-colors flex items-center gap-1"
              >
                <Typography variant="footer-text" noMargin>
                  State of Minnesota
                </Typography>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Social Media & Additional Info */}
          <div className="flex flex-col md:flex-row justify-between items-center mt-6 pt-6 border-t border-footer-text/20">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <a
                href="https://www.facebook.com/p/City-of-Argyle-100064809185972/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-footer-text-secondary/10 hover:bg-footer-text-secondary/20 transition-colors"
                aria-label="Follow us on Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <Typography variant="footer-text" className="opacity-80" noMargin>
                Follow us for city updates and news
              </Typography>
            </div>

            <div className="text-center md:text-right">
              <Typography variant="footer-text" className="opacity-80" noMargin>
                Established: 1879
              </Typography>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
