import TrifectaExplorer from "@/modules/cross-intelligence/components/TrifectaExplorer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Foundry | Flywheel",
  description: "Connect YC Startups, GitHub Open Source Repositories, and Product Hunt Launches into a 360° learning ecosystem.",
};

export default function TrifectaPage() {
  return <TrifectaExplorer />;
}
