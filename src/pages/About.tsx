import { useState } from 'react';
import { Mail, Phone, Send, Heart, Home } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface AboutProps {
  onNavigate: (path: string) => void;
}

export const About = ({ onNavigate }: AboutProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const { error } = await supabase.from('contact_submissions').insert({
        name: formData.name,
        email: formData.email,
        phone: formData.phone || null,
        message: formData.message,
      });

      if (error) throw error;

      setSubmitStatus('success');
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="font-serif text-5xl font-bold text-gray-900 mb-4">About & Contact</h1>
          <p className="text-lg text-gray-600">
            Get to know us and reach out with any questions
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          <div className="bg-white rounded-xl p-8 border border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <Heart className="w-8 h-8 text-emerald-700" />
              <h2 className="font-serif text-2xl font-bold text-gray-900">Our Story</h2>
            </div>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                We bought this place in 2018 because we were tired of the noise. Tired of notifications,
                traffic, and that feeling of never quite catching your breath. Lake Anna offered something
                rare: actual silence. Water that reflects the sky instead of screens. Time that moves slower.
              </p>
              <p>
                After a few years of weekend escapes and summer memories with our kids, we realized we
                couldn't keep this to ourselves. The way the morning mist lifts off the water. How the
                wood ducks return every spring. The specific golden hour when the whole lake catches fire
                with sunset—these moments deserved to be shared.
              </p>
              <p>
                So we renovated with intention. We're local to Central Virginia, and we manage every
                detail personally because we care about this place. The coffee is good. The knives are
                sharp. The kayaks don't leak. We stocked it the way we wish every rental was stocked—
                because we remember what it's like to arrive somewhere and find it half-ready.
              </p>
            </div>

            <div className="mt-8 pt-8 border-t border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <Home className="w-6 h-6 text-emerald-700" />
                <h3 className="font-semibold text-lg text-gray-900">Why Direct Booking?</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">
                We left the booking platforms because they took a cut, added fees, and put a wall between
                us and our guests. Booking direct means better rates for you, no middleman, and a real
                conversation when you need it. You get our cell number. We answer.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-8 border border-gray-200">
            <h2 className="font-serif text-2xl font-bold text-gray-900 mb-6">Get in Touch</h2>

            <div className="space-y-4 mb-8">
              <a
                href="mailto:hello@serenitylakehouse.com"
                className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Mail className="w-6 h-6 text-emerald-700" />
                <div>
                  <div className="font-semibold text-gray-900">Email</div>
                  <div className="text-gray-600">hello@serenitylakehouse.com</div>
                </div>
              </a>

              <a
                href="tel:+15551234567"
                className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Phone className="w-6 h-6 text-emerald-700" />
                <div>
                  <div className="font-semibold text-gray-900">Phone</div>
                  <div className="text-gray-600">(555) 123-4567</div>
                </div>
              </a>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-900 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-semibold text-gray-900 mb-2">
                  Phone <span className="text-gray-500 font-normal">(optional)</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="(555) 123-4567"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-semibold text-gray-900 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                  placeholder="How can we help you?"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-emerald-700 text-white font-semibold rounded-lg hover:bg-emerald-600 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  'Sending...'
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Send Message
                  </>
                )}
              </button>

              {submitStatus === 'success' && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800">
                  Thank you! We'll get back to you within 24 hours.
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
                  Something went wrong. Please try emailing us directly.
                </div>
              )}
            </form>
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={() => onNavigate('/stay')}
            className="px-8 py-4 bg-emerald-700 text-white font-semibold rounded-lg hover:bg-emerald-600 transition-all"
          >
            Check Availability
          </button>
        </div>
      </div>
    </div>
  );
};
