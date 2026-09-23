import WatchlistView from "@/modules/watchlist/components/WatchlistView";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Foundry | Watchlist",
  description: "Manage your saved YC startups, bookmarked Product Hunt launches, and open-source repositories.",
};

export default function WatchlistPage() {
  return <WatchlistView />;
}
