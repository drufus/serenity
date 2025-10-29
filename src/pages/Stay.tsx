import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { supabase, type PropertySettings } from '../lib/supabase';
import { getBlockedDatesInRange, formatDate } from '../lib/bookingUtils';

interface StayProps {
  onNavigate: (path: string) => void;
}

export const Stay = ({ onNavigate }: StayProps) => {
  const [settings, setSettings] = useState<PropertySettings | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [blockedDates, setBlockedDates] = useState<string[]>([]);
  const [selectedCheckIn, setSelectedCheckIn] = useState<Date | null>(null);
  const [selectedCheckOut, setSelectedCheckOut] = useState<Date | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase.from('property_settings').select('*').single();
      if (data) setSettings(data);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchBlockedDates = async () => {
      const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
      const endOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 2, 0);

      const blocked = await getBlockedDatesInRange(
        formatDate(startOfMonth),
        formatDate(endOfMonth)
      );
      setBlockedDates(blocked);
    };
    fetchBlockedDates();
  }, [currentMonth]);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek };
  };

  const isDateBlocked = (date: Date) => {
    const dateStr = formatDate(date);
    return blockedDates.includes(dateStr);
  };

  const isDateInPast = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const handleDateClick = (date: Date) => {
    if (isDateBlocked(date) || isDateInPast(date)) return;

    if (!selectedCheckIn || (selectedCheckIn && selectedCheckOut)) {
      setSelectedCheckIn(date);
      setSelectedCheckOut(null);
    } else if (selectedCheckIn && !selectedCheckOut) {
      if (date > selectedCheckIn) {
        setSelectedCheckOut(date);
      } else {
        setSelectedCheckIn(date);
        setSelectedCheckOut(null);
      }
    }
  };

  const renderCalendar = (monthOffset: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + monthOffset, 1);
    const { daysInMonth, startingDayOfWeek } = getDaysInMonth(date);

    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="aspect-square"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(date.getFullYear(), date.getMonth(), day);
      const isBlocked = isDateBlocked(currentDate);
      const isPast = isDateInPast(currentDate);
      const isCheckIn = selectedCheckIn && formatDate(currentDate) === formatDate(selectedCheckIn);
      const isCheckOut =
        selectedCheckOut && formatDate(currentDate) === formatDate(selectedCheckOut);
      const isInRange =
        selectedCheckIn &&
        selectedCheckOut &&
        currentDate > selectedCheckIn &&
        currentDate < selectedCheckOut;

      days.push(
        <button
          key={day}
          onClick={() => handleDateClick(currentDate)}
          disabled={isBlocked || isPast}
          className={`aspect-square flex items-center justify-center text-sm rounded-lg transition-all ${
            isBlocked || isPast
              ? 'text-gray-300 cursor-not-allowed'
              : isCheckIn || isCheckOut
              ? 'bg-emerald-700 text-white font-semibold'
              : isInRange
              ? 'bg-emerald-100 text-emerald-900'
              : 'hover:bg-gray-100 text-gray-700'
          }`}
        >
          {day}
        </button>
      );
    }

    return (
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <div className="text-center mb-4 font-semibold text-gray-900">
          {date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </div>
        <div className="grid grid-cols-7 gap-2 mb-2">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
            <div key={day} className="text-center text-xs font-semibold text-gray-500">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2">{days}</div>
      </div>
    );
  };

  const calculateTotal = () => {
    if (!selectedCheckIn || !selectedCheckOut || !settings) return null;

    const nights = Math.ceil(
      (selectedCheckOut.getTime() - selectedCheckIn.getTime()) / (1000 * 60 * 60 * 24)
    );
    const subtotal = settings.base_nightly_rate * nights;
    const cleaningFee = settings.cleaning_fee;
    const beforeTax = subtotal + cleaningFee;
    const tax = beforeTax * settings.tax_rate;
    const total = beforeTax + tax;

    return { nights, subtotal, cleaningFee, tax, total };
  };

  const pricing = calculateTotal();

  const included = [
    'Hotel-quality linens (the good stuff)',
    'Kitchen actually stocked for cooking',
    'Fast Wi-Fi that works everywhere',
    'Smart TVs with your streaming apps',
    'Two kayaks ready to launch',
    'Life vests in every size',
    'Gas grill and lakeside fire pit',
    'Your private dock',
    'Parking for 3 cars',
    'Coffee, spices, olive oil—basics covered',
  ];

  if (!settings) {
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
          <h1 className="font-serif text-5xl font-bold text-gray-900 mb-4">
            Find Your Dates
          </h1>
          <p className="text-lg text-gray-600">
            No hidden fees. No surprises. Just honest pricing for the lake house you've been looking for.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() =>
                  setCurrentMonth(
                    new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
                  )
                }
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={() =>
                  setCurrentMonth(
                    new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
                  )
                }
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {renderCalendar(0)}
              {renderCalendar(1)}
            </div>

            <div className="flex items-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-emerald-700 rounded"></div>
                <span>Selected</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-emerald-100 rounded"></div>
                <span>In Range</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-200 rounded"></div>
                <span>Unavailable</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 border border-gray-200 sticky top-24">
              <div className="mb-6">
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  ${settings.base_nightly_rate}
                  <span className="text-lg font-normal text-gray-600"> / night</span>
                </div>
                <div className="text-sm text-gray-500">
                  Minimum {settings.min_nights} night stay
                </div>
              </div>

              {pricing && (
                <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      ${settings.base_nightly_rate} × {pricing.nights} nights
                    </span>
                    <span className="font-semibold">${pricing.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Cleaning fee</span>
                    <span className="font-semibold">${pricing.cleaningFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Taxes</span>
                    <span className="font-semibold">${pricing.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-3 border-t border-gray-200">
                    <span>Total</span>
                    <span>${pricing.total.toFixed(2)}</span>
                  </div>
                </div>
              )}

              <button
                onClick={() => onNavigate('/book')}
                disabled={!selectedCheckIn || !selectedCheckOut}
                className="w-full py-3 bg-emerald-700 text-white font-semibold rounded-lg hover:bg-emerald-600 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {selectedCheckIn && selectedCheckOut ? 'Reserve Now' : 'Select Dates'}
              </button>

              {selectedCheckIn && selectedCheckOut && (
                <div className="mt-4 text-sm text-gray-600 space-y-1">
                  <div>
                    <span className="font-semibold">Check-in:</span>{' '}
                    {selectedCheckIn.toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                    })}{' '}
                    at {settings.check_in_time}
                  </div>
                  <div>
                    <span className="font-semibold">Check-out:</span>{' '}
                    {selectedCheckOut.toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                    })}{' '}
                    at {settings.check_out_time}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-8 border border-gray-200">
          <h2 className="font-serif text-2xl font-bold text-gray-900 mb-6">What's Included</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {included.map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <Check className="w-5 h-5 text-emerald-700 flex-shrink-0" />
                <span className="text-gray-700">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
