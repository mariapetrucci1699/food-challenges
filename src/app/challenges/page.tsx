import ChallengesPageClient from "@/components/ChallengesPageClient";
import ChallengeFiltersV2 from "@/components/ChallengeFiltersV2";
import { supabase } from "@/lib/supabaseClient";

type CountryOption = { id: string; name: string };

type ChallengeRow = {
  id: string;
  name: string;
  image_url: string | null;
  restaurant_name: string | null;
  time_limit_minutes: number | null;
  status: string;
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

export default async function ChallengesPage({
  searchParams,
}: {
  searchParams:
    | { countryId?: string; cityId?: string; maxTime?: string }
    | Promise<{ countryId?: string; cityId?: string; maxTime?: string }>;
}) {
  const resolvedSearchParams = await Promise.resolve(searchParams);

  const countryId = resolvedSearchParams?.countryId?.trim() || "";
  const cityId = resolvedSearchParams?.cityId?.trim() || "";
  const maxTimeRaw = resolvedSearchParams?.maxTime?.trim() || "";
  const maxTime = maxTimeRaw ? Number(maxTimeRaw) : null;

  const { data: countries, error: countriesError } = await supabase
    .from("countries")
    .select("id, name")
    .order("name", { ascending: true });

  if (countriesError) {
    return (
      <main className="min-h-screen p-8">
        <h1 className="text-3xl font-bold mb-4">Challenges</h1>
        <p className="text-red-600">Error loading countries:</p>
        <pre className="mt-2 text-sm whitespace-pre-wrap">
          {countriesError.message}
        </pre>
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
        <h1 className="text-3xl font-bold mb-4">Challenges</h1>
        <p className="text-red-600">Error loading time options:</p>
        <pre className="mt-2 text-sm whitespace-pre-wrap">
          {timeError.message}
        </pre>
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

  const safeCountries = (countries ?? []) as CountryOption[];

  let cityIdsForCountry: string[] | null = null;

  if (!cityId && countryId) {
    const { data: cityRows, error: cityErr } = await supabase
      .from("cities")
      .select("id")
      .eq("country_id", countryId);

    if (cityErr) {
      return (
        <main className="min-h-screen p-8">
          <h1 className="text-3xl font-bold mb-4">Challenges</h1>
          <p className="text-red-600">Error loading cities for country filter:</p>
          <pre className="mt-2 text-sm whitespace-pre-wrap">
            {cityErr.message}
          </pre>
        </main>
      );
    }

    cityIdsForCountry = (cityRows ?? []).map((r) => r.id);
  }

  let query = supabase
    .from("challenges")
    .select(`
      id,
      name,
      image_url,
      restaurant_name,
      time_limit_minutes,
      status,
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

  if (cityId) {
    query = query.eq("city_id", cityId);
  }

  if (!cityId && countryId) {
    if (!cityIdsForCountry || cityIdsForCountry.length === 0) {
      return (
        <main className="min-h-screen">
          <h1 className="text-4xl font-bold mb-4">🌍 All Food Challenges</h1>
          <ChallengeFiltersV2
            countries={safeCountries}
            maxTimeOptions={maxTimeOptions}
          />
          <p className="text-gray-600 mt-6">No challenges found for this country.</p>
        </main>
      );
    }

    query = query.in("city_id", cityIdsForCountry);
  }

  if (maxTime !== null && !Number.isNaN(maxTime)) {
    query = query.lte("time_limit_minutes", maxTime);
  }

  const { data, error } = await query;

  if (error) {
    return (
      <main className="min-h-screen p-8">
        <h1 className="text-3xl font-bold mb-4">Challenges</h1>
        <p className="text-red-600">Error loading challenges:</p>
        <pre className="mt-2 text-sm whitespace-pre-wrap">{error.message}</pre>
      </main>
    );
  }

  const challenges = (data ?? []) as ChallengeRow[];

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

  const selectedCountryName = countryId
    ? safeCountries.find((c) => c.id === countryId)?.name ?? null
    : null;

  return (
    <main className="min-h-screen px-6 py-8">
      <div className="mx-auto max-w-[1600px]">
        <h1 className="text-4xl font-bold mb-4">🌍 All Food Challenges</h1>

        <ChallengesPageClient
          countries={safeCountries}
          maxTimeOptions={maxTimeOptions}
          challenges={challenges}
          points={points}
          selectedCountryName={selectedCountryName}
          cityId={cityId}
          maxTime={maxTime}
        />
      </div>
    </main>
  );
}