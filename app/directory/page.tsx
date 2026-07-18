import Link from 'next/link';

export default function Directory() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">Public Directory</h1>
      <Link href="/" className="text-healing-teal mt-4 inline-block">Back to Home</Link>
    </div>
  );
}
