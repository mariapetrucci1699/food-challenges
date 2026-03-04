import Image from "next/image";

import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-4xl font-bold mb-6">
        🌍 Food Challenges Around the World
      </h1>

      <div className="space-y-4">
        <Link
          href="/challenges"
          className="block text-blue-600 underline"
        >
          Browse all challenges →
        </Link>

        <Link
          href="/submit"
          className="block text-blue-600 underline"
        >
          Submit a new challenge →
        </Link>
      </div>
    </main>
  );
}