import ChallengeCard from "@/components/ChallengeCard";
import ChallengeFiltersV2 from "@/components/ChallengeFiltersV2";
import { supabase } from "@/lib/supabaseClient";

type CountryOption = { id: string; name: string };

type ChallengeRow = {
  id: string;
  name: string;
  time_limit_minutes: number | null;
  status: string;
  city: null | {
    id: string;
    name: string;
    country: null | {
      id: string;
      name: string;
    };
  };
};

export default async function ChallengesPage({
  searchParams,
}: {
  searchParams?: { countryId?: string; cityId?: string; maxTime?: string };
}) {
  // --- 1) Load countries for the dropdown ---
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

  const countryId = searchParams?.countryId?.trim() || "";
  const cityId = searchParams?.cityId?.trim() || "";
  const maxTimeRaw = searchParams?.maxTime?.trim() || "";
  const maxTime = maxTimeRaw ? Number(maxTimeRaw) : null;

  // --- 2) Query challenges with joins (city + country) ---
  let query = supabase
    .from("challenges")
    .select(
      `
        id,
        name,
        time_limit_minutes,
        status,
        city:cities (
          id,
          name,
          country:countries (
            id,
            name
          )
        )
      `
    )
    .eq("status", "approved")
    .order("created_at", { ascending: false });

  // Filter by city_id (best, most precise)
  if (cityId) {
    query = query.eq("city_id", cityId);
  }

  // Filter by country via joined city (works with the embedded join)
  if (countryId) {
    query = query.eq("city.country_id", countryId);
  }

  // Filter by max time
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
  const safeCountries = (countries ?? []) as CountryOption[];

  const selectedCountryName = countryId
    ? safeCountries.find((c) => c.id === countryId)?.name ?? null
    : null;

  return (
    <main className="min-h-screen">
      <div className="flex items-end justify-between gap-4 mb-4">
        <div>
          <h1 className="text-4xl font-bold">🌍 All Food Challenges</h1>
          <p className="text-muted-foreground mt-1">
            Find challenges by location and time limit.
          </p>
        </div>
      </div>

      <ChallengeFiltersV2 countries={safeCountries} />

      <p className="text-sm text-muted-foreground mb-6">
        {selectedCountryName ? (
          <span className="mr-3">
            <strong className="text-foreground">Country:</strong>{" "}
            {selectedCountryName}
          </span>
        ) : (
          <span className="mr-3">
            <strong className="text-foreground">Country:</strong> Any
          </span>
        )}

        {cityId ? (
          <span className="mr-3">
            <strong className="text-foreground">City:</strong> Selected
          </span>
        ) : (
          <span className="mr-3">
            <strong className="text-foreground">City:</strong> Any
          </span>
        )}

        {maxTime !== null && !Number.isNaN(maxTime) ? (
          <span>
            <strong className="text-foreground">Max time:</strong> {maxTime} min
          </span>
        ) : (
          <span>
            <strong className="text-foreground">Max time:</strong> Any
          </span>
        )}
      </p>

      {challenges.length === 0 ? (
        <div className="rounded-xl border bg-background p-6">
          <p className="font-semibold">No challenges found</p>
          <p className="text-sm text-muted-foreground mt-1">
            Try clearing filters or selecting a different city.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-3">
          {challenges.map((ch) => (
            <ChallengeCard
              key={ch.id}
              id={ch.id}
              name={ch.name}
              city={ch.city?.name ?? "Unknown city"}
              country={ch.city?.country?.name ?? null}
              timeLimitMinutes={ch.time_limit_minutes}
            />
          ))}
        </div>
      )}
    </main>
  );
}