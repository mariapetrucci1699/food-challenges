import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Store, Clock } from "lucide-react";

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
         <p className="text-sm text-muted-foreground flex items-center gap-1">
          <MapPin className="h-4 w-4" />
          {city}
          {country ? `, ${country}` : ""}
        </p>

          {restaurantName && (
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <Store className="h-4 w-4" />
              {restaurantName}
            </p>
          )}

          {typeof timeLimitMinutes === "number" ? (
            <Badge variant="secondary" className="flex items-center gap-1 w-fit">
              <Clock className="h-3.5 w-3.5" />
              {timeLimitMinutes} min
            </Badge>
          ) : (
            <Badge variant="outline" className="flex items-center gap-1 w-fit">
              <Clock className="h-3.5 w-3.5" />
              No time limit
            </Badge>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}