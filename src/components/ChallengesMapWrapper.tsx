"use client";

import dynamic from "next/dynamic";

const ChallengesMap = dynamic(() => import("./ChallengesMap"), {
  ssr: false,
});

type Props = {
  points: any[];
  hoveredId: string | null;
};

export default function ChallengesMapWrapper({ points, hoveredId }: Props) {
  return <ChallengesMap points={points} hoveredId={hoveredId} />;
}