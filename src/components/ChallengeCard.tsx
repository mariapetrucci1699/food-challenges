import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type ChallengeCardProps = {
  id: string;
  name: string;
  city: string;
  country?: string | null;
  timeLimitMinutes?: number | null;
  restaurantName?: string | null;
};

export default function ChallengeCard({
  id,
  name,
  city,
  country,
  timeLimitMinutes,
  restaurantName
}: ChallengeCardProps) {
  return (
    <Link href={`/challenges/${id}`} className="block">
      <Card className="transition hover:shadow-md">
        <CardHeader>
          <CardTitle className="text-xl">{name}</CardTitle>
        </CardHeader>

        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            {city}
            {country ? `, ${country}` : ""}
          </p>

          {restaurantName ? (
            <p className="text-sm text-muted-foreground">🏪 {restaurantName}</p>
          ) : null}

          {typeof timeLimitMinutes === "number" ? (
            <Badge variant="secondary">⏱ {timeLimitMinutes} min</Badge>
          ) : (
            <Badge variant="outline">⏱ No time limit</Badge>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}