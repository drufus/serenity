import { useEffect, useState } from 'react';
import { CheckCircle, Calendar, Mail, Phone, MapPin, Download, FileText } from 'lucide-react';
import { supabase, type Booking } from '../lib/supabase';

interface ConfirmationProps {
  onNavigate: (path: string) => void;
  confirmationCode: string;
}

export const Confirmation = ({ onNavigate, confirmationCode }: ConfirmationProps) => {
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooking = async () => {
      const { data } = await supabase
        .from('bookings')
        .select('*')
        .eq('confirmation_code', confirmationCode)
        .single();

      if (data) {
        setBooking(data);
        await supabase
          .from('bookings')
          .update({ status: 'confirmed' })
          .eq('id', data.id);
      }
      setLoading(false);
    };

    if (confirmationCode) {
      fetchBooking();
    }
  }, [confirmationCode]);

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
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Booking Not Found</h1>
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

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-100 rounded-full mb-6">
            <CheckCircle className="w-12 h-12 text-emerald-700" />
          </div>
          <h1 className="font-serif text-5xl font-bold text-gray-900 mb-4">
            Booking Confirmed!
          </h1>
          <p className="text-lg text-gray-600 mb-2">
            Thank you for booking Serenity Lake House
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg">
            <span className="text-sm text-gray-600">Confirmation Code:</span>
            <span className="font-mono font-bold text-lg text-emerald-700">
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
              <div className="text-sm text-gray-600 mt-2">
                Full address and check-in instructions will be sent 48 hours before arrival
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-200 space-y-3">
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

        <div className="bg-white rounded-xl p-8 border border-gray-200 mb-8">
          <h2 className="font-serif text-2xl font-bold text-gray-900 mb-6">Guest Information</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-gray-400" />
              <span className="text-gray-700">{booking.guest_email}</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-gray-400" />
              <span className="text-gray-700">{booking.guest_phone}</span>
            </div>
          </div>
        </div>

        <div className="bg-emerald-50 rounded-xl p-8 border border-emerald-200 mb-8">
          <h2 className="font-serif text-2xl font-bold text-gray-900 mb-4">Next Steps</h2>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-emerald-700 font-bold">1.</span>
              <span>
                A confirmation email has been sent to <strong>{booking.guest_email}</strong>
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-700 font-bold">2.</span>
              <span>
                You'll receive check-in instructions 48 hours before your arrival with the smart
                lock code and parking details
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-700 font-bold">3.</span>
              <span>
                We'll send a digital rental agreement for your signature before check-in
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-700 font-bold">4.</span>
              <span>
                Feel free to contact us anytime at hello@serenitylakehouse.com or (555) 123-4567
              </span>
            </li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => onNavigate(`/reservation/${booking.confirmation_code}`)}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-emerald-700 text-white font-semibold rounded-lg hover:bg-emerald-600 transition-all"
          >
            <FileText className="w-5 h-5" />
            View Reservation
          </button>
          <button
            onClick={() => onNavigate('/')}
            className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all"
          >
            Return Home
          </button>
        </div>
      </div>
    </div>
  );
};
