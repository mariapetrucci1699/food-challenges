"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type CountryOption = { id: string; name: string };
type CityOption = { id: string; name: string };
type CategoryOption = { id: string; name: string; slug?: string };

type Props = {
  countries: CountryOption[];
  categories: CategoryOption[];
};

export default function SubmitForm({ countries, categories }: Props) {
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [countryId, setCountryId] = useState("");
  const [cityId, setCityId] = useState("");
  const [cities, setCities] = useState<CityOption[]>([]);
  const [timeLimit, setTimeLimit] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingCities, setIsLoadingCities] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [restaurantName, setRestaurantName] = useState("");

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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setIsSubmitting(true);

    if (!name.trim() || !categoryId || !countryId || !cityId) {
      setError("Please fill all required fields.");
      setIsSubmitting(false);
      return;
    }

    const parsedTime = timeLimit.trim() ? Number(timeLimit) : null;
    if (parsedTime !== null && (Number.isNaN(parsedTime) || parsedTime <= 0)) {
      setError("Time limit must be a positive number (or leave it empty).");
      setIsSubmitting(false);
      return;
    }

    const { error: insertError } = await supabase.from("challenges").insert({
      name: name.trim(),
      restaurant_name: restaurantName.trim() || null,
      category_id: categoryId,
      city_id: cityId,
      time_limit_minutes: parsedTime,
      status: "pending",
    });

    setIsSubmitting(false);

    if (insertError) {
      setError(insertError.message);
      return;
    }

    setSuccess(true);
    setName("");
    setCategoryId("");
    setCountryId("");
    setCityId("");
    setCities([]);
    setTimeLimit("");
    setRestaurantName("");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block font-medium mb-1">Challenge name *</label>
        <input
          className="w-full border rounded-lg p-3"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div>
        <label className="block font-medium mb-1">Restaurant name *</label>
        <input
          className="w-full border rounded-lg p-3"
          value={restaurantName}
          onChange={(e) => setRestaurantName(e.target.value)}
          placeholder="e.g. O Bifanas do Metro"
        />
      </div>

      <div>
        <label className="block font-medium mb-1">Category *</label>
        <select
          className="w-full border rounded-lg p-3"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
        >
          <option value="">Select category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block font-medium mb-1">Country *</label>
        <select
          className="w-full border rounded-lg p-3"
          value={countryId}
          onChange={(e) => handleCountryChange(e.target.value)}
        >
          <option value="">Select country</option>
          {countries.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block font-medium mb-1">City *</label>
        <select
          className="w-full border rounded-lg p-3"
          value={cityId}
          onChange={(e) => setCityId(e.target.value)}
          disabled={!countryId || isLoadingCities}
        >
          <option value="">
            {!countryId
              ? "Select country first"
              : isLoadingCities
              ? "Loading cities..."
              : "Select city"}
          </option>

          {cities.map((ct) => (
            <option key={ct.id} value={ct.id}>
              {ct.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block font-medium mb-1">Time limit (minutes)</label>
        <input
          className="w-full border rounded-lg p-3"
          value={timeLimit}
          onChange={(e) => setTimeLimit(e.target.value)}
          inputMode="numeric"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-lg p-3 font-semibold border shadow-sm disabled:opacity-60"
      >
        {isSubmitting ? "Submitting..." : "Submit"}
      </button>

      {error && <p className="text-red-600">{error}</p>}
      {success && (
        <p className="text-green-600">
          ✅ Submitted! It will appear after approval.
        </p>
      )}
    </form>
  );
}