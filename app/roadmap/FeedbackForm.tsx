"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

export function FeedbackForm() {
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
    setSuccess(false);
    try {
      await submitFeedback({
        subject,
        message,
        email: email || undefined,
      });
      setSuccess(true);
      setSubject("");
      setMessage("");
      setEmail("");
    } catch (err) {
      setError("Could not submit feedback. Please try again later.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        placeholder="Your email (optional)"
        value={email}
        onChange={e => setEmail(e.target.value)}
        type="email"
        autoComplete="email"
        className="bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700"
      />
      <Input
        placeholder="Subject (e.g. Feature Request, Suggestion, Bug)"
        value={subject}
        onChange={e => setSubject(e.target.value)}
        required
        className="bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700"
      />
      <Textarea
        placeholder="Your feedback or suggestion..."
        value={message}
        onChange={e => setMessage(e.target.value)}
        rows={4}
        required
        className="bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700"
      />
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Sending..." : "Send Feedback"}
      </Button>
      {success && <div className="text-green-600 text-sm text-center">Thank you for your feedback!</div>}
      {error && <div className="text-red-600 text-sm text-center">{error}</div>}
    </form>
  );
}
