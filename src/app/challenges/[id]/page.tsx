import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

type ChallengeDetailRow = {
  id: string;
  name: string;
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
    .select(
      `
        id,
        name,
        time_limit_minutes,
        status,
        created_at,
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

  return (
    <main className="min-h-screen p-8">
      <Link className="underline text-blue-600" href="/challenges">
        ← Back to all challenges
      </Link>

      <h1 className="text-4xl font-bold mt-6">{challenge.name}</h1>

      <p className="text-gray-600 mt-2 text-lg">
        {cityName}
        {countryName ? `, ${countryName}` : ""}
      </p>

      <div className="mt-6 space-y-2">
        <p>
          <span className="font-semibold">Time limit:</span>{" "}
          {typeof challenge.time_limit_minutes === "number"
            ? `${challenge.time_limit_minutes} minutes`
            : "Not set"}
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