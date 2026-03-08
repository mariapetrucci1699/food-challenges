"use client";

import { useState } from "react";
import ChallengeCard from "@/components/ChallengeCard";
import ChallengeFiltersV2 from "@/components/ChallengeFiltersV2";
import ChallengesMapWrapper from "@/components/ChallengesMapWrapper";

type CountryOption = { id: string; name: string };

type ChallengeRow = {
  id: string;
  name: string;
  image_url: string | null;
  restaurant_name: string | null;
  time_limit_minutes: number | null;
  status: string;
  city: null | {
    id: string;
    name: string;
    latitude: number | null;
    longitude: number | null;
    country: null | {
      id: string;
      name: string;
    };
  };
};

type MapPoint = {
  id: string;
  name: string;
  imageUrl: string | null;
  restaurantName: string | null;
  cityName: string;
  countryName: string | null;
  lat: number;
  lng: number;
};

type Props = {
  countries: CountryOption[];
  maxTimeOptions: number[];
  challenges: ChallengeRow[];
  points: MapPoint[];
  selectedCountryName: string | null;
  cityId: string;
  maxTime: number | null;
};

export default function ChallengesPageClient({
  countries,
  maxTimeOptions,
  challenges,
  points,
  selectedCountryName,
  cityId,
  maxTime,
}: Props) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="min-w-0">
        <ChallengeFiltersV2
          countries={countries}
          maxTimeOptions={maxTimeOptions}
        />

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
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-2">
            {challenges.map((ch) => {
              const cityName = ch.city?.name ?? "Unknown city";
              const countryName = ch.city?.country?.name ?? null;

              return (
                <ChallengeCard
                  key={ch.id}
                  id={ch.id}
                  name={ch.name}
                  city={cityName}
                  country={countryName}
                  timeLimitMinutes={ch.time_limit_minutes}
                  restaurantName={ch.restaurant_name}
                  imageUrl={ch.image_url}
                  onHover={() => setHoveredId(ch.id)}
                  onLeave={() => setHoveredId(null)}
                />
              );
            })}
          </div>
        )}
      </div>

      <div className="hidden lg:block">
        <div className="sticky top-24">
          <ChallengesMapWrapper points={points} hoveredId={hoveredId} />
        </div>
      </div>
    </div>
  );
}