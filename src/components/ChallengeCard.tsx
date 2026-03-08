import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Store, Clock } from "lucide-react";

type ChallengeCardProps = {
  id: string;
  name: string;
  city: string;
  country?: string | null;
  restaurantName?: string | null;
  timeLimitMinutes?: number | null;
  imageUrl?: string | null;
  onHover?: () => void;
  onLeave?: () => void;
};

export default function ChallengeCard({
  id,
  name,
  city,
  country,
  restaurantName,
  timeLimitMinutes,
  imageUrl,
  onHover,
  onLeave,
}: ChallengeCardProps) {
  return (
    <Link
      href={`/challenges/${id}`}
      className="block h-full"
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      <Card className="h-full flex flex-col overflow-hidden transition hover:shadow-md">
        <div className="h-44 w-full overflow-hidden bg-muted">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-xs text-muted-foreground">
              No photo yet 🍽️
            </div>
          )}
        </div>

        <CardHeader>
          <CardTitle className="text-xl">{name}</CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col gap-2 flex-1">
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            {city}
            {country ? `, ${country}` : ""}
          </p>

          {restaurantName && (
            <p className="text-sm flex items-center gap-2">
              <Store className="h-4 w-4 text-muted-foreground" />
              {restaurantName}
            </p>
          )}

          <div className="mt-auto">
            {typeof timeLimitMinutes === "number" ? (
              <Badge variant="secondary" className="inline-flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {timeLimitMinutes} min
              </Badge>
            ) : (
              <Badge variant="outline">No time limit</Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}