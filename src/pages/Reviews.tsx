import { useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import { supabase, type Review } from '../lib/supabase';

interface ReviewsProps {
  onNavigate: (path: string) => void;
}

export const Reviews = ({ onNavigate }: ReviewsProps) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      const { data } = await supabase
        .from('reviews')
        .select('*')
        .eq('approved', true)
        .order('created_at', { ascending: false });

      if (data) setReviews(data);
      setLoading(false);
    };

    fetchReviews();
  }, []);

  const averageRating =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : '5.0';

  const ratingBreakdown = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: reviews.filter(r => r.rating === rating).length,
    percentage: reviews.length > 0
      ? ((reviews.filter(r => r.rating === rating).length / reviews.length) * 100).toFixed(0)
      : '0',
  }));

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-700"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="font-serif text-5xl font-bold text-gray-900 mb-4">What Guests Say</h1>
          <p className="text-lg text-gray-600">
            Real reviews from real stays. We don't filter the honest feedback.
          </p>
        </div>

        <div className="bg-white rounded-xl p-8 border border-gray-200 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="text-center">
              <div className="text-6xl font-bold text-gray-900 mb-2">{averageRating}</div>
              <div className="flex items-center justify-center gap-1 mb-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-6 h-6 ${
                      i < Math.round(parseFloat(averageRating))
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <p className="text-gray-600">Based on {reviews.length} reviews</p>
            </div>

            <div className="space-y-3">
              {ratingBreakdown.map(item => (
                <div key={item.rating} className="flex items-center gap-3">
                  <div className="flex items-center gap-1 w-20">
                    <span className="text-sm font-medium">{item.rating}</span>
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  </div>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-400 h-2 rounded-full"
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 w-12">{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {reviews.map(review => (
            <article
              key={review.id}
              className="bg-white rounded-xl p-8 border border-gray-200"
              itemScope
              itemType="https://schema.org/Review"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold text-gray-900" itemProp="author">
                      {review.guest_name}
                    </span>
                    <span className="text-gray-400">•</span>
                    <time className="text-sm text-gray-600" itemProp="datePublished">
                      {new Date(review.stay_date).toLocaleDateString('en-US', {
                        month: 'long',
                        year: 'numeric',
                      })}
                    </time>
                  </div>
                  <div className="flex items-center gap-1" itemProp="reviewRating" itemScope itemType="https://schema.org/Rating">
                    <meta itemProp="worstRating" content="1" />
                    <meta itemProp="bestRating" content="5" />
                    <meta itemProp="ratingValue" content={review.rating.toString()} />
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < review.rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <h3 className="font-semibold text-xl text-gray-900 mb-3" itemProp="name">
                {review.title}
              </h3>
              <p className="text-gray-700 leading-relaxed" itemProp="reviewBody">
                {review.comment}
              </p>

              <meta itemProp="itemReviewed" itemScope itemType="https://schema.org/LodgingBusiness" />
            </article>
          ))}
        </div>

        <div className="text-center mt-12">
          <button
            onClick={() => onNavigate('/stay')}
            className="px-8 py-4 bg-emerald-700 text-white font-semibold rounded-lg hover:bg-emerald-600 transition-all"
          >
            Book Your Stay
          </button>
        </div>
      </div>
    </div>
  );
};
