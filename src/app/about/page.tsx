import Image from "next/image";
import {
  Flame,
  Globe,
  Trophy,
  UtensilsCrossed,
  Instagram,
  Youtube,
} from "lucide-react";


export default function AboutPage() {
  return (
    <main className="min-h-screen px-6 py-12">
      <div className="mx-auto max-w-6xl">

        <div className="rounded-[32px] border border-border/70 bg-card/95 p-8 shadow-sm md:p-10">

          {/* PROFILE SECTION */}
          <div className="grid gap-10 lg:grid-cols-[360px_1fr]">

            {/* LEFT SIDE — PHOTO */}
            <div className="md:sticky md:top-24 self-start">
                <div className="overflow-hidden rounded-[32px] border border-border/70 bg-card/95 shadow-xl">
                    <div className="relative">
                    <Image
                        src="/the-mutante1.jpg"
                        alt="The_mutante"
                        width={320}
                        height={380}
                        className="h-auto w-full object-cover"
                    />

                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent p-5">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-300">
                        Creator
                        </p>
                        <h2 className="mt-1 text-2xl font-bold text-white">
                        The Mutante
                        </h2>
                    </div>
                    </div>

                    <div className="space-y-5 p-6">
                    <div>
                        <p className="text-sm font-medium text-foreground">
                        Food challenge creator from Portugal
                        </p>
                    </div>

                    <div className="h-px bg-border" />

                    <div>
                        <p className="mb-3 text-sm font-semibold text-foreground">
                        Follow the madness
                        </p>

                        <div className="flex items-center gap-3">
                        <a
                            href="https://www.instagram.com/the_mutante"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex h-11 w-11 items-center justify-center rounded-2xl border bg-background transition hover:bg-primary/10"
                        >
                            <Instagram className="h-5 w-5 text-pink-500" />
                        </a>

                        <a
                            href="https://www.tiktok.com/@the_mutante"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex h-11 w-11 items-center justify-center rounded-2xl border bg-background transition hover:bg-primary/10"
                        >
                            <svg
                            viewBox="0 0 24 24"
                            className="h-5 w-5"
                            fill="currentColor"
                            >
                            <path d="M16.5 3a5.5 5.5 0 0 0 4 1.7v3a8.5 8.5 0 0 1-4-1.1v7.4a5.5 5.5 0 1 1-5.5-5.5c.3 0 .7 0 1 .1v3a2.5 2.5 0 1 0 1.5 2.4V3h3z" />
                            </svg>
                        </a>

                        <a
                            href="https://www.youtube.com/@the_mutante"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex h-11 w-11 items-center justify-center rounded-2xl border bg-background transition hover:bg-primary/10"
                        >
                            <Youtube className="h-5 w-5 text-red-500" />
                        </a>
                        </div>
                    </div>

                    <div className="rounded-2xl bg-muted/60 px-4 py-3">
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Motto
                        </p>
                        <p className="mt-1 text-sm font-medium text-foreground">
                        Welcome to the madness. Let’s eat. 🚀
                        </p>
                    </div>
                    </div>
                </div>
                </div>

            {/* RIGHT SIDE — TEXT */}
            <div>

                <div className="rounded-[32px] border border-border/70 bg-card/95 p-8 shadow-sm md:p-10">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
                    About me
                </p>

                <p className="mt-5 text-xl leading-8 text-muted-foreground">
                    Hey! I’m <span className="font-semibold text-foreground">The Mutante</span>,
                    a content creator from Portugal obsessed with food challenges 🍔🏆
                </p>

                <div className="mt-8 grid gap-4 md:grid-cols-2">
                    <div className="rounded-3xl border bg-background/70 p-5">
                    <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                        Mission
                    </p>
                    <p className="mt-2 text-sm leading-7 text-muted-foreground">
                        Travel across Portugal — and the world 🌍 — taking on the
                        craziest eating challenges I can find
                    </p>
                    </div>

                    <div className="rounded-3xl border bg-background/70 p-5">
                    <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                        Focus
                    </p>
                    <p className="mt-2 text-sm leading-7 text-muted-foreground">
                        Official restaurant food challenges whenever possible, plus some wild
                        custom ideas of my own just to see what happens 😈
                    </p>
                    </div>
                </div>

                <div className="mt-8 space-y-6 text-lg leading-8 text-muted-foreground">
                    <p>
                    Through my content, I want to introduce more people to the amazing world
                    of food challenges — where competitive eaters push their limits, chase
                    glory, and fight for a place in the global rankings 🥇
                    </p>

                    <p>
                    This project is about more than giant portions. It’s about entertainment,
                    competition, travel, and the thrill of asking:
                    </p>
                </div>

                <div className="mt-8 rounded-[28px] border bg-background/80 p-6">
                    <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                    The question behind every challenge
                    </p>
                    <p className="mt-3 text-2xl font-semibold leading-relaxed text-foreground">
                    “Can this challenge actually be beaten?” 🤔
                    </p>
                </div>

                <div className="mt-10 grid gap-4 md:grid-cols-4">
                    <div className="rounded-3xl border bg-background/70 p-5">
                    <Flame className="h-5 w-5 text-primary" />
                    <h2 className="mt-3 font-semibold">Big energy</h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Huge meals, crazy bites and chaotic challenge moments.
                    </p>
                    </div>

                    <div className="rounded-3xl border bg-background/70 p-5">
                    <Globe className="h-5 w-5 text-primary" />
                    <h2 className="mt-3 font-semibold">Travel</h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Exploring Portugal and the world through food challenges.
                    </p>
                    </div>

                    <div className="rounded-3xl border bg-background/70 p-5">
                    <Trophy className="h-5 w-5 text-primary" />
                    <h2 className="mt-3 font-semibold">Competition</h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Chasing victory and global challenge rankings.
                    </p>
                    </div>

                    <div className="rounded-3xl border bg-background/70 p-5">
                    <UtensilsCrossed className="h-5 w-5 text-primary" />
                    <h2 className="mt-3 font-semibold">Food madness</h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Burgers, pizza, spice and giant portions.
                    </p>
                    </div>
                </div>

                <div className="mt-10 rounded-3xl border bg-background/70 p-6">
                    <p className="text-lg font-semibold text-foreground">
                    What you can expect here:
                    </p>

                    <div className="mt-4 grid gap-3 text-muted-foreground sm:grid-cols-2">
                    <p>🍽️ Big plates</p>
                    <p>🍔 Bigger bites</p>
                    <p>😂 Fun moments</p>
                    <p>🥇 Competitive spirit</p>
                    </div>
                </div>

                <p className="mt-8 text-xl font-semibold text-foreground">
                    Welcome to the madness. Let’s eat. 🚀
                </p>
                </div>

            </div>
          </div>
        </div>
      </div>
    </main>
  );
}