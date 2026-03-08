import { NextResponse } from "next/server";

async function geocodeOnce(query: string) {
  const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&q=${encodeURIComponent(
    query
  )}`;

  const res = await fetch(url, {
    headers: {
      "User-Agent": "food-challenges-mvp/1.0",
      "Accept-Language": "en",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to geocode address");
  }

  const data = await res.json();

  if (!Array.isArray(data) || data.length === 0) {
    return null;
  }

  const first = data[0];

  return {
    latitude: Number(first.lat),
    longitude: Number(first.lon),
    displayName: first.display_name,
    matchedQuery: query,
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");
  const address = searchParams.get("address");
  const city = searchParams.get("city");
  const country = searchParams.get("country");

  const candidates = [
  [address, city, country].filter(Boolean).join(", "),
  query,
  [city, country].filter(Boolean).join(", "),
].filter((q): q is string => Boolean(q && q.trim()));

  if (candidates.length === 0) {
    return NextResponse.json({ error: "Missing query" }, { status: 400 });
  }

  try {
    for (const candidate of candidates) {
      const result = await geocodeOnce(candidate);
      if (result) {
        return NextResponse.json(result);
      }
    }

    return NextResponse.json(
      { error: "No location found for this address" },
      { status: 404 }
    );
  } catch (err) {
    return NextResponse.json(
      {
        error: err instanceof Error ? err.message : "Unexpected geocoding error",
      },
      { status: 500 }
    );
  }
}