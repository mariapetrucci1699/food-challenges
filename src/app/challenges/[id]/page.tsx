import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { MapPin, Store, Clock, ImageIcon } from "lucide-react";

type ChallengeDetailRow = {
  id: string;
  name: string;
  restaurant_name: string | null;
  address_line: string | null;
  latitude: number | null;
  longitude: number | null;
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
  image_url: string | null;
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
      latitude,
      longitude,
      time_limit_minutes,
      status,
      created_at,
      image_url,
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

  const mapQuery =
    mapsQueryParts.length > 0
      ? encodeURIComponent(mapsQueryParts.join(", "))
      : null;

  const googleMapsUrl = mapQuery
    ? `https://www.google.com/maps/search/?api=1&query=${mapQuery}`
    : null;

  const googleMapsEmbedUrl = mapQuery
    ? `https://www.google.com/maps?q=${mapQuery}&output=embed`
    : null;

  return (
    <main className="min-h-screen p-8">
      <Link className="underline text-blue-600" href="/challenges">
        ← Back to all challenges
      </Link>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        {/* LEFT COLUMN */}
        <div>
          <h1 className="text-4xl font-bold leading-tight">{challenge.name}</h1>

          <div className="mt-6 space-y-4 text-gray-700">
            {challenge.address_line && googleMapsUrl ? (
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:underline"
              >
                <MapPin className="h-4 w-4 text-muted-foreground" />
                {challenge.address_line}
              </a>
            ) : (
              <p className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                {cityName}
                {countryName ? `, ${countryName}` : ""}
              </p>
            )}

            {challenge.restaurant_name && (
              <p className="flex items-center gap-2">
                <Store className="h-4 w-4 text-muted-foreground" />
                {challenge.restaurant_name}
              </p>
            )}

            <p className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              {typeof challenge.time_limit_minutes === "number"
                ? `${challenge.time_limit_minutes} minutes`
                : "No time limit"}
            </p>
          </div>

          {googleMapsEmbedUrl ? (
            <div className="mt-8 rounded-xl border overflow-hidden h-[320px]">
              <iframe
                title={`Map for ${challenge.name}`}
                src={googleMapsEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          ) : null}
        </div>

        {/* RIGHT COLUMN */}
        <div>
          {challenge.image_url ? (
            <div className="rounded-2xl border overflow-hidden h-[320px] lg:h-[420px] bg-muted">
              <img
                src={challenge.image_url}
                alt={challenge.name}
                className="h-full w-full object-cover"
              />
            </div>
          ) : (
            <div className="rounded-2xl border bg-muted/30 h-[320px] lg:h-[420px] flex flex-col items-center justify-center text-center p-6">
              <p className="text-xl font-semibold">No photo yet 🍽️</p>
              <p className="text-sm text-muted-foreground mt-2 max-w-xs">
                Be the first to show this challenge to the world.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}