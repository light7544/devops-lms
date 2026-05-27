import Link from "next/link";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-center px-4">
      <div className="h-16 w-16 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-6">
        <span className="text-2xl">404</span>
      </div>
      <h1 className="text-xl font-semibold text-white mb-2">Page not found</h1>
      <p className="text-sm text-zinc-500 mb-8 max-w-sm">
        The lesson or page you're looking for doesn't exist or may have moved.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-800 text-zinc-200 hover:bg-zinc-700 transition-colors text-sm font-medium"
      >
        <Home className="h-4 w-4" />
        Back to Dashboard
      </Link>
    </div>
  );
}
