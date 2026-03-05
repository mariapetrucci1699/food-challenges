"use client";

import dynamic from "next/dynamic";

const ChallengesMap = dynamic(() => import("./ChallengesMap"), {
  ssr: false,
});

export default function ChallengesMapWrapper({ points }: any) {
  return <ChallengesMap points={points} />;
}