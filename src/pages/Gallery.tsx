import { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface GalleryProps {
  onNavigate: (path: string) => void;
}

export const Gallery = ({ onNavigate }: GalleryProps) => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Photos' },
    { id: 'exterior', label: 'Exterior' },
    { id: 'dock', label: 'Dock & Lake' },
    { id: 'living', label: 'Living Areas' },
    { id: 'kitchen', label: 'Kitchen' },
    { id: 'bedroom', label: 'Bedrooms' },
    { id: 'bathroom', label: 'Bathrooms' },
  ];

  const images = [
    { category: 'exterior', url: 'https://images.pexels.com/photos/1732414/pexels-photo-1732414.jpeg?auto=compress&cs=tinysrgb&w=1200', alt: 'Front view of Serenity Lake House', caption: 'Welcome to your lakefront retreat' },
    { category: 'dock', url: 'https://images.pexels.com/photos/2119713/pexels-photo-2119713.jpeg?auto=compress&cs=tinysrgb&w=1200', alt: 'Private dock at sunset', caption: 'Your private dock with stunning sunset views' },
    { category: 'living', url: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1200', alt: 'Modern living room', caption: 'Spacious living area with lake views' },
    { category: 'kitchen', url: 'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=1200', alt: 'Fully equipped kitchen', caption: 'Gourmet kitchen with modern appliances' },
    { category: 'bedroom', url: 'https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=1200', alt: 'Master bedroom', caption: 'Master bedroom with plush bedding' },
    { category: 'bathroom', url: 'https://images.pexels.com/photos/1457847/pexels-photo-1457847.jpeg?auto=compress&cs=tinysrgb&w=1200', alt: 'Modern bathroom', caption: 'Spa-like bathroom with premium fixtures' },
    { category: 'exterior', url: 'https://images.pexels.com/photos/1438832/pexels-photo-1438832.jpeg?auto=compress&cs=tinysrgb&w=1200', alt: 'Outdoor deck area', caption: 'Deck perfect for morning coffee' },
    { category: 'dock', url: 'https://images.pexels.com/photos/2440952/pexels-photo-2440952.jpeg?auto=compress&cs=tinysrgb&w=1200', alt: 'Kayaks at the dock', caption: 'Complimentary kayaks for your adventure' },
  ];

  const filteredImages = selectedCategory === 'all'
    ? images
    : images.filter(img => img.category === selectedCategory);

  const openLightbox = (index: number) => {
    setSelectedImage(index);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const nextImage = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage + 1) % filteredImages.length);
    }
  };

  const prevImage = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage - 1 + filteredImages.length) % filteredImages.length);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="font-serif text-5xl font-bold text-gray-900 mb-4">See For Yourself</h1>
          <p className="text-lg text-gray-600">
            These aren't staged photos. This is what it actually looks like when you arrive.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                selectedCategory === cat.id
                  ? 'bg-emerald-700 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredImages.map((img, idx) => (
            <div
              key={idx}
              onClick={() => openLightbox(idx)}
              className="aspect-[4/3] rounded-xl overflow-hidden cursor-pointer group"
            >
              <img
                src={img.url}
                alt={img.alt}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
          ))}
        </div>

        {selectedImage !== null && (
          <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center">
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 p-2 text-white hover:bg-white/10 rounded-lg"
            >
              <X className="w-8 h-8" />
            </button>

            <button
              onClick={prevImage}
              className="absolute left-4 p-2 text-white hover:bg-white/10 rounded-lg"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>

            <button
              onClick={nextImage}
              className="absolute right-4 p-2 text-white hover:bg-white/10 rounded-lg"
            >
              <ChevronRight className="w-8 h-8" />
            </button>

            <div className="max-w-5xl max-h-[90vh] mx-auto px-4">
              <img
                src={filteredImages[selectedImage].url}
                alt={filteredImages[selectedImage].alt}
                className="max-w-full max-h-[80vh] object-contain mx-auto"
              />
              <p className="text-white text-center mt-4 text-lg">
                {filteredImages[selectedImage].caption}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
