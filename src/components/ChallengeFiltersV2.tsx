"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type CountryOption = { id: string; name: string };
type CityOption = { id: string; name: string };

type Props = {
  countries: CountryOption[];
};

export default function ChallengeFiltersV2({ countries }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [countryId, setCountryId] = useState(searchParams.get("countryId") ?? "");
  const [cityId, setCityId] = useState(searchParams.get("cityId") ?? "");
  const [maxTime, setMaxTime] = useState(searchParams.get("maxTime") ?? "");

  const [cities, setCities] = useState<CityOption[]>([]);
  const [isLoadingCities, setIsLoadingCities] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCountryChange(nextCountryId: string) {
    setCountryId(nextCountryId);
    setCityId("");
    setCities([]);
    setError(null);

    if (!nextCountryId) return;

    setIsLoadingCities(true);
    try {
      const res = await fetch(`/api/cities?countryId=${nextCountryId}`);
      const data = await res.json();

      if (!res.ok) {
        setError(data?.error ?? "Failed to load cities.");
        return;
      }

      if (Array.isArray(data)) {
        setCities(data);
      } else {
        setError("Unexpected response when loading cities.");
      }
    } catch {
      setError("Network error loading cities.");
    } finally {
      setIsLoadingCities(false);
    }
  }

  function applyFilters(e: React.FormEvent) {
    e.preventDefault();
    console.log("applyFilters fired");

    const params = new URLSearchParams();
    if (countryId) params.set("countryId", countryId);
    if (cityId) params.set("cityId", cityId);
    if (maxTime.trim()) params.set("maxTime", maxTime.trim());

    const qs = params.toString();
    router.push(qs ? `/challenges?${qs}` : "/challenges");
  }

  function clearFilters() {
    setCountryId("");
    setCityId("");
    setMaxTime("");
    setCities([]);
    setError(null);
    router.push("/challenges");
  }

  return (
    <Card className="p-4 mb-6">
      <form onSubmit={applyFilters} className="grid gap-4 md:grid-cols-4">
        <div className="space-y-1">
          <Label htmlFor="country">Country</Label>
          <select
            id="country"
            className="h-10 w-full rounded-md border bg-background px-3 text-sm"
            value={countryId}
            onChange={(e) => handleCountryChange(e.target.value)}
          >
            <option value="">Any</option>
            {countries.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <Label htmlFor="city">City</Label>
          <select
            id="city"
            className="h-10 w-full rounded-md border bg-background px-3 text-sm"
            value={cityId}
            onChange={(e) => setCityId(e.target.value)}
            disabled={!countryId || isLoadingCities}
          >
            <option value="">
              {!countryId
                ? "Select country first"
                : isLoadingCities
                ? "Loading..."
                : "Any"}
            </option>
            {cities.map((ct) => (
              <option key={ct.id} value={ct.id}>
                {ct.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <Label htmlFor="maxTime">Max time (min)</Label>
          <Input
            id="maxTime"
            value={maxTime}
            onChange={(e) => setMaxTime(e.target.value)}
            placeholder="e.g. 30"
            inputMode="numeric"
          />
        </div>

        <div className="flex items-end gap-2">
          <Button type="submit">Apply</Button>
          <Button type="button" variant="outline" onClick={clearFilters}>
            Clear
          </Button>
        </div>

        {error ? (
          <p className="text-sm text-red-600 md:col-span-4">{error}</p>
        ) : null}
      </form>
    </Card>
  );
}