import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-border/70 bg-card/80">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-6 px-6 py-10 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-semibold tracking-[0.18em] text-primary">
            FOOD CHALLENGES by THE MUTANTE
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Discover food challenges around the world.
          </p>
        </div>

        <nav className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <Link href="/" className="transition hover:text-foreground">
            Home
          </Link>
          <Link href="/challenges" className="transition hover:text-foreground">
            Challenges
          </Link>
          <Link href="/submit" className="transition hover:text-foreground">
            Submit
          </Link>
          <Link href="/about" className="transition hover:text-foreground">
            About me
          </Link>
        </nav>
      </div>
    </footer>
  );
}