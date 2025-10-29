import { useEffect, useState } from 'react';
import { Clock, XCircle, DollarSign, Key, AlertCircle, Users, Dog } from 'lucide-react';
import { supabase, type PropertySettings } from '../lib/supabase';

interface PoliciesProps {
  onNavigate: (path: string) => void;
}

export const Policies = ({ onNavigate }: PoliciesProps) => {
  const [settings, setSettings] = useState<PropertySettings | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      const { data } = await supabase.from('property_settings').select('*').single();
      if (data) setSettings(data);
    };
    fetchSettings();
  }, []);

  if (!settings) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-700"></div>
      </div>
    );
  }

  const policies = [
    {
      icon: Key,
      title: 'Check-in & Check-out',
      content: [
        `Check-in: ${settings.check_in_time} or later`,
        `Check-out: ${settings.check_out_time}`,
        'Self check-in with keyless smart lock',
        'Early check-in or late check-out available as add-ons (subject to availability)',
        'Photo ID required at check-in',
      ],
    },
    {
      icon: XCircle,
      title: 'Cancellation Policy',
      content: settings.cancellation_policy?.split('. ').filter(s => s.trim()) || [],
    },
    {
      icon: DollarSign,
      title: 'Payment & Deposits',
      content: [
        'Full payment required at time of booking',
        `Refundable damage deposit: $${settings.damage_deposit.toFixed(2)}`,
        'Deposit held for 7 days after check-out',
        'Deposit refunded if no damages or violations',
        'Additional charges may apply for excessive cleaning or damages',
      ],
    },
    {
      icon: Users,
      title: 'Occupancy & Guests',
      content: [
        `Maximum occupancy: ${settings.sleeps} guests`,
        'All guests must be registered prior to arrival',
        'No unauthorized parties or events',
        'Visitors must depart by 10 PM',
        'Quiet hours: 10 PM - 8 AM',
      ],
    },
    {
      icon: AlertCircle,
      title: 'House Rules',
      content: settings.house_rules?.split('. ').filter(s => s.trim()) || [],
    },
    {
      icon: Dog,
      title: 'Pet Policy',
      content: settings.pets_allowed
        ? [
            'Pets allowed with prior approval',
            'Pet fee: $100 per stay',
            'Maximum 2 pets',
            'Pets must be house-trained',
            'Clean up after your pet',
            'Pets not allowed on furniture',
          ]
        : ['Pets are not permitted at this property'],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="font-serif text-5xl font-bold text-gray-900 mb-4">House Policies</h1>
          <p className="text-lg text-gray-600">
            Clear rules. No surprises. Just what you need to know before you book.
          </p>
        </div>

        <div className="space-y-6">
          {policies.map((policy, idx) => (
            <div key={idx} className="bg-white rounded-xl p-8 border border-gray-200">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <policy.icon className="w-6 h-6 text-emerald-700" />
                </div>
                <h2 className="font-serif text-2xl font-bold text-gray-900 pt-2">{policy.title}</h2>
              </div>
              <ul className="ml-16 space-y-2">
                {policy.content.map((item, itemIdx) => (
                  <li key={itemIdx} className="flex items-start gap-2 text-gray-700">
                    <span className="text-emerald-700 font-bold mt-1">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-emerald-50 rounded-xl p-8 border border-emerald-200">
          <div className="flex items-start gap-4">
            <Clock className="w-8 h-8 text-emerald-700 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-lg text-gray-900 mb-2">Questions About Our Policies?</h3>
              <p className="text-gray-700 mb-4">
                We're here to help! If you have any questions about our policies or need special
                accommodations, please don't hesitate to reach out.
              </p>
              <button
                onClick={() => onNavigate('/about')}
                className="px-6 py-2 bg-emerald-700 text-white font-semibold rounded-lg hover:bg-emerald-600 transition-all"
              >
                Contact Us
              </button>
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
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
