import { Menu, X, Waves } from 'lucide-react';
import { useState } from 'react';

interface HeaderProps {
  onNavigate: (path: string) => void;
  currentRoute: string;
}

export const Header = ({ onNavigate, currentRoute }: HeaderProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/stay', label: 'Rates & Availability' },
    { path: '/gallery', label: 'Gallery' },
    { path: '/amenities', label: 'Amenities' },
    { path: '/area', label: 'Area Guide' },
    { path: '/reviews', label: 'Reviews' },
    { path: '/policies', label: 'Policies' },
    { path: '/about', label: 'About & Contact' },
  ];

  const isActive = (path: string) => currentRoute === path;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <button
            onClick={() => onNavigate('/')}
            className="flex items-center gap-2 text-xl font-serif font-semibold text-gray-900 hover:text-emerald-700 transition-colors"
          >
            <Waves className="w-6 h-6 text-emerald-700" />
            <span>Serenity Lake House</span>
          </button>

          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => onNavigate(link.path)}
                className={`text-sm font-medium transition-colors ${
                  isActive(link.path)
                    ? 'text-emerald-700'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {link.label}
              </button>
            ))}
            <button
              onClick={() => onNavigate('/book')}
              className="px-5 py-2 bg-emerald-700 text-white text-sm font-medium rounded-md hover:bg-emerald-800 transition-colors"
            >
              Book Now
            </button>
          </nav>

          <button
            className="lg:hidden p-2 text-gray-600 hover:text-gray-900"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-200 bg-white">
          <nav className="px-4 py-4 space-y-2">
            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => {
                  onNavigate(link.path);
                  setMobileMenuOpen(false);
                }}
                className={`block w-full text-left px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(link.path)
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {link.label}
              </button>
            ))}
            <button
              onClick={() => {
                onNavigate('/book');
                setMobileMenuOpen(false);
              }}
              className="block w-full px-4 py-2 bg-emerald-700 text-white text-sm font-medium rounded-md hover:bg-emerald-800 transition-colors"
            >
              Book Now
            </button>
          </nav>
        </div>
      )}
    </header>
  );
};
