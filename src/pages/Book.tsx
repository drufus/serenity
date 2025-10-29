import { useEffect, useState } from 'react';
import { Check, CreditCard, FileText, ChevronRight } from 'lucide-react';
import { supabase, type PropertySettings, type Addon } from '../lib/supabase';
import { calculateBookingPrice, createBooking, formatDate } from '../lib/bookingUtils';

interface BookProps {
  onNavigate: (path: string) => void;
}

export const Book = ({ onNavigate }: BookProps) => {
  const [step, setStep] = useState(1);
  const [settings, setSettings] = useState<PropertySettings | null>(null);
  const [addons, setAddons] = useState<Addon[]>([]);
  const [selectedAddons, setSelectedAddons] = useState<Map<string, number>>(new Map());

  const [bookingData, setBookingData] = useState({
    checkIn: '',
    checkOut: '',
    numGuests: 2,
    guestName: '',
    guestEmail: '',
    guestPhone: '',
    specialRequests: '',
  });

  const [pricing, setPricing] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const [settingsRes, addonsRes] = await Promise.all([
        supabase.from('property_settings').select('*').single(),
        supabase.from('addons').select('*').eq('active', true).order('sort_order'),
      ]);

      if (settingsRes.data) setSettings(settingsRes.data);
      if (addonsRes.data) setAddons(addonsRes.data);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (bookingData.checkIn && bookingData.checkOut && settings) {
      calculatePricing();
    }
  }, [bookingData.checkIn, bookingData.checkOut, selectedAddons, settings]);

  const calculatePricing = async () => {
    if (!settings) return;

    let addonTotal = 0;
    selectedAddons.forEach((quantity, addonId) => {
      const addon = addons.find(a => a.id === addonId);
      if (addon) {
        addonTotal += addon.price * quantity;
      }
    });

    const result = await calculateBookingPrice(
      bookingData.checkIn,
      bookingData.checkOut,
      settings,
      addonTotal
    );
    setPricing(result);
  };

  const toggleAddon = (addonId: string) => {
    const newAddons = new Map(selectedAddons);
    if (newAddons.has(addonId)) {
      newAddons.delete(addonId);
    } else {
      newAddons.set(addonId, 1);
    }
    setSelectedAddons(newAddons);
  };

  const handleSubmit = async () => {
    if (!pricing || !settings) return;

    setIsProcessing(true);

    try {
      const addonsList = Array.from(selectedAddons.entries()).map(([addonId, quantity]) => {
        const addon = addons.find(a => a.id === addonId);
        return {
          addon_id: addonId,
          quantity,
          price: addon!.price,
        };
      });

      const { booking, error } = await createBooking({
        guestName: bookingData.guestName,
        guestEmail: bookingData.guestEmail,
        guestPhone: bookingData.guestPhone,
        checkIn: bookingData.checkIn,
        checkOut: bookingData.checkOut,
        numGuests: bookingData.numGuests,
        specialRequests: bookingData.specialRequests,
        pricing,
        addons: addonsList,
      });

      if (error) throw error;

      onNavigate(`/confirmation?code=${booking.confirmation_code}`);
    } catch (error) {
      console.error('Booking error:', error);
      alert('There was an error processing your booking. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  if (!settings) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-700"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="font-serif text-5xl font-bold text-gray-900 mb-4">Book Your Stay</h1>
          <div className="flex items-center justify-center gap-4 text-sm">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                    step >= s ? 'bg-emerald-700 text-white' : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {s}
                </div>
                {s < 4 && <ChevronRight className="w-4 h-4 text-gray-400" />}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {step === 1 && (
              <div className="bg-white rounded-xl p-8 border border-gray-200">
                <h2 className="font-serif text-2xl font-bold text-gray-900 mb-6">Select Dates</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Check-in Date
                    </label>
                    <input
                      type="date"
                      min={today}
                      value={bookingData.checkIn}
                      onChange={(e) =>
                        setBookingData({ ...bookingData, checkIn: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Check-out Date
                    </label>
                    <input
                      type="date"
                      min={bookingData.checkIn || today}
                      value={bookingData.checkOut}
                      onChange={(e) =>
                        setBookingData({ ...bookingData, checkOut: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Number of Guests
                    </label>
                    <input
                      type="number"
                      min="1"
                      max={settings.sleeps}
                      value={bookingData.numGuests}
                      onChange={(e) =>
                        setBookingData({ ...bookingData, numGuests: parseInt(e.target.value) })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <button
                  onClick={() => setStep(2)}
                  disabled={!bookingData.checkIn || !bookingData.checkOut}
                  className="w-full mt-6 py-3 bg-emerald-700 text-white font-semibold rounded-lg hover:bg-emerald-600 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Continue
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="bg-white rounded-xl p-8 border border-gray-200">
                <h2 className="font-serif text-2xl font-bold text-gray-900 mb-6">Add Extras</h2>
                <div className="space-y-4">
                  {addons.map((addon) => (
                    <label
                      key={addon.id}
                      className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50"
                    >
                      <input
                        type="checkbox"
                        checked={selectedAddons.has(addon.id)}
                        onChange={() => toggleAddon(addon.id)}
                        className="mt-1 w-5 h-5 text-emerald-700 border-gray-300 rounded focus:ring-emerald-500"
                      />
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-1">
                          <span className="font-semibold text-gray-900">{addon.name}</span>
                          <span className="font-semibold text-gray-900">
                            ${addon.price.toFixed(2)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{addon.description}</p>
                      </div>
                    </label>
                  ))}
                </div>
                <div className="flex gap-4 mt-6">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    className="flex-1 py-3 bg-emerald-700 text-white font-semibold rounded-lg hover:bg-emerald-600 transition-all"
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="bg-white rounded-xl p-8 border border-gray-200">
                <h2 className="font-serif text-2xl font-bold text-gray-900 mb-6">
                  Guest Information
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={bookingData.guestName}
                      onChange={(e) =>
                        setBookingData({ ...bookingData, guestName: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Email</label>
                    <input
                      type="email"
                      required
                      value={bookingData.guestEmail}
                      onChange={(e) =>
                        setBookingData({ ...bookingData, guestEmail: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Phone</label>
                    <input
                      type="tel"
                      required
                      value={bookingData.guestPhone}
                      onChange={(e) =>
                        setBookingData({ ...bookingData, guestPhone: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Special Requests <span className="font-normal text-gray-500">(optional)</span>
                    </label>
                    <textarea
                      value={bookingData.specialRequests}
                      onChange={(e) =>
                        setBookingData({ ...bookingData, specialRequests: e.target.value })
                      }
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                    />
                  </div>
                </div>
                <div className="flex gap-4 mt-6">
                  <button
                    onClick={() => setStep(2)}
                    className="flex-1 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setStep(4)}
                    disabled={
                      !bookingData.guestName || !bookingData.guestEmail || !bookingData.guestPhone
                    }
                    className="flex-1 py-3 bg-emerald-700 text-white font-semibold rounded-lg hover:bg-emerald-600 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="bg-white rounded-xl p-8 border border-gray-200">
                <h2 className="font-serif text-2xl font-bold text-gray-900 mb-6">
                  Payment & Agreement
                </h2>
                <div className="space-y-6">
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <CreditCard className="w-6 h-6 text-blue-700 flex-shrink-0 mt-1" />
                      <div className="text-sm text-blue-900">
                        <p className="font-semibold mb-1">Payment Processing</p>
                        <p>
                          In a production environment, this would integrate with Stripe or another
                          payment processor for secure payment handling.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <FileText className="w-6 h-6 text-gray-700 flex-shrink-0 mt-1" />
                      <div className="text-sm text-gray-700">
                        <p className="font-semibold mb-2">Rental Agreement</p>
                        <p className="mb-3">
                          By completing this booking, you agree to our house rules, cancellation
                          policy, and terms of service.
                        </p>
                        <button
                          onClick={() => onNavigate('/policies')}
                          className="text-emerald-700 font-semibold hover:underline"
                        >
                          Review Policies
                        </button>
                      </div>
                    </div>
                  </div>

                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      className="mt-1 w-5 h-5 text-emerald-700 border-gray-300 rounded focus:ring-emerald-500"
                      required
                    />
                    <span className="text-sm text-gray-700">
                      I agree to the rental agreement, house rules, and cancellation policy. I
                      understand that a ${settings.damage_deposit.toFixed(2)} damage deposit will be
                      held and refunded within 7 days after check-out if no damages occur.
                    </span>
                  </label>
                </div>

                <div className="flex gap-4 mt-8">
                  <button
                    onClick={() => setStep(3)}
                    className="flex-1 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={isProcessing}
                    className="flex-1 py-3 bg-emerald-700 text-white font-semibold rounded-lg hover:bg-emerald-600 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? 'Processing...' : 'Complete Booking'}
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 border border-gray-200 sticky top-24">
              <h3 className="font-semibold text-lg text-gray-900 mb-4">Booking Summary</h3>

              {bookingData.checkIn && bookingData.checkOut ? (
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Dates</div>
                    <div className="font-medium text-gray-900">
                      {new Date(bookingData.checkIn + 'T00:00:00').toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}{' '}
                      -{' '}
                      {new Date(bookingData.checkOut + 'T00:00:00').toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-gray-600 mb-1">Guests</div>
                    <div className="font-medium text-gray-900">{bookingData.numGuests}</div>
                  </div>

                  {pricing && (
                    <>
                      <div className="pt-4 border-t border-gray-200 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">
                            ${settings.base_nightly_rate} × {pricing.numNights} nights
                          </span>
                          <span className="font-medium">${pricing.subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Cleaning fee</span>
                          <span className="font-medium">${pricing.cleaningFee.toFixed(2)}</span>
                        </div>
                        {pricing.addonTotal > 0 && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Add-ons</span>
                            <span className="font-medium">${pricing.addonTotal.toFixed(2)}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Taxes</span>
                          <span className="font-medium">${pricing.taxAmount.toFixed(2)}</span>
                        </div>
                      </div>
                      <div className="pt-4 border-t border-gray-200">
                        <div className="flex justify-between text-lg font-bold">
                          <span>Total</span>
                          <span>${pricing.totalAmount.toFixed(2)}</span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <p className="text-sm text-gray-500">Select dates to see pricing</p>
              )}

              <div className="mt-6 pt-6 border-t border-gray-200 space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-700" />
                  <span>Free cancellation (30+ days)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-700" />
                  <span>Instant confirmation</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-700" />
                  <span>No platform fees</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
