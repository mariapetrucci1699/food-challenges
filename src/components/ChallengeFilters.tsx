"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

type Props = {
  countries: string[];
  citiesByCountry: Record<string, string[]>;
};

export default function ChallengeFilters({ countries, citiesByCountry }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [country, setCountry] = useState(searchParams.get("country") ?? "");
  const [city, setCity] = useState(searchParams.get("city") ?? "");
  const [maxTime, setMaxTime] = useState(searchParams.get("maxTime") ?? "");

  const availableCities = useMemo(() => {
    if (!country) return [];
    return citiesByCountry[country] ?? [];
  }, [country, citiesByCountry]);

  function onCountryChange(nextCountry: string) {
    setCountry(nextCountry);

    // Reset city when country changes to avoid invalid combinations
    setCity("");
  }

  function applyFilters(e: React.FormEvent) {
    e.preventDefault();

    const params = new URLSearchParams();
    if (country) params.set("country", country);

    // Only apply city if it's valid for the selected country
    if (city && availableCities.includes(city)) params.set("city", city);

    if (maxTime.trim()) params.set("maxTime", maxTime.trim());

    const qs = params.toString();
    router.push(qs ? `/challenges?${qs}` : "/challenges");
  }

  function clearFilters() {
    setCountry("");
    setCity("");
    setMaxTime("");
    router.push("/challenges");
  }

  return (
    <form onSubmit={applyFilters} className="border rounded-xl p-4 mb-6">
      <div className="grid gap-4 md:grid-cols-4">
        <div>
          <label className="block font-medium mb-1">Country</label>
          <select
            className="w-full border rounded-lg p-2"
            value={country}
            onChange={(e) => onCountryChange(e.target.value)}
          >
            <option value="">Any</option>
            {countries.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-medium mb-1">City</label>
          <select
            className="w-full border rounded-lg p-2"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            disabled={!country}
          >
            <option value="">
              {country ? "Any" : "Select a country first"}
            </option>
            {availableCities.map((ct) => (
              <option key={ct} value={ct}>
                {ct}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-medium mb-1">Max time (minutes)</label>
          <input
            className="w-full border rounded-lg p-2"
            value={maxTime}
            onChange={(e) => setMaxTime(e.target.value)}
            placeholder="e.g. 30"
            inputMode="numeric"
          />
        </div>

        <div className="flex items-end gap-3">
          <button className="border rounded-lg px-4 py-2 font-semibold shadow-sm">
            Apply
          </button>
          <button
            type="button"
            onClick={clearFilters}
            className="border rounded-lg px-4 py-2"
          >
            Clear
          </button>
        </div>
      </div>
    </form>
  );
}