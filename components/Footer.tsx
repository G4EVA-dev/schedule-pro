import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full border-t bg-background py-4 text-center text-xs text-muted-foreground mt-8">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-2 px-4">
        <span>
          © {new Date().getFullYear()} SchedulePro. All rights reserved.
        </span>
        <span className="flex gap-4 items-center">
          <Link href="/roadmap" className="hover:underline font-medium">
            Roadmap & Upcoming Features
          </Link>
          <Link href="/pricing" className="hover:underline">Pricing</Link>
          <Link href="/help" className="hover:underline">Help & Support</Link>
        </span>
        <span className="flex items-center gap-2 text-[11px]">
          Built with
          <a href="https://convex.dev" target="_blank" rel="noopener" className="hover:underline font-semibold text-primary">Convex</a>
          &
          <a href="https://resend.com" target="_blank" rel="noopener" className="hover:underline font-semibold text-primary">Resend</a>
        </span>
      </div>
    </footer>
  );
}
