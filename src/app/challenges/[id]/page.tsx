import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { MapPin, Store, Clock } from "lucide-react";

type ChallengeDetailRow = {
  id: string;
  name: string;
  restaurant_name: string | null;
  address_line: string | null;
  time_limit_minutes: number | null;
  status: string;
  created_at: string;
  city: null | {
    id: string;
    name: string;
    country: null | {
      id: string;
      name: string;
    };
  };
};

export default async function ChallengeDetailPage({
  params,
}: {
  params: { id: string } | Promise<{ id: string }>;
}) {
  const resolvedParams = await Promise.resolve(params);
  const id = resolvedParams?.id;

  if (!id) {
    return (
      <main className="min-h-screen p-8">
        <Link className="underline text-blue-600" href="/challenges">
          ← Back
        </Link>
        <h1 className="text-3xl font-bold mt-6">Not found</h1>
        <p className="text-gray-600 mt-2">No challenge id was provided.</p>
      </main>
    );
  }

  const { data, error } = await supabase
    .from("challenges")
    .select(`
      id,
      name,
      restaurant_name,
      address_line,
      time_limit_minutes,
      status,
      created_at,
      city:cities!challenges_city_id_fkey (
        id,
        name,
        country:countries!cities_country_id_fkey (
          id,
          name
        )
      )
    `)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    return (
      <main className="min-h-screen p-8">
        <Link className="underline text-blue-600" href="/challenges">
          ← Back
        </Link>
        <h1 className="text-3xl font-bold mt-6">Challenge</h1>
        <p className="text-red-600 mt-4">Error loading challenge:</p>
        <pre className="mt-2 text-sm whitespace-pre-wrap">{error.message}</pre>
      </main>
    );
  }

  const challenge = data as ChallengeDetailRow | null;

  if (!challenge || challenge.status !== "approved") {
    return (
      <main className="min-h-screen p-8">
        <Link className="underline text-blue-600" href="/challenges">
          ← Back
        </Link>
        <h1 className="text-3xl font-bold mt-6">Not found</h1>
        <p className="text-gray-600 mt-2">
          This challenge doesn’t exist or isn’t approved yet.
        </p>
      </main>
    );
  }

  const cityName = challenge.city?.name ?? "Unknown city";
  const countryName = challenge.city?.country?.name ?? null;

  const mapsQueryParts = [
    challenge.restaurant_name,
    challenge.address_line,
    cityName !== "Unknown city" ? cityName : null,
    countryName,
  ].filter(Boolean);

  const googleMapsUrl =
    mapsQueryParts.length > 0
      ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          mapsQueryParts.join(", ")
        )}`
      : null;

  return (
    <main className="min-h-screen p-8">
      <Link className="underline text-blue-600" href="/challenges">
        ← Back to all challenges
      </Link>

      <div className="mt-6 flex items-start justify-between gap-4">
        <h1 className="text-4xl font-bold">{challenge.name}</h1>

        {googleMapsUrl ? (
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 whitespace-nowrap rounded-lg border px-4 py-2 text-sm font-medium shadow-sm hover:bg-muted transition"
          >
            <MapPin className="h-4 w-4" />
            Google Maps
          </a>
        ) : null}
      </div>

      <div className="mt-4 space-y-2 text-gray-700">
        <p className="flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          {cityName}
          {countryName ? `, ${countryName}` : ""}
        </p>

        {challenge.restaurant_name && (
          <p className="flex items-center gap-2">
            <Store className="h-5 w-5 text-muted-foreground" />
            {challenge.restaurant_name}
          </p>
        )}

        {challenge.address_line && (
          <p className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            {challenge.address_line}
          </p>
        )}
      </div>

      <div className="mt-6 space-y-2">
        <p className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-muted-foreground" />
          {typeof challenge.time_limit_minutes === "number"
            ? `${challenge.time_limit_minutes} minutes`
            : "No time limit"}
        </p>

        <p className="text-gray-500 text-sm">
          Added on:{" "}
          {challenge.created_at
            ? new Date(challenge.created_at).toLocaleDateString()
            : "Unknown"}
        </p>
      </div>
    </main>
  );
}