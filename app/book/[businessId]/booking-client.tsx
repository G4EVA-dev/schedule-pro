"use client"

import React, { useState, useEffect } from "react";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import { notFound, useRouter } from "next/navigation";

const fallbackLogo = "/logo-placeholder.png";

// Client component that handles the booking logic
export function BookingPageClient({ businessId }: { businessId: string }) {
  // Fetch business info by ID
  const business = useQuery(api.businesses.getBusiness, { businessId });
  const services = useQuery(api.services.getServices, { businessId });
  const staff = useQuery(api.staff.getStaff, { businessId });
  
  // State for form inputs - ALL HOOKS MUST BE DECLARED BEFORE ANY CONDITIONAL LOGIC
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [bookingStatus, setBookingStatus] = useState<"loading" | "success" | null>(null);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  
  // Notes state for optional notes input
  const [notes, setNotes] = useState("");

  // Success Modal state and feedback form
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [feedbackStatus, setFeedbackStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  // Show modal when bookingStatus transitions to success
  useEffect(() => {
    if (bookingStatus === "success") {
      setShowSuccessModal(true);
    }
  }, [bookingStatus]);

  // NOW we can do conditional logic after all hooks are declared
  const loading = business === undefined || services === undefined;
  if (!loading && (!business || !services)) return notFound();

  const mappedServices = Array.isArray(services) ? services : [];
  const mappedStaff = Array.isArray(staff) ? staff : [];

  // Helper to get staff for a service
  const getStaffForService = (serviceId: string) =>
    mappedStaff.filter((s: any) => s.services && s.services.includes(serviceId));

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/50">
        <span className="text-xl text-muted-foreground">Loading business info…</span>
      </div>
    );
  }

  const router = useRouter();
  const closeSuccessModal = () => {
    setShowSuccessModal(false);
    setBookingStatus(null);
    setFeedback("");
    setFeedbackStatus('idle');
    setTimeout(() => {
      router.push("/");
    }, 200); // slight delay for UI smoothness
  };


  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.trim()) return closeSuccessModal();
    setFeedbackStatus('submitting');
    try {
      // Replace with real feedback API call
      await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessId, feedback }),
      });
      setFeedbackStatus('success');
      setTimeout(() => closeSuccessModal(), 1800);
    } catch {
      setFeedbackStatus('error');
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      {/* Branding Sidebar */}
      <div className="hidden lg:flex lg:w-[35%] bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 relative overflow-hidden flex-col justify-between p-12 text-white">
        {/* Business Branding */}
        <div className="flex flex-col items-center gap-4 w-full">
          <img src={business.logo || fallbackLogo} alt="Business Logo" className="h-20 w-20 rounded-2xl border shadow-lg bg-white mb-4" />
          <h1 className="text-3xl font-bold mb-2">{business.name}</h1>
          <p className="text-blue-100 text-center mb-8">{business.description || "Welcome to our booking page! Please select a service and time."}</p>
        </div>
        
        {/* SchedulePro Branding */}
        <div className="flex flex-col items-center gap-4 w-full border-t border-blue-500/30 pt-8">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <span className="text-blue-600 font-bold text-sm">SP</span>
            </div>
            <span className="text-xl font-bold">SchedulePro</span>
          </div>
          <p className="text-blue-100 text-center text-sm mb-4">Streamline your business with professional scheduling</p>
          
          {/* Key Features */}
          <div className="space-y-2 text-center">
            <div className="flex items-center gap-2 text-blue-100 text-sm">
              <div className="w-1.5 h-1.5 bg-blue-300 rounded-full"></div>
              <span>Online booking & payments</span>
            </div>
            <div className="flex items-center gap-2 text-blue-100 text-sm">
              <div className="w-1.5 h-1.5 bg-blue-300 rounded-full"></div>
              <span>Automated reminders</span>
            </div>
            <div className="flex items-center gap-2 text-blue-100 text-sm">
              <div className="w-1.5 h-1.5 bg-blue-300 rounded-full"></div>
              <span>Customer management</span>
            </div>
          </div>
          
          {/* Subtle CTA */}
          <p className="text-blue-200 text-xs text-center mt-4 opacity-80">
            Want to create your own booking page?
            <br />
            <span className="text-white font-medium">Join thousands of businesses on SchedulePro</span>
          </p>
        </div>
      </div>
      {/* Main Booking Form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-xl shadow-lg p-8 flex flex-col gap-6">

        <div className="flex flex-col gap-4">
          <label className="font-medium text-gray-900 dark:text-gray-100">Select a Service</label>
          <select
            className="border rounded px-3 py-2"
            value={selectedService || ""}
            onChange={e => setSelectedService(e.target.value || null)}
          >
            <option value="" disabled>Select...</option>
            {mappedServices.length === 0 ? (
              <option disabled>No services available</option>
            ) : (
              mappedServices.map((svc: any) => (
                <option key={svc._id} value={svc._id}>
                  {svc.name} ({svc.duration} min)
                </option>
              ))
            )}
          </select>
        </div>

        <div className="flex flex-col gap-4">
          <label className="font-medium text-gray-900 dark:text-gray-100">Select Date & Time</label>
          <DateTimePicker
            date={selectedDate ?? undefined}
            onDateChange={date => setSelectedDate(date ?? null)}
            label={undefined}
            placeholder="Pick a date and time"
          />
        </div>
        {/* Client Info Form */}
        <form
          className="flex flex-col gap-4"
          onSubmit={async e => {
            e.preventDefault();
            if (!selectedService || !selectedDate) return;
            // Find staff for the selected service
            const availableStaff = getStaffForService(selectedService);
            if (!availableStaff || availableStaff.length === 0) {
              setBookingError("No staff available for the selected service. Please contact the business.");
              return;
            }
            const staffId = availableStaff[0]._id;
            if (!clientName || !clientEmail) {
              setBookingError("Name and email are required");
              return;
            }
            setBookingError(null);
            setBookingStatus("loading");
            try {
              // 1. Find or create client
              let clientId = null;
              const clients = await fetch("/api/clients?businessId=" + businessId + "&email=" + encodeURIComponent(clientEmail)).then(r => r.json());
              if (clients && clients.length > 0) {
                clientId = clients[0]._id;
              } else {
                // Create client
                const createdClient = await fetch("/api/clients", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    businessId,
                    name: clientName,
                    email: clientEmail,
                    phone: clientPhone,
                  }),
                }).then(r => r.json());
                clientId = createdClient._id;
              }
              // 2. Create appointment
              const serviceObj = mappedServices.find((svc: any) => svc._id === selectedService);
              const duration = serviceObj?.duration || 30;
              const startTime = selectedDate.getTime();
              const endTime = startTime + duration * 60 * 1000;
              const appt = await fetch("/api/appointments", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  businessId,
                  serviceId: selectedService,
                  staffId,
                  clientId,
                  startTime,
                  endTime,
                  status: "scheduled",
                  notes: notes || "", // Always send notes, even if empty
                }),
              }).then(r => r.json());
              setBookingStatus("success");
              setBookingError(null);
            } catch (err: any) {
              setBookingStatus(null);
              setBookingError("Booking failed. Please try again.");
            }
          }}
        >
          <label className="font-medium text-gray-900 dark:text-gray-100">Your Name</label>
          <input
            className="border rounded px-3 py-2"
            value={clientName}
            onChange={e => setClientName(e.target.value)}
            required
            disabled={bookingStatus === "loading"}
            placeholder="Full Name"
          />
          <label className="font-medium text-gray-900 dark:text-gray-100">Email Address</label>
          <input
            className="border rounded px-3 py-2"
            type="email"
            value={clientEmail}
            onChange={e => setClientEmail(e.target.value)}
            required
            disabled={bookingStatus === "loading"}
            placeholder="you@email.com"
          />
          <label className="font-medium text-gray-900 dark:text-gray-100">Phone (optional)</label>
          <input
            className="border rounded px-3 py-2"
            type="tel"
            value={clientPhone}
            onChange={e => setClientPhone(e.target.value)}
            disabled={bookingStatus === "loading"}
            placeholder="Phone number"
          />
          <label className="font-medium text-gray-900 dark:text-gray-100">Notes (optional)</label>
          <textarea
            className="border rounded px-3 py-2 min-h-[56px] resize-y"
            value={notes}
            onChange={e => setNotes(e.target.value)}
            disabled={bookingStatus === "loading"}
            placeholder="Anything you'd like us to know?"
          />
          {bookingError && <div className="text-red-500 text-sm">{bookingError}</div>}
          {/* Success Modal */}
          {showSuccessModal && (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm">
              <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl p-8 max-w-md w-full flex flex-col items-center gap-4 animate-fade-in">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500 mb-2"><circle cx="12" cy="12" r="10"/><path d="M9 12l2 2 4-4"/></svg>
                <h2 className="text-2xl font-bold mb-2 text-center">Booking Confirmed!</h2>
                <p className="text-muted-foreground text-center mb-4">Thank you for booking with {business.name}. We've sent a confirmation to your email.</p>
                {/* Feedback Form */}
                <form className="w-full flex flex-col gap-2" onSubmit={handleFeedbackSubmit}>
                  <label className="font-medium">Feedback (optional)</label>
                  <textarea
                    className="border rounded px-3 py-2 min-h-[56px] resize-y dark:bg-slate-800"
                    value={feedback}
                    onChange={e => setFeedback(e.target.value)}
                    placeholder="How was your booking experience?"
                  />
                  <button
                    type="submit"
                    className="bg-primary text-white rounded px-4 py-2 font-medium hover:bg-primary/90 transition mt-2"
                    disabled={feedbackStatus === 'submitting'}
                  >
                    {feedbackStatus === 'submitting' ? 'Submitting...' : 'Submit Feedback'}
                  </button>
                  {feedbackStatus === 'success' && <div className="text-green-600 text-sm">Thank you for your feedback!</div>}
                  {feedbackStatus === 'error' && <div className="text-red-500 text-sm">Failed to submit feedback. Please try again.</div>}
                </form>
                <button
                  className="mt-4 text-blue-600 dark:text-blue-300 underline"
                  onClick={closeSuccessModal}
                  type="button"
                >Close</button>
              </div>
            </div>
          )}
          <button
            type="submit"
            className="mt-4 bg-primary text-white rounded px-4 py-2 font-medium hover:bg-primary/90 transition"
            disabled={!selectedService || !selectedDate || !clientName || !clientEmail || bookingStatus === "loading"}
          >
            {bookingStatus === "loading" ? "Booking..." : "Book Appointment"}
          </button>
        </form>
        </div>
      </div>
    </div>
  );
}
