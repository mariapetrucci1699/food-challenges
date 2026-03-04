import ChallengeCard from "@/components/ChallengeCard";
import ChallengeFiltersV2 from "@/components/ChallengeFiltersV2";
import { supabase } from "@/lib/supabaseClient";

type CountryOption = { id: string; name: string };

type ChallengeRow = {
  id: string;
  name: string;
  time_limit_minutes: number | null;
  status: string;

  // legacy columns (if they still exist in your table)
  city_text?: string | null;
  country_text?: string | null;

  // joined objects
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
  searchParams:
    | { countryId?: string; cityId?: string; maxTime?: string }
    | Promise<{ countryId?: string; cityId?: string; maxTime?: string }>;
}) {
  const resolvedSearchParams = await Promise.resolve(searchParams);

  const countryId = resolvedSearchParams?.countryId?.trim() || "";
  const cityId = resolvedSearchParams?.cityId?.trim() || "";
  const maxTimeRaw = resolvedSearchParams?.maxTime?.trim() || "";
  const maxTime = maxTimeRaw ? Number(maxTimeRaw) : null;

  // 1) Load countries for the dropdown
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

  const safeCountries = (countries ?? []) as CountryOption[];

  // 2) If user selected only a COUNTRY (no specific city), convert countryId -> cityIds
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

  // 3) Build ONE stable query with stable joins (always the same select)
  let query = supabase
    .from("challenges")
    .select(
      `
        id,
        name,
        time_limit_minutes,
        status,
        city_text:city,
        country_text:country,
        city:cities!challenges_city_id_fkey (
          id,
          name,
          country:countries!cities_country_id_fkey (
            id,
            name
          )
        )
      `
    )
    .eq("status", "approved")
    .order("created_at", { ascending: false });

  // Filter by exact city
  if (cityId) {
    query = query.eq("city_id", cityId);
  }

  // Filter by country (via city IDs)
  if (!cityId && countryId) {
    if (!cityIdsForCountry || cityIdsForCountry.length === 0) {
      // No cities for that country -> no challenges
      return (
        <main className="min-h-screen">
          <h1 className="text-4xl font-bold mb-4">🌍 All Food Challenges</h1>
          <ChallengeFiltersV2 countries={safeCountries} />
          <p className="text-gray-600 mt-6">No challenges found for this country.</p>
        </main>
      );
    }
    query = query.in("city_id", cityIdsForCountry);
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

  const selectedCountryName = countryId
    ? safeCountries.find((c) => c.id === countryId)?.name ?? null
    : null;

  return (
    <main className="min-h-screen">
      <h1 className="text-4xl font-bold mb-4">🌍 All Food Challenges</h1>

      <ChallengeFiltersV2 countries={safeCountries} />

      <p className="text-gray-600 mb-6">
        Filters:{" "}
        {selectedCountryName ? (
          <span className="mr-3">
            <strong>Country</strong> = {selectedCountryName}
          </span>
        ) : (
          <span className="mr-3">Country = any</span>
        )}
        {cityId ? (
          <span className="mr-3">
            <strong>City</strong> = selected
          </span>
        ) : (
          <span className="mr-3">City = any</span>
        )}
        {maxTime !== null && !Number.isNaN(maxTime) ? (
          <span>
            <strong>Max time</strong> = {maxTime} min
          </span>
        ) : (
          <span>Max time = any</span>
        )}
      </p>

      {challenges.length === 0 ? (
        <p className="text-gray-600">No challenges found for these filters.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-3">
          {challenges.map((ch) => {
            const cityName = ch.city?.name ?? ch.city_text ?? "Unknown city";
            const countryName = ch.city?.country?.name ?? ch.country_text ?? null;

            return (
              <ChallengeCard
                key={ch.id}
                id={ch.id}
                name={ch.name}
                city={cityName}
                country={countryName}
                timeLimitMinutes={ch.time_limit_minutes}
              />
            );
          })}
        </div>
      )}
    </main>
  );
}