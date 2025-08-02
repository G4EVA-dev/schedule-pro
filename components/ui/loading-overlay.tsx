"use client";
import { Loader2 } from "lucide-react";

export default function LoadingOverlay({ text = "Loading..." }: { text?: string }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm">
      <Loader2 className="animate-spin h-12 w-12 text-primary mb-4" />
      <span className="text-white text-lg font-medium drop-shadow-lg">{text}</span>
    </div>
  );
}
