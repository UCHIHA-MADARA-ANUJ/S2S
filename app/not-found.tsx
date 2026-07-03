import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="font-display font-black text-9xl text-primary">404</h1>
        <p className="text-text-secondary text-xl mt-4 mb-8">This page doesn't exist.</p>
        <Link href="/" className="btn-primary text-sm">Go Home</Link>
      </div>
    </div>
  );
}
