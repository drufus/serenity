import { MapPin, Clock, Coffee, ShoppingBag, Utensils, Trees, Compass } from 'lucide-react';

interface AreaProps {
  onNavigate: (path: string) => void;
}

export const Area = ({ onNavigate }: AreaProps) => {
  const nearbyAttractions = [
    {
      icon: Compass,
      name: 'Lake Anna State Park',
      distance: '3 miles',
      description: 'Hiking trails, beach access, and nature programs',
    },
    {
      icon: Utensils,
      name: 'Gano\'s Dockside Restaurant',
      distance: '5 miles',
      description: 'Waterfront dining with fresh seafood and live music',
    },
    {
      icon: ShoppingBag,
      name: 'Lake Anna Winery',
      distance: '8 miles',
      description: 'Award-winning wines with scenic vineyard views',
    },
    {
      icon: Compass,
      name: 'Boat Rentals',
      distance: '4 miles',
      description: 'Pontoon, ski boats, and jet ski rentals',
    },
    {
      icon: Coffee,
      name: 'The Lakeside Café',
      distance: '6 miles',
      description: 'Coffee, breakfast, and fresh-baked goods',
    },
    {
      icon: ShoppingBag,
      name: 'Food Lion',
      distance: '7 miles',
      description: 'Full-service grocery store for all your needs',
    },
    {
      icon: Trees,
      name: 'North Anna Battlefield Park',
      distance: '12 miles',
      description: 'Historic Civil War site with walking trails',
    },
    {
      icon: Utensils,
      name: 'Louisa County Farmers Market',
      distance: '10 miles',
      description: 'Fresh local produce and artisan goods (seasonal)',
    },
  ];

  const driveTimes = [
    { city: 'Richmond, VA', time: '1 hour' },
    { city: 'Charlottesville, VA', time: '45 minutes' },
    { city: 'Washington, DC', time: '1.5 hours' },
    { city: 'Fredericksburg, VA', time: '45 minutes' },
  ];

  const safetyTips = [
    'Life jackets are provided and required for all water activities',
    'Lake Anna has a warm side and cool side - we\'re on the warm side',
    'Please observe no-wake zones near docks and swimming areas',
    'Fishing license required for anyone 16+ (available online)',
    'Be aware of boat traffic, especially on weekends',
    'Check weather conditions before heading out on the water',
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="font-serif text-5xl font-bold text-gray-900 mb-4">What's Nearby</h1>
          <p className="text-lg text-gray-600">
            You came for the lake. But here's what else is within reach when you're ready to explore.
          </p>
        </div>

        <div className="bg-white rounded-xl p-8 border border-gray-200 mb-12">
          <div className="flex items-start gap-4 mb-6">
            <MapPin className="w-8 h-8 text-emerald-700 flex-shrink-0" />
            <div>
              <h2 className="font-serif text-2xl font-bold text-gray-900 mb-2">About Lake Anna</h2>
              <p className="text-gray-600 leading-relaxed">
                Lake Anna is 13,000 acres of warm, swimmable water in Central Virginia. It's split into
                two sides by a power plant—we're on the warm side, which stays comfortable for swimming
                even in spring and fall. The lake has over 200 miles of shoreline, which means you can
                paddle for hours and barely see another soul. Bass and crappie fishing is excellent.
                Bald eagles nest here. It's the kind of place where you lose track of what day it is.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-8 border border-gray-200 mb-12">
          <h2 className="font-serif text-2xl font-bold text-gray-900 mb-6">Nearby Attractions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {nearbyAttractions.map((place, idx) => (
              <div key={idx} className="flex items-start gap-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <place.icon className="w-6 h-6 text-emerald-700" />
                </div>
                <div>
                  <div className="flex items-baseline gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900">{place.name}</h3>
                    <span className="text-sm text-gray-500">{place.distance}</span>
                  </div>
                  <p className="text-sm text-gray-600">{place.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-xl p-8 border border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <Clock className="w-8 h-8 text-emerald-700" />
              <h2 className="font-serif text-2xl font-bold text-gray-900">Drive Times</h2>
            </div>
            <div className="space-y-4">
              {driveTimes.map((drive, idx) => (
                <div key={idx} className="flex justify-between items-center">
                  <span className="font-medium text-gray-900">{drive.city}</span>
                  <span className="text-gray-600">{drive.time}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-emerald-50 rounded-xl p-8 border border-emerald-200">
            <div className="flex items-center gap-3 mb-6">
              <Compass className="w-8 h-8 text-emerald-700" />
              <h2 className="font-serif text-2xl font-bold text-gray-900">Lake Safety & Etiquette</h2>
            </div>
            <ul className="space-y-3">
              {safetyTips.map((tip, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="text-emerald-700 font-bold">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="bg-white rounded-xl p-8 border border-gray-200">
          <h2 className="font-serif text-2xl font-bold text-gray-900 mb-4 text-center">
            Location Map
          </h2>
          <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
            <div className="text-center text-gray-500">
              <MapPin className="w-12 h-12 mx-auto mb-2 text-emerald-700" />
              <p>Lake Anna, Virginia</p>
              <p className="text-sm">Central Virginia's Premier Lake Destination</p>
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
