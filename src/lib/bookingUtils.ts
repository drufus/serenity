import { supabase, type SeasonalRate, type BlockedDate, type PropertySettings } from './supabase';

export const generateConfirmationCode = (): string => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

export const getDaysBetween = (startDate: Date, endDate: Date): number => {
  const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export const parseDate = (dateStr: string): Date => {
  return new Date(dateStr + 'T00:00:00');
};

export const isDateBlocked = async (date: string): Promise<boolean> => {
  const { data, error } = await supabase
    .from('blocked_dates')
    .select('id')
    .eq('date', date)
    .maybeSingle();

  if (error) {
    console.error('Error checking blocked date:', error);
    return false;
  }

  return data !== null;
};

export const getBlockedDatesInRange = async (startDate: string, endDate: string): Promise<string[]> => {
  const { data, error } = await supabase
    .from('blocked_dates')
    .select('date')
    .gte('date', startDate)
    .lte('date', endDate);

  if (error) {
    console.error('Error fetching blocked dates:', error);
    return [];
  }

  return data?.map(d => d.date) || [];
};

export const checkAvailability = async (checkIn: string, checkOut: string): Promise<boolean> => {
  const blockedDates = await getBlockedDatesInRange(checkIn, checkOut);

  const checkInDate = parseDate(checkIn);
  const checkOutDate = parseDate(checkOut);
  const nights = getDaysBetween(checkInDate, checkOutDate);

  for (let i = 0; i < nights; i++) {
    const currentDate = new Date(checkInDate);
    currentDate.setDate(currentDate.getDate() + i);
    const dateStr = formatDate(currentDate);

    if (blockedDates.includes(dateStr)) {
      return false;
    }
  }

  return true;
};

export const getNightlyRate = async (date: string, settings: PropertySettings): Promise<number> => {
  const { data, error } = await supabase
    .from('seasonal_rates')
    .select('*')
    .eq('active', true)
    .lte('start_date', date)
    .gte('end_date', date)
    .maybeSingle();

  if (error) {
    console.error('Error fetching seasonal rate:', error);
    return settings.base_nightly_rate;
  }

  return data?.nightly_rate || settings.base_nightly_rate;
};

export const calculateBookingPrice = async (
  checkIn: string,
  checkOut: string,
  settings: PropertySettings,
  addonTotal: number = 0,
  discountAmount: number = 0
): Promise<{
  numNights: number;
  subtotal: number;
  cleaningFee: number;
  addonTotal: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
}> => {
  const checkInDate = parseDate(checkIn);
  const checkOutDate = parseDate(checkOut);
  const numNights = getDaysBetween(checkInDate, checkOutDate);

  let subtotal = 0;
  for (let i = 0; i < numNights; i++) {
    const currentDate = new Date(checkInDate);
    currentDate.setDate(currentDate.getDate() + i);
    const dateStr = formatDate(currentDate);
    const rate = await getNightlyRate(dateStr, settings);
    subtotal += rate;
  }

  const cleaningFee = settings.cleaning_fee;
  const beforeTax = subtotal + cleaningFee + addonTotal - discountAmount;
  const taxAmount = beforeTax * settings.tax_rate;
  const totalAmount = beforeTax + taxAmount;

  return {
    numNights,
    subtotal,
    cleaningFee,
    addonTotal,
    taxAmount,
    discountAmount,
    totalAmount,
  };
};

export const createBooking = async (bookingData: {
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  checkIn: string;
  checkOut: string;
  numGuests: number;
  specialRequests?: string;
  pricing: {
    numNights: number;
    subtotal: number;
    cleaningFee: number;
    taxAmount: number;
    discountAmount: number;
    totalAmount: number;
  };
  addons?: { addon_id: string; quantity: number; price: number }[];
}): Promise<{ booking: any; error: any }> => {
  const confirmationCode = generateConfirmationCode();

  const { data: booking, error: bookingError } = await supabase
    .from('bookings')
    .insert({
      confirmation_code: confirmationCode,
      guest_name: bookingData.guestName,
      guest_email: bookingData.guestEmail,
      guest_phone: bookingData.guestPhone,
      check_in: bookingData.checkIn,
      check_out: bookingData.checkOut,
      num_guests: bookingData.numGuests,
      num_nights: bookingData.pricing.numNights,
      subtotal: bookingData.pricing.subtotal,
      cleaning_fee: bookingData.pricing.cleaningFee,
      tax_amount: bookingData.pricing.taxAmount,
      discount_amount: bookingData.pricing.discountAmount,
      total_amount: bookingData.pricing.totalAmount,
      special_requests: bookingData.specialRequests || null,
      status: 'pending',
    })
    .select()
    .single();

  if (bookingError) {
    return { booking: null, error: bookingError };
  }

  if (bookingData.addons && bookingData.addons.length > 0) {
    const addonInserts = bookingData.addons.map(addon => ({
      booking_id: booking.id,
      addon_id: addon.addon_id,
      quantity: addon.quantity,
      price: addon.price,
    }));

    await supabase.from('booking_addons').insert(addonInserts);
  }

  const checkInDate = parseDate(bookingData.checkIn);
  const checkOutDate = parseDate(bookingData.checkOut);
  const nights = getDaysBetween(checkInDate, checkOutDate);

  const datesToBlock = [];
  for (let i = 0; i < nights; i++) {
    const currentDate = new Date(checkInDate);
    currentDate.setDate(currentDate.getDate() + i);
    datesToBlock.push({
      date: formatDate(currentDate),
      reason: 'booked',
      booking_id: booking.id,
    });
  }

  await supabase.from('blocked_dates').insert(datesToBlock);

  return { booking, error: null };
};
