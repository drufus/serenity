import { useEffect, useState } from 'react';
import { Calendar, Mail, Phone, MapPin, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase, type Booking } from '../lib/supabase';

interface ReservationProps {
  confirmationCode: string;
  onNavigate: (path: string) => void;
}

export const Reservation = ({ confirmationCode, onNavigate }: ReservationProps) => {
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [agreementSigned, setAgreementSigned] = useState(false);
  const [isSigning, setIsSigning] = useState(false);

  useEffect(() => {
    const fetchBooking = async () => {
      const { data } = await supabase
        .from('bookings')
        .select('*')
        .eq('confirmation_code', confirmationCode)
        .single();

      if (data) {
        setBooking(data);
        setAgreementSigned(data.agreement_signed);
      }
      setLoading(false);
    };

    if (confirmationCode) {
      fetchBooking();
    }
  }, [confirmationCode]);

  const handleSignAgreement = async () => {
    if (!booking) return;

    setIsSigning(true);
    try {
      const { error } = await supabase
        .from('bookings')
        .update({
          agreement_signed: true,
          agreement_signed_at: new Date().toISOString(),
        })
        .eq('id', booking.id);

      if (error) throw error;

      setAgreementSigned(true);
      setBooking({ ...booking, agreement_signed: true, agreement_signed_at: new Date().toISOString() });
    } catch (error) {
      console.error('Error signing agreement:', error);
      alert('There was an error signing the agreement. Please try again.');
    } finally {
      setIsSigning(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-700"></div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-16 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Reservation Not Found</h1>
          <p className="text-gray-600 mb-6">
            Please check your confirmation code and try again.
          </p>
          <button
            onClick={() => onNavigate('/')}
            className="px-6 py-3 bg-emerald-700 text-white font-semibold rounded-lg hover:bg-emerald-600 transition-all"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  const checkInDate = new Date(booking.check_in + 'T00:00:00');
  const checkOutDate = new Date(booking.check_out + 'T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const isUpcoming = checkInDate >= today;
  const isActive = checkInDate <= today && checkOutDate > today;
  const isPast = checkOutDate <= today;

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="font-serif text-4xl font-bold text-gray-900">Your Reservation</h1>
            <div
              className={`px-4 py-2 rounded-full text-sm font-semibold ${
                isUpcoming
                  ? 'bg-blue-100 text-blue-800'
                  : isActive
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {isUpcoming ? 'Upcoming' : isActive ? 'Active' : 'Completed'}
            </div>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <span>Confirmation Code:</span>
            <span className="font-mono font-bold text-emerald-700">
              {booking.confirmation_code}
            </span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-8 border border-gray-200 mb-8">
          <h2 className="font-serif text-2xl font-bold text-gray-900 mb-6">Trip Details</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Calendar className="w-6 h-6 text-emerald-700" />
              </div>
              <div>
                <div className="font-semibold text-gray-900 mb-1">Check-in</div>
                <div className="text-gray-700">
                  {checkInDate.toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </div>
                <div className="text-sm text-gray-600">After 4:00 PM</div>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Calendar className="w-6 h-6 text-emerald-700" />
              </div>
              <div>
                <div className="font-semibold text-gray-900 mb-1">Check-out</div>
                <div className="text-gray-700">
                  {checkOutDate.toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </div>
                <div className="text-sm text-gray-600">Before 11:00 AM</div>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-4 mb-8">
            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <MapPin className="w-6 h-6 text-emerald-700" />
            </div>
            <div>
              <div className="font-semibold text-gray-900 mb-1">Serenity Lake House</div>
              <div className="text-gray-700">Lake Anna, Virginia</div>
              {isUpcoming && (
                <div className="text-sm text-gray-600 mt-2">
                  Check-in instructions will be sent 48 hours before arrival
                </div>
              )}
            </div>
          </div>

          <div className="pt-6 border-t border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-4">Guest Information</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <span className="text-gray-600 w-24">Name:</span>
                <span className="text-gray-900">{booking.guest_name}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Mail className="w-4 h-4 text-gray-400" />
                <span className="text-gray-900">{booking.guest_email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="w-4 h-4 text-gray-400" />
                <span className="text-gray-900">{booking.guest_phone}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <span className="text-gray-600 w-24">Guests:</span>
                <span className="text-gray-900">{booking.num_guests}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-8 border border-gray-200 mb-8">
          <h2 className="font-serif text-2xl font-bold text-gray-900 mb-6">Payment Summary</h2>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">{booking.num_nights} nights</span>
              <span className="font-medium">${booking.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Cleaning fee</span>
              <span className="font-medium">${booking.cleaning_fee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Taxes</span>
              <span className="font-medium">${booking.tax_amount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold pt-3 border-t border-gray-200">
              <span>Total Paid</span>
              <span className="text-emerald-700">${booking.total_amount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {isUpcoming && (
          <div
            className={`rounded-xl p-8 border mb-8 ${
              agreementSigned
                ? 'bg-emerald-50 border-emerald-200'
                : 'bg-amber-50 border-amber-200'
            }`}
          >
            <div className="flex items-start gap-4">
              {agreementSigned ? (
                <>
                  <CheckCircle className="w-8 h-8 text-emerald-700 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900 mb-2">
                      Rental Agreement Signed
                    </h3>
                    <p className="text-gray-700">
                      Thank you for signing the rental agreement. You're all set for your stay!
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <AlertCircle className="w-8 h-8 text-amber-700 flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-gray-900 mb-2">
                      Rental Agreement Required
                    </h3>
                    <p className="text-gray-700 mb-4">
                      Please review and sign the rental agreement before your arrival. This includes
                      house rules, policies, and terms of your stay.
                    </p>
                    <div className="flex gap-4">
                      <button
                        onClick={() => onNavigate('/policies')}
                        className="px-6 py-2 border-2 border-amber-700 text-amber-700 font-semibold rounded-lg hover:bg-amber-100 transition-all"
                      >
                        Review Agreement
                      </button>
                      <button
                        onClick={handleSignAgreement}
                        disabled={isSigning}
                        className="px-6 py-2 bg-amber-700 text-white font-semibold rounded-lg hover:bg-amber-800 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed"
                      >
                        {isSigning ? 'Signing...' : 'Sign Agreement'}
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {booking.special_requests && (
          <div className="bg-white rounded-xl p-8 border border-gray-200 mb-8">
            <h3 className="font-semibold text-gray-900 mb-3">Special Requests</h3>
            <p className="text-gray-700">{booking.special_requests}</p>
          </div>
        )}

        <div className="bg-gray-100 rounded-xl p-8">
          <h3 className="font-semibold text-gray-900 mb-4">Need Help?</h3>
          <p className="text-gray-700 mb-4">
            If you have any questions about your reservation, please don't hesitate to contact us.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href="mailto:hello@serenitylakehouse.com"
              className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all"
            >
              <Mail className="w-5 h-5" />
              Email Us
            </a>
            <a
              href="tel:+15551234567"
              className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all"
            >
              <Phone className="w-5 h-5" />
              Call Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
