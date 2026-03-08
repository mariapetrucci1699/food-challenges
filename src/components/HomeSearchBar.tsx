"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

type CountryOption = { id: string; name: string };

type Props = {
  countries: CountryOption[];
  maxTimeOptions: number[];
};

export default function HomeSearchBar({
  countries,
  maxTimeOptions,
}: Props) {
  const router = useRouter();

  const [countryId, setCountryId] = useState("");
  const [maxTime, setMaxTime] = useState("");

  function handleSearch() {
    const params = new URLSearchParams();

    if (countryId) params.set("countryId", countryId);
    if (maxTime) params.set("maxTime", maxTime);

    const qs = params.toString();
    router.push(qs ? `/challenges?${qs}` : "/challenges");
  }

  return (
    <div className="mx-auto mt-8 flex max-w-5xl items-center gap-4 rounded-full border border-white/20 bg-white/95 px-4 py-3 shadow-2xl backdrop-blur-md">
      <div className="flex-1 px-4">
        <p className="mb-1 text-xs font-semibold text-foreground">Where</p>
        <select
          className="w-full bg-transparent text-sm text-muted-foreground outline-none"
          value={countryId}
          onChange={(e) => setCountryId(e.target.value)}
        >
          <option value="">Any country</option>
          {countries.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div className="hidden h-8 w-px bg-border md:block" />

      <div className="flex-1 px-4">
        <p className="mb-1 text-xs font-semibold text-foreground">Time limit</p>
        <select
          className="w-full bg-transparent text-sm text-muted-foreground outline-none"
          value={maxTime}
          onChange={(e) => setMaxTime(e.target.value)}
        >
          <option value="">Any duration</option>
          {maxTimeOptions.map((t) => (
            <option key={t} value={String(t)}>
              Up to {t} min
            </option>
          ))}
        </select>
      </div>

      <button
        type="button"
        onClick={handleSearch}
        className="rounded-full bg-primary p-4 text-primary-foreground transition hover:opacity-90"
      >
        <Search className="h-5 w-5" />
      </button>
    </div>
  );
}