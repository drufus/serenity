import { Mail, Phone, MapPin, Waves } from 'lucide-react';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer = ({ onNavigate }: FooterProps) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Waves className="w-6 h-6 text-emerald-500" />
              <h3 className="text-white font-serif text-lg font-semibold">Serenity Lake House</h3>
            </div>
            <p className="text-sm leading-relaxed mb-4">
              Where the lake meets quiet mornings and slow sunsets. Lake Anna's best-kept secret—
              until now.
            </p>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4 text-emerald-500" />
              <span>Lake Anna, Virginia</span>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <nav className="space-y-2">
              {[
                { path: '/stay', label: 'Rates & Availability' },
                { path: '/gallery', label: 'Gallery' },
                { path: '/amenities', label: 'Amenities' },
                { path: '/area', label: 'Area Guide' },
                { path: '/reviews', label: 'Reviews' },
                { path: '/policies', label: 'Policies' },
              ].map((link) => (
                <button
                  key={link.path}
                  onClick={() => onNavigate(link.path)}
                  className="block text-sm hover:text-white transition-colors"
                >
                  {link.label}
                </button>
              ))}
            </nav>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Get in Touch</h4>
            <div className="space-y-3">
              <a
                href="mailto:hello@serenitylakehouse.com"
                className="flex items-center gap-2 text-sm hover:text-white transition-colors"
              >
                <Mail className="w-4 h-4 text-emerald-500" />
                <span>hello@serenitylakehouse.com</span>
              </a>
              <a
                href="tel:+15551234567"
                className="flex items-center gap-2 text-sm hover:text-white transition-colors"
              >
                <Phone className="w-4 h-4 text-emerald-500" />
                <span>(555) 123-4567</span>
              </a>
              <button
                onClick={() => onNavigate('/about')}
                className="inline-block mt-2 px-4 py-2 bg-emerald-700 text-white text-sm font-medium rounded-md hover:bg-emerald-600 transition-colors"
              >
                Contact Us
              </button>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-800">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm">
            <p>&copy; {currentYear} Serenity Lake House. All rights reserved.</p>
            <div className="flex items-center gap-1">
              <span className="text-gray-500">Secure checkout</span>
              <span className="text-gray-600">•</span>
              <span className="text-gray-500">No platform fees</span>
              <span className="text-gray-600">•</span>
              <span className="text-gray-500">Instant confirmation</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
