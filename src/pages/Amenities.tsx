import {
  Wifi,
  Tv,
  Coffee,
  Waves,
  Car,
  Wind,
  Flame,
  Utensils,
  Bed,
  Bath,
  Home,
  Users,
  Laptop,
  Gamepad2,
  Music,
  BookOpen,
  Award,
  Heart,
} from 'lucide-react';

interface AmenitiesProps {
  onNavigate: (path: string) => void;
}

export const Amenities = ({ onNavigate }: AmenitiesProps) => {
  const amenityGroups = [
    {
      title: 'Lakefront & Outdoor',
      items: [
        { icon: Waves, name: 'Private Dock', description: 'Direct lake access with seating area' },
        { icon: Waves, name: 'Kayaks Included', description: 'Two kayaks with paddles and life vests' },
        { icon: Flame, name: 'Fire Pit', description: 'Gather around the lakeside fire pit' },
        { icon: Utensils, name: 'BBQ Grill', description: 'Gas grill for outdoor cooking' },
        { icon: Car, name: 'Parking', description: 'Space for 3 vehicles' },
        { icon: Wind, name: 'Outdoor Seating', description: 'Multiple deck areas with lake views' },
      ],
    },
    {
      title: 'Indoor Comfort',
      items: [
        { icon: Wind, name: 'Air Conditioning', description: 'Central AC throughout' },
        { icon: Flame, name: 'Fireplace', description: 'Cozy gas fireplace in living room' },
        { icon: Bed, name: 'Premium Bedding', description: 'Luxury linens and comfortable mattresses' },
        { icon: Bath, name: '2 Full Bathrooms', description: 'Modern fixtures and premium toiletries' },
        { icon: Home, name: '2,000 Sq Ft', description: 'Spacious open floor plan' },
        { icon: Users, name: 'Sleeps 8', description: '3 bedrooms plus convertible sofa' },
      ],
    },
    {
      title: 'Kitchen & Dining',
      items: [
        { icon: Utensils, name: 'Gourmet Kitchen', description: 'Fully equipped with modern appliances' },
        { icon: Coffee, name: 'Coffee Station', description: 'Coffee maker, grinder, and premium beans' },
        { icon: Utensils, name: 'Cookware & Dishes', description: 'Everything you need to cook and dine' },
        { icon: Utensils, name: 'Dining for 8', description: 'Indoor dining plus outdoor deck table' },
      ],
    },
    {
      title: 'Technology & Entertainment',
      items: [
        { icon: Wifi, name: 'High-Speed WiFi', description: 'Reliable fiber internet throughout' },
        { icon: Tv, name: 'Smart TVs', description: 'Streaming services in living room and master' },
        { icon: Laptop, name: 'Work-Friendly', description: 'Dedicated workspace with monitor' },
        { icon: Gamepad2, name: 'Board Games', description: 'Family game collection included' },
        { icon: Music, name: 'Bluetooth Speaker', description: 'Quality sound system' },
        { icon: BookOpen, name: 'Reading Nook', description: 'Curated book collection' },
      ],
    },
    {
      title: 'Safety & Essentials',
      items: [
        { icon: Award, name: 'First Aid Kit', description: 'Fully stocked for emergencies' },
        { icon: Home, name: 'Smoke Detectors', description: 'Throughout the property' },
        { icon: Home, name: 'Carbon Monoxide', description: 'Detectors in all sleeping areas' },
        { icon: Bath, name: 'Essentials Provided', description: 'Towels, linens, soap, toilet paper' },
        { icon: Heart, name: 'Pet Friendly', description: 'With approval and additional fee' },
      ],
    },
  ];

  const perfectFor = [
    { label: 'Family Vacations', icon: Users },
    { label: 'Couples Retreats', icon: Heart },
    { label: 'Remote Work Stays', icon: Laptop },
    { label: 'Small Group Getaways', icon: Users },
    { label: 'Weekend Escapes', icon: Waves },
    { label: 'Fishing Trips', icon: Waves },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="font-serif text-5xl font-bold text-gray-900 mb-4">What's Here</h1>
          <p className="text-lg text-gray-600">
            We didn't cut corners. If we stay here, we want it here—so it's here for you too.
          </p>
        </div>

        <div className="space-y-12 mb-16">
          {amenityGroups.map((group, idx) => (
            <div key={idx} className="bg-white rounded-xl p-8 border border-gray-200">
              <h2 className="font-serif text-2xl font-bold text-gray-900 mb-6">{group.title}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {group.items.map((item, itemIdx) => (
                  <div key={itemIdx} className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-6 h-6 text-emerald-700" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">{item.name}</h3>
                      <p className="text-sm text-gray-600">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-emerald-50 rounded-xl p-8 border border-emerald-200">
          <h2 className="font-serif text-2xl font-bold text-gray-900 mb-6 text-center">
            Perfect For
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            {perfectFor.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 px-5 py-3 bg-white rounded-full border border-emerald-300"
              >
                <item.icon className="w-5 h-5 text-emerald-700" />
                <span className="font-medium text-gray-900">{item.label}</span>
              </div>
            ))}
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
