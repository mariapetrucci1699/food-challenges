import Link from "next/link";

export default function Navbar() {
  return (
    <header className="w-full border-b border-white/10 bg-[var(--brand-black)]/95 text-white backdrop-blur-md">
      <div className="mx-auto flex max-w-[1600px] items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          <img
            src="/logo-mutante.png"
            alt="Mutante Food Challenge"
            className="h-10 w-10 rounded-full object-cover"
          />
          <div className="leading-tight">
            <p className="text-sm font-bold tracking-[0.2em] text-orange-400">
              FOOD CHALLENGES
            </p>
          </div>
        </Link>

        <div className="flex items-center gap-4">
          <Link
            href="/challenges"
            className="text-sm font-medium text-white/80 transition hover:text-orange-400"
          >
            Browse
          </Link>

          <Link
            href="/about"
            className="text-sm font-medium text-white/80 transition hover:text-orange-400"
          >
            About
          </Link>

          <Link
            href="/submit"
            className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
          >
            Submit
          </Link>
        </div>
      </div>
    </header>
  );
}