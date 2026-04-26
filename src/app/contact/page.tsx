import { Typography } from "@/components/ui/Typography";
import { Phone, Mail, MapPin, Building2 } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="flex p-6 md:p-10 justify-center min-h-screen bg-bg-secondary px-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <Typography variant="h1" center>
            Contact Us
          </Typography>
          <Typography variant="lead" color="muted" center noMargin>
            Get in touch with the City of Argyle
          </Typography>
        </div>

        <div className="bg-bg-primary rounded-sm shadow-sm p-6 md:p-8">
          <Typography variant="h2">Contact Information</Typography>

          <div className="space-y-6">
            {/* City Hall */}
            <div className="flex items-start space-x-3">
              <Building2 className="w-5 h-5 mt-1 text-primary flex-shrink-0" />
              <div>
                <Typography variant="h5" noMargin>
                  City Hall
                </Typography>
                <div className="mt-1 space-y-1">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 flex-shrink-0" />
                    <Typography variant="small" color="muted" noMargin>
                      Box 288, 701 Pacific Avenue, Argyle, MN 56713
                    </Typography>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 flex-shrink-0" />
                    <a href="tel:218-437-6621" className="hover:text-text-hover transition-colors">
                      <Typography variant="small" color="muted" noMargin>
                        218-437-6621 (Phone/Fax)
                      </Typography>
                    </a>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 flex-shrink-0" />
                    <a href="mailto:argyle@wiktel.com" className="hover:text-text-hover transition-colors">
                      <Typography variant="small" color="muted" noMargin>
                        argyle@wiktel.com
                      </Typography>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-bg-secondary" />

            {/* City Shop */}
            <div className="flex items-start space-x-3">
              <Building2 className="w-5 h-5 mt-1 text-primary flex-shrink-0" />
              <div>
                <Typography variant="h5" noMargin>
                  City Shop
                </Typography>
                <div className="mt-1 space-y-1">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 flex-shrink-0" />
                    <Typography variant="small" color="muted" noMargin>
                      106 East 2nd Street
                    </Typography>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 flex-shrink-0" />
                    <a href="tel:218-437-6689" className="hover:text-text-hover transition-colors">
                      <Typography variant="small" color="muted" noMargin>
                        218-437-6689
                      </Typography>
                    </a>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 flex-shrink-0" />
                    <a href="mailto:argyleshop@wiktel.com" className="hover:text-text-hover transition-colors">
                      <Typography variant="small" color="muted" noMargin>
                        argyleshop@wiktel.com
                      </Typography>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 p-4 bg-bg-secondary rounded-sm">
            <Typography variant="h6" noMargin className="mb-1">
              Office Hours
            </Typography>
            <Typography variant="small" color="muted" noMargin>
              Please call ahead to confirm availability or to schedule an appointment.
            </Typography>
          </div>
        </div>
      </div>
    </div>
  );
}
