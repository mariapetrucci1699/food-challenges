import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  return (
    <header className="border-b bg-background/80 backdrop-blur">
      <nav className="mx-auto max-w-5xl px-6 py-4 flex items-center justify-between">
        <Link href="/" className="font-bold text-lg tracking-tight">
          🌍 FoodChallenges
        </Link>

        <div className="flex items-center gap-2">
          <Button asChild variant="ghost">
            <Link href="/challenges">Browse</Link>
          </Button>
          <Button asChild>
            <Link href="/submit">Submit</Link>
          </Button>
        </div>
      </nav>
    </header>
  );
}