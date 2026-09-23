import HallOfFameView from "@/modules/hall-of-fame/components/HallOfFameView";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Foundry | Hall of Fame",
  description: "Discover top Y Combinator unicorns, top-valued public companies, and breakthrough founders.",
};

export default function HallOfFamePage() {
  return <HallOfFameView />;
}
