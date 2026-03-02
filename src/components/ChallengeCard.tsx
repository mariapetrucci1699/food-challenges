type ChallengeCardProps = {
  name: string;
  city: string;
  timeLimit: number;
};

export default function ChallengeCard({
  name,
  city,
  timeLimit,
}: ChallengeCardProps) {
  return (
    <div className="border p-4 rounded-xl shadow-sm">
      <h2 className="text-xl font-semibold">{name}</h2>
      <p className="text-gray-500">{city}</p>
      <p className="mt-2">⏱ {timeLimit} minutes</p>
    </div>
  );
}