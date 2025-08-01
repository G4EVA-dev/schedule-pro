import { BookingPageClient } from "./booking-client";

// Server component wrapper that handles async params
export default async function PublicBookingPage({ params }: { params: Promise<{ businessId: string }> }) {
  const { businessId } = await params;
  return <BookingPageClient businessId={businessId} />;
}
