"use client";
import Link from "next/link";
import { useEffect } from "react";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h1 className="font-display font-black text-5xl text-error mb-4">Error</h1>
        <p className="text-text-secondary mb-6">{error.message || "Something went wrong."}</p>
        <div className="flex gap-3 justify-center">
          <button onClick={reset} className="btn-primary text-sm">Try again</button>
          <Link href="/" className="btn-secondary text-sm">Go Home</Link>
        </div>
      </div>
    </div>
  );
}
