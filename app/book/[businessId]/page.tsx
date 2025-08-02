import { BookingPageClient } from "./booking-client";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Booking · SchedulePro",
  description: "Book appointments with ease using SchedulePro's booking page. Choose your service, select a date and time, and complete your booking.",
};

// Server component wrapper that handles async params
export default async function PublicBookingPage({ params }: { params: Promise<{ businessId: string }> }) {
  const { businessId } = await params;
  return <BookingPageClient businessId={businessId} />;
}
