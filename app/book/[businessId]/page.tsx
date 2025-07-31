"use client"

import React from "react";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { DateTimePicker } from "@/components/ui/date-time-picker";

const fallbackLogo = "/logo-placeholder.png";
import { notFound } from "next/navigation";
import { useSearchParams } from "next/navigation";
// import { api } from "@/convex/_generated/api"; // Uncomment and adjust as needed
// import { useQuery } from "convex/react";

// Placeholder for business info and slot data fetching
// TODO: Replace with real data fetching logic
const mockBusiness = {
  name: "Business Name",
  logoUrl: "/logo-placeholder.png",
  description: "Welcome to our booking page! Please select a service and time.",
  services: [
    { id: "svc1", name: "Service 1", duration: 30 },
    { id: "svc2", name: "Service 2", duration: 60 },
  ],
};

export default function PublicBookingPage({ params }: { params: { businessId: string } }) {
  // Fetch business info by ID
  const business = useQuery(api.businesses.getBusiness, { businessId: params.businessId });
  const services = useQuery(api.services.getServices, { businessId: params.businessId });
  const loading = business === undefined || services === undefined;
  if (!loading && (!business || !services)) return notFound();
  // In the real implementation, fetch business info by params.businessId
  // const business = useQuery(api.businesses.get, { id: params.businessId });
  // if (!business) return notFound();

  // Placeholder state for slot selection
  const [selectedService, setSelectedService] = React.useState<string | null>(null);

  const [selectedDate, setSelectedDate] = React.useState<Date | null>(null);

  // Fetch staff for this business
  const staff = useQuery(api.staff.getStaff, { businessId: params.businessId });
  const mappedServices = Array.isArray(services) ? services : [];
  const mappedStaff = Array.isArray(staff) ? staff : [];

  // Helper to get staff for a service
  const getStaffForService = (serviceId: string) =>
    mappedStaff.filter((s: any) => s.services && s.services.includes(serviceId));

  // Client info form state
  const [clientName, setClientName] = React.useState("");
  const [clientEmail, setClientEmail] = React.useState("");
  const [clientPhone, setClientPhone] = React.useState("");
  const [bookingStatus, setBookingStatus] = React.useState<null | "loading" | "success">(null);
  const [bookingError, setBookingError] = React.useState<string | null>(null);


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/50">
        <span className="text-xl text-muted-foreground">Loading business info…</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted/50 px-4 py-8">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-lg p-8 flex flex-col gap-6">
        <div className="flex flex-col items-center gap-2">
          <img src={business.logo || fallbackLogo} alt="Business Logo" className="h-16 w-16 rounded-full border" />
          <h1 className="text-2xl font-bold">{business.name}</h1>
          <p className="text-muted-foreground text-center">{business.description || "Welcome to our booking page! Please select a service and time."}</p>
        </div>
        <div className="flex flex-col gap-4">
          <label className="font-medium">Select a Service</label>
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
          <label className="font-medium">Select Date & Time</label>
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
              const clients = await fetch("/api/clients?businessId=" + params.businessId + "&email=" + encodeURIComponent(clientEmail)).then(r => r.json());
              if (clients && clients.length > 0) {
                clientId = clients[0]._id;
              } else {
                // Create client
                const createdClient = await fetch("/api/clients", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    businessId: params.businessId,
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
                  businessId: params.businessId,
                  serviceId: selectedService,
                  clientId,
                  startTime,
                  endTime,
                  status: "scheduled",
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
          <label className="font-medium">Your Name</label>
          <input
            className="border rounded px-3 py-2"
            value={clientName}
            onChange={e => setClientName(e.target.value)}
            required
            disabled={bookingStatus === "loading"}
            placeholder="Full Name"
          />
          <label className="font-medium">Email Address</label>
          <input
            className="border rounded px-3 py-2"
            type="email"
            value={clientEmail}
            onChange={e => setClientEmail(e.target.value)}
            required
            disabled={bookingStatus === "loading"}
            placeholder="you@email.com"
          />
          <label className="font-medium">Phone (optional)</label>
          <input
            className="border rounded px-3 py-2"
            type="tel"
            value={clientPhone}
            onChange={e => setClientPhone(e.target.value)}
            disabled={bookingStatus === "loading"}
            placeholder="Phone number"
          />
          {bookingError && <div className="text-red-500 text-sm">{bookingError}</div>}
          {bookingStatus === "success" && <div className="text-green-600 text-sm">Booking confirmed! Check your email for confirmation.</div>}
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
  );
}
