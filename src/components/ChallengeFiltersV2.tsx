"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type CountryOption = { id: string; name: string };
type CityOption = { id: string; name: string };

type Props = {
  countries: CountryOption[];
  maxTimeOptions: number[];
};

const ANY = "__any__";

export default function ChallengeFiltersV2({ countries, maxTimeOptions }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialCountryId = searchParams.get("countryId") ?? "";
  const initialCityId = searchParams.get("cityId") ?? "";
  const initialMaxTime = searchParams.get("maxTime") ?? "";

  const [countryId, setCountryId] = useState(initialCountryId);
  const [cityId, setCityId] = useState(initialCityId);
  const [maxTime, setMaxTime] = useState(initialMaxTime);

  const [cities, setCities] = useState<CityOption[]>([]);
  const [isLoadingCities, setIsLoadingCities] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCountryChange(nextCountryId: string) {
    const normalized = nextCountryId === ANY ? "" : nextCountryId;

    setCountryId(normalized);
    setCityId("");
    setCities([]);
    setError(null);

    if (!normalized) return;

    setIsLoadingCities(true);
    try {
      const res = await fetch(`/api/cities?countryId=${normalized}`);
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

    const params = new URLSearchParams();
    if (countryId) params.set("countryId", countryId);
    if (cityId) params.set("cityId", cityId);
    if (maxTime.trim()) params.set("maxTime", maxTime.trim());

    const qs = params.toString();
    router.push(qs ? `/challenges?${qs}` : "/challenges");
    router.refresh();
  }

  function clearFilters() {
    setCountryId("");
    setCityId("");
    setMaxTime("");
    setCities([]);
    setError(null);
    router.push("/challenges");
    router.refresh();
  }

  return (
    <Card className="p-4 mb-6">
      <form onSubmit={applyFilters} className="grid gap-4 md:grid-cols-4">
        {/* Country */}
        <div className="space-y-1">
          <Label>Country</Label>
          <Select
            value={countryId || ANY}
            onValueChange={(v) => handleCountryChange(v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Any" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ANY}>Any</SelectItem>
              {countries.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* City */}
        <div className="space-y-1">
          <Label>City</Label>
          <Select
            value={cityId || ANY}
            onValueChange={(v) => setCityId(v === ANY ? "" : v)}
            disabled={!countryId || isLoadingCities}
          >
            <SelectTrigger>
              <SelectValue
                placeholder={
                  !countryId
                    ? "Select country first"
                    : isLoadingCities
                    ? "Loading..."
                    : "Any"
                }
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ANY}>Any</SelectItem>
              {cities.map((ct) => (
                <SelectItem key={ct.id} value={ct.id}>
                  {ct.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Max time */}
        <div className="space-y-1">
          <Label>Max time (min)</Label>
          <Select
            value={maxTime || ANY}
            onValueChange={(v) => setMaxTime(v === ANY ? "" : v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Any" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ANY}>Any</SelectItem>
              {maxTimeOptions.map((t) => (
                <SelectItem key={t} value={String(t)}>
                  {t} min
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Buttons */}
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