import Image from "next/image";

import ChallengeCard from "@/components/ChallengeCard";

const challenges = [
  {
    name: "Giant Pizza Challenge",
    city: "Naples, Italy",
    timeLimit: 30,
  },
  {
    name: "Mega Burger Tower",
    city: "Texas, USA",
    timeLimit: 45,
  },
  {
    name: "Spicy Ramen Inferno",
    city: "Tokyo, Japan",
    timeLimit: 20,
  },
];

export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-4xl font-bold mb-8">
        🌍 Food Challenges Around the World
      </h1>

      <div className="grid gap-4 md:grid-cols-3">
        {challenges.map((challenge, index) => (
          <ChallengeCard
            key={index}
            name={challenge.name}
            city={challenge.city}
            timeLimit={challenge.timeLimit}
          />
        ))}
      </div>
    </main>
  );
}