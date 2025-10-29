import { useEffect, useState } from 'react';
import {
  ChevronRight,
  Anchor,
  Home as HomeIcon,
  Users,
  Star,
  CheckCircle,
  Shield,
  Calendar,
} from 'lucide-react';
import { supabase, type Review, type PropertySettings } from '../lib/supabase';

interface HomeProps {
  onNavigate: (path: string) => void;
}

export const Home = ({ onNavigate }: HomeProps) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [settings, setSettings] = useState<PropertySettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const [reviewsRes, settingsRes] = await Promise.all([
        supabase
          .from('reviews')
          .select('*')
          .eq('approved', true)
          .order('created_at', { ascending: false })
          .limit(3),
        supabase.from('property_settings').select('*').single(),
      ]);

      if (reviewsRes.data) setReviews(reviewsRes.data);
      if (settingsRes.data) setSettings(settingsRes.data);
      setLoading(false);
    };

    fetchData();
  }, []);

  const averageRating =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : '5.0';

  const heroImages = [
    'https://images.pexels.com/photos/1732414/pexels-photo-1732414.jpeg?auto=compress&cs=tinysrgb&w=1920',
    'https://images.pexels.com/photos/2119713/pexels-photo-2119713.jpeg?auto=compress&cs=tinysrgb&w=1920',
    'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1920',
  ];

  const features = [
    {
      icon: Anchor,
      title: 'Your Private Waterfront',
      description: 'Wake up to mist on the lake. Launch kayaks from your dock. Watch herons fish while you sip coffee. This is the Lake Anna you came for.',
    },
    {
      icon: HomeIcon,
      title: 'Thoughtfully Outfitted',
      description: "From the chef-grade kitchen to the smart locks, every detail is handled. We stocked it like we're staying ourselves.",
    },
    {
      icon: Users,
      title: 'Room to Breathe',
      description: `${settings?.sleeps || 8} guests across ${settings?.bedrooms || 3} bedrooms. Enough space for everyone to have their morning alone—and gather for sunset.`,
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-700"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImages[0]})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60"></div>
        </div>

        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Your lakefront reset at Lake Anna.
          </h1>
          <p className="text-xl sm:text-2xl mb-8 text-gray-100 leading-relaxed">
            Escape to your private dock where mornings start with steam rising off the water and evenings end with fiery sunsets you'll actually watch until the last glow fades.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => onNavigate('/stay')}
              className="px-8 py-4 bg-emerald-700 text-white font-semibold rounded-lg hover:bg-emerald-600 transition-all transform hover:scale-105 flex items-center justify-center gap-2"
            >
              Check Availability
              <ChevronRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => onNavigate('/gallery')}
              className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-lg hover:bg-white/20 transition-all border border-white/30"
            >
              View Gallery
            </button>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-2 bg-white/50 rounded-full"></div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl font-bold text-gray-900 mb-4">Why Serenity</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              This isn't another cookie-cutter rental. It's the lakefront escape we built for ourselves—and now we're sharing it with you.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-xl p-8 hover:shadow-lg transition-shadow"
              >
                <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
                  <feature.icon className="w-7 h-7 text-emerald-700" />
                </div>
                <h3 className="font-serif text-2xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-serif text-4xl font-bold text-gray-900 mb-4">A Glimpse Inside</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {heroImages.concat(heroImages[0]).map((img, idx) => (
              <div
                key={idx}
                className="aspect-square rounded-lg overflow-hidden cursor-pointer group"
                onClick={() => onNavigate('/gallery')}
              >
                <img
                  src={img}
                  alt={`Serenity Lake House interior ${idx + 1}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
            ))}
          </div>

          <div className="text-center">
            <button
              onClick={() => onNavigate('/gallery')}
              className="inline-flex items-center gap-2 px-6 py-3 border-2 border-emerald-700 text-emerald-700 font-semibold rounded-lg hover:bg-emerald-700 hover:text-white transition-all"
            >
              View Full Gallery
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-emerald-700 mb-2">
                {settings?.sleeps || 8}
              </div>
              <div className="text-gray-600">Sleeps</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-emerald-700 mb-2">
                {settings?.bedrooms || 3}
              </div>
              <div className="text-gray-600">Bedrooms</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-emerald-700 mb-2">
                {settings?.bathrooms || 2}
              </div>
              <div className="text-gray-600">Bathrooms</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-emerald-700 mb-2">
                {settings?.parking_spaces || 3}
              </div>
              <div className="text-gray-600">Parking</div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
              <span className="text-3xl font-bold">{averageRating}</span>
              <span className="text-gray-400">({reviews.length} reviews)</span>
            </div>
            <h2 className="font-serif text-4xl font-bold mb-4">Guest Experiences</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews.map((review) => (
              <div key={review.id} className="bg-gray-800 rounded-xl p-6">
                <div className="flex items-center gap-1 mb-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < review.rating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-600'
                      }`}
                    />
                  ))}
                </div>
                <h3 className="font-semibold text-lg mb-2">{review.title}</h3>
                <p className="text-gray-300 mb-4 leading-relaxed">{review.comment}</p>
                <div className="text-sm text-gray-400">
                  <div>{review.guest_name}</div>
                  <div>{new Date(review.stay_date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button
              onClick={() => onNavigate('/reviews')}
              className="inline-flex items-center gap-2 px-6 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-gray-900 transition-all"
            >
              Read All Reviews
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      <section className="py-16 bg-emerald-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 text-center md:text-left">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-emerald-700" />
              <span className="font-semibold text-gray-900">Secure checkout</span>
            </div>
            <div className="hidden md:block w-px h-8 bg-emerald-300"></div>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-emerald-700" />
              <span className="font-semibold text-gray-900">No platform fees</span>
            </div>
            <div className="hidden md:block w-px h-8 bg-emerald-300"></div>
            <div className="flex items-center gap-3">
              <Calendar className="w-8 h-8 text-emerald-700" />
              <span className="font-semibold text-gray-900">Instant confirmation</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
