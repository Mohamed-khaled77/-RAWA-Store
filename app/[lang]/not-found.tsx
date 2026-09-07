import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center text-center p-4">
      <h2 className="mb-4 text-4xl font-bold">404 - Not Found</h2>
      <p className="mb-6">Could not find requested resource</p>
      <Link href="/" className="rounded bg-black px-4 py-2 text-white">
        Return Home
      </Link>
    </div>
  );
}
