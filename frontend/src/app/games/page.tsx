import GamesView from "@/modules/games/components/GamesView";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Foundry | Trivia",
  description: "Test your YC startup knowledge with interactive quiz games, valuation guessing, and batch trivia.",
};

export default function GamesPage() {
  return <GamesView />;
}
