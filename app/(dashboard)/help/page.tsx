"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, Mail, Info } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/hooks/use-auth";

const FAQ = [
  {
    q: "How do I book an appointment?",
    a: "Go to the Calendar page, click 'New Appointment', and follow the steps.",
  },
  {
    q: "How do I update my business info?",
    a: "Navigate to Settings > Business tab to edit your business details.",
  },
  {
    q: "How do I contact support?",
    a: "Use the feedback form below or email support@schedulepro.com.",
  },
];

export default function HelpPage() {
  const { user } = useAuth();
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const submitFeedback = useMutation(api.feedback.submitFeedback);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      await submitFeedback({
        subject,
        message,
        email: email || undefined,
        userId: user?.id || undefined,
      });
      
      setSuccess(true);
      setSubject("");
      setMessage("");
      setEmail("");
    } catch (err) {
      setError("Failed to submit feedback. Please try again.");
      console.error("Feedback submission error:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2"><Info className="h-6 w-6 text-primary" /> Help & Support</h1>
      <section className="mb-10">
        <h2 className="text-lg font-semibold mb-4">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {FAQ.map((item, i) => (
            <Card key={i}>
              <CardContent className="py-3 px-4">
                <div className="font-medium">Q: {item.q}</div>
                <div className="text-muted-foreground mt-1">A: {item.a}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
      <section>
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><Mail className="h-5 w-5 text-primary" /> Send Feedback or Contact Support</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input
            placeholder="Your email (optional)"
            value={email}
            onChange={e => setEmail(e.target.value)}
            type="email"
            autoComplete="email"
          />
          <Input
            placeholder="Subject"
            value={subject}
            onChange={e => setSubject(e.target.value)}
            required
          />
          <Textarea
            placeholder="How can we help you?"
            value={message}
            onChange={e => setMessage(e.target.value)}
            rows={4}
            required
          />
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? <Loader2 className="animate-spin h-5 w-5" /> : "Send"}
          </Button>
          {success && <div className="text-green-600 text-sm mt-2">Thank you for your feedback! We'll get back to you soon.</div>}
          {error && <div className="text-red-600 text-sm mt-2">{error}</div>}
        </form>
      </section>
    </div>
  );
}
