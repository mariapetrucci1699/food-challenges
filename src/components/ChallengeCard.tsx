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
      <Card className="h-full overflow-hidden border-border/80 bg-card/95 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-xl">
        <div className="h-44 w-full overflow-hidden bg-muted">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={name}
              className="h-full w-full object-cover transition duration-300 hover:scale-[1.03]"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-muted text-xs text-muted-foreground">
              No photo yet 🍽️
            </div>
          )}
        </div>

        <CardHeader className="pb-3">
          <CardTitle className="line-clamp-2 text-xl leading-snug">
            {name}
          </CardTitle>
        </CardHeader>

        <CardContent className="flex h-full flex-col gap-3">
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 text-primary" />
            {city}
            {country ? `, ${country}` : ""}
          </p>

          {restaurantName && (
            <p className="flex items-center gap-2 text-sm text-foreground/85">
              <Store className="h-4 w-4 text-primary" />
              {restaurantName}
            </p>
          )}

          <div className="mt-auto">
            {typeof timeLimitMinutes === "number" ? (
              <Badge className="inline-flex items-center gap-1 bg-primary text-primary-foreground hover:bg-primary">
                <Clock className="h-3.5 w-3.5" />
                {timeLimitMinutes} min
              </Badge>
            ) : (
              <Badge variant="secondary" className="inline-flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                No time limit
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}