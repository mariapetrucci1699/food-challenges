"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import L, { LatLngBounds } from "leaflet";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";

type MapPoint = {
  id: string;
  name: string;
  cityName: string;
  countryName: string | null;
  lat: number;
  lng: number;
};

function getFoodEmoji(name: string) {
  const n = name.toLowerCase();

  if (n.includes("pizza")) return "🍕";
  if (n.includes("ramen") || n.includes("noodle")) return "🍜";
  if (n.includes("burger") || n.includes("patty")) return "🍔";
  if (n.includes("taco")) return "🌮";
  if (n.includes("sushi")) return "🍣";
  if (n.includes("spicy") || n.includes("inferno") || n.includes("hot")) return "🌶️";
  if (n.includes("steak")) return "🥩";
  if (n.includes("chicken")) return "🍗";
  if (n.includes("ice") || n.includes("gelato") || n.includes("dessert") || n.includes("cake")) return "🍰";

  return "🍽️"; // fallback
}

function makeEmojiIcon(emoji: string) {
  return L.divIcon({
    className: "food-marker-icon",
    html: `<div class="food-marker-inner">${emoji}</div>`,
    iconSize: [34, 34],
    iconAnchor: [17, 34],
    popupAnchor: [0, -30],
  });
}

function FixLeafletResize() {
  const map = useMap();

  useEffect(() => {
    const t = setTimeout(() => {
      map.invalidateSize();
    }, 200);

    return () => clearTimeout(t);
  }, [map]);

  return null;
}

function FitBounds({ points }: { points: { lat: number; lng: number }[] }) {
  const map = useMap();

  useEffect(() => {
    if (points.length === 0) return;

    const bounds = new LatLngBounds(points.map((p) => [p.lat, p.lng]));
    map.fitBounds(bounds, { padding: [30, 30] });
  }, [map, points]);

  return null;
}

export default function ChallengesMap({ points }: { points: MapPoint[] }) {
  // If no points, don’t render map (avoids pointless tile loads)
  if (!points || points.length === 0) return null;

  const center = useMemo(() => {
    const lat = points.reduce((s, p) => s + p.lat, 0) / points.length;
    const lng = points.reduce((s, p) => s + p.lng, 0) / points.length;
    return { lat, lng };
  }, [points]);

  // ⭐ ADD THIS PART
  const iconsById = useMemo(() => {
    const map = new Map<string, L.DivIcon>();

    for (const p of points) {
      const emoji = getFoodEmoji(p.name);
      map.set(p.id, makeEmojiIcon(emoji));
    }

    return map;
  }, [points]);



  return (
    <div className="rounded-xl border overflow-hidden mb-6">
      <div className="px-4 py-3 border-b bg-background">
        <h2 className="font-semibold">🗺️ Challenge Map</h2>
        <p className="text-sm text-muted-foreground">
          Click a marker to view a challenge.
        </p>
      </div>

      {/* shorter + wide */}
      <div className="h-[260px] md:h-[320px]">
        <MapContainer
          center={[center.lat, center.lng]}
          zoom={3}
          scrollWheelZoom
          className="h-full w-full"
        >
          <FixLeafletResize />
          <FitBounds points={points} />

          <TileLayer
            attribution='&copy; OpenStreetMap contributors &copy; CARTO'
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            />

          {points.map((p) => (
                <Marker
                    key={p.id}
                    position={[p.lat, p.lng]}
                    icon={iconsById.get(p.id)}
                >
                    <Popup>
                    <div className="space-y-1">
                        <div className="font-semibold">{p.name}</div>
                        <div className="text-sm">
                        {p.cityName}
                        {p.countryName ? `, ${p.countryName}` : ""}
                        </div>
                        <Link className="text-sm underline" href={`/challenges/${p.id}`}>
                        View details →
                        </Link>
                    </div>
                    </Popup>
                </Marker>
                ))}
        </MapContainer>
      </div>
    </div>
  );
}