"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
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

export default function ChallengeFiltersV2({
  countries,
  maxTimeOptions,
}: Props) {
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
    <div className="mb-6 rounded-[28px] border border-border/70 bg-card/95 p-4 shadow-sm backdrop-blur-sm">
      <form onSubmit={applyFilters} className="grid gap-4 md:grid-cols-4">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Country
          </p>
          <Select
            value={countryId || ANY}
            onValueChange={(v) => handleCountryChange(v)}
          >
            <SelectTrigger className="h-11 rounded-2xl border-border/80 bg-background/80">
              <SelectValue placeholder="Any country" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ANY}>Any country</SelectItem>
              {countries.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            City
          </p>
          <Select
            value={cityId || ANY}
            onValueChange={(v) => setCityId(v === ANY ? "" : v)}
            disabled={!countryId || isLoadingCities}
          >
            <SelectTrigger className="h-11 rounded-2xl border-border/80 bg-background/80">
              <SelectValue
                placeholder={
                  !countryId
                    ? "Select country first"
                    : isLoadingCities
                    ? "Loading..."
                    : "Any city"
                }
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ANY}>Any city</SelectItem>
              {cities.map((ct) => (
                <SelectItem key={ct.id} value={ct.id}>
                  {ct.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Time limit
          </p>
          <Select
            value={maxTime || ANY}
            onValueChange={(v) => setMaxTime(v === ANY ? "" : v)}
          >
            <SelectTrigger className="h-11 rounded-2xl border-border/80 bg-background/80">
              <SelectValue placeholder="Any duration" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ANY}>Any duration</SelectItem>
              {maxTimeOptions.map((t) => (
                <SelectItem key={t} value={String(t)}>
                  Up to {t} min
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-end gap-2">
          <Button
            type="submit"
            className="h-11 rounded-2xl bg-primary px-5 text-primary-foreground hover:opacity-90"
          >
            Apply
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={clearFilters}
            className="h-11 rounded-2xl px-5"
          >
            Clear
          </Button>
        </div>

        {error ? (
          <p className="text-sm text-red-600 md:col-span-4">{error}</p>
        ) : null}
      </form>
    </div>
  );
}