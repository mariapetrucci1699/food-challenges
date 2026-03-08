import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import HomeSearchBar from "@/components/HomeSearchBar";
import ChallengesMapWrapper from "@/components/ChallengesMapWrapper";

type CountryOption = { id: string; name: string };

type ChallengeRow = {
  id: string;
  name: string;
  image_url: string | null;
  restaurant_name: string | null;
  city: null | {
    id: string;
    name: string;
    latitude: number | null;
    longitude: number | null;
    country: null | {
      id: string;
      name: string;
    };
  };
};

type MapPoint = {
  id: string;
  name: string;
  imageUrl: string | null;
  restaurantName: string | null;
  cityName: string;
  countryName: string | null;
  lat: number;
  lng: number;
};

export default async function Home() {
  const { data: countries, error: countriesError } = await supabase
    .from("countries")
    .select("id, name")
    .order("name", { ascending: true });

  if (countriesError) {
    return (
      <main className="min-h-screen p-8">
        <p className="text-red-600">
          Error loading countries: {countriesError.message}
        </p>
      </main>
    );
  }

  const { data: timeRows, error: timeError } = await supabase
    .from("challenges")
    .select("time_limit_minutes")
    .eq("status", "approved")
    .not("time_limit_minutes", "is", null);

  if (timeError) {
    return (
      <main className="min-h-screen p-8">
        <p className="text-red-600">
          Error loading time options: {timeError.message}
        </p>
      </main>
    );
  }

  const maxTimeOptions = Array.from(
    new Set(
      (timeRows ?? [])
        .map((r) => r.time_limit_minutes)
        .filter((n): n is number => typeof n === "number")
    )
  ).sort((a, b) => a - b);

  const { data: challengesData, error: challengesError } = await supabase
    .from("challenges")
    .select(`
      id,
      name,
      image_url,
      restaurant_name,
      city:cities!challenges_city_id_fkey (
        id,
        name,
        latitude,
        longitude,
        country:countries!cities_country_id_fkey (
          id,
          name
        )
      )
    `)
    .eq("status", "approved")
    .order("created_at", { ascending: false });

  if (challengesError) {
    return (
      <main className="min-h-screen p-8">
        <p className="text-red-600">
          Error loading challenges: {challengesError.message}
        </p>
      </main>
    );
  }

  const safeCountries = (countries ?? []) as CountryOption[];
  const challenges = (challengesData ?? []) as ChallengeRow[];

  const points = challenges
    .map((ch) => {
      const lat = ch.city?.latitude;
      const lng = ch.city?.longitude;

      if (typeof lat !== "number" || typeof lng !== "number") return null;

      return {
        id: ch.id,
        name: ch.name,
        imageUrl: ch.image_url,
        restaurantName: ch.restaurant_name,
        cityName: ch.city?.name ?? "Unknown city",
        countryName: ch.city?.country?.name ?? null,
        lat,
        lng,
      };
    })
    .filter(Boolean) as MapPoint[];

  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      {/* Background image */}
      <div
        className="absolute inset-0 -z-30 bg-cover bg-center"
        style={{ backgroundImage: "url('/landing-bg.jpeg')" }}
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 -z-20 bg-black/70" />

      {/* Warm gradient glow */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-orange-500/10 via-black/20 to-black/70" />

      <section className="px-6 pt-10 pb-20">
        <div className="mx-auto max-w-[1600px]">
          {/* Hero copy */}
          <div className="mx-auto max-w-3xl text-center">

            <h1 className="text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
              Find the most insane food challenges on the planet
            </h1>

            <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-orange-400">
              Discover massive burgers, spicy wings, monster pizzas and iconic eating challenges across the world
            </p>
          </div>

          {/* Search bar */}
          <div className="mt-8">
            <HomeSearchBar
              countries={safeCountries}
              maxTimeOptions={maxTimeOptions}
            />
          </div>

          {/* Floating map */}
          <div className="mt-8 rounded-[32px] border border-white/10 bg-white/8 p-3 shadow-2xl backdrop-blur-md">
            <ChallengesMapWrapper points={points} hoveredId={null} />
          </div>

          {/* CTAs */}
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/challenges"
              className="rounded-2xl bg-orange-500 px-6 py-3 text-sm font-semibold text-black transition hover:bg-orange-400"
            >
              Browse all challenges
            </Link>

            <Link
              href="/submit"
              className="rounded-2xl border border-white/15 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
            >
              Submit a challenge
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}