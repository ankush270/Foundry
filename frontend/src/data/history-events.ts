import type { HistoryEvent } from "./types";

export const historyEvents: HistoryEvent[] = [
  { year: 2005, title: "Reddit Founded", description: "Steve Huffman and Alexis Ohanian launch Reddit as part of the very first YC batch.", startupSlug: "reddit", type: "founding" },
  { year: 2007, title: "Dropbox Founded", description: "Drew Houston and Arash Ferdowsi create Dropbox after Drew kept forgetting his USB drive.", startupSlug: "dropbox", type: "founding" },
  { year: 2007, title: "Justin.tv Launches", description: "Justin Kan starts livestreaming his life 24/7, which later pivots to become Twitch.", startupSlug: "twitch", type: "launch" },
  { year: 2008, title: "Airbnb Founded", description: "Three founders rented air mattresses in their apartment to pay rent, creating a billion-dollar company.", startupSlug: "airbnb", type: "founding" },
  { year: 2009, title: "Stripe Founded", description: "Patrick and John Collison start building payment infrastructure that would power the internet economy.", startupSlug: "stripe", type: "founding" },
  { year: 2011, title: "Twitch Launches", description: "Justin.tv's gaming category becomes so popular it spins off into its own platform called Twitch.", startupSlug: "twitch", type: "launch" },
  { year: 2012, title: "Coinbase Founded", description: "Brian Armstrong starts building the easiest way to buy and sell Bitcoin.", startupSlug: "coinbase", type: "founding" },
  { year: 2013, title: "DoorDash Founded", description: "Stanford students create a food delivery service that would become the largest in the US.", startupSlug: "doordash", type: "founding" },
  { year: 2014, title: "Twitch Acquired by Amazon", description: "Amazon acquires Twitch for $970 million, one of the largest YC exits.", startupSlug: "twitch", type: "acquisition" },
  { year: 2015, title: "GitLab Joins YC", description: "GitLab enters YC W15 batch and goes on to become a public DevOps platform.", startupSlug: "gitlab", type: "batch" },
  { year: 2016, title: "Scale AI Founded", description: "19-year-old Alexandr Wang founds Scale AI to provide training data for AI companies.", startupSlug: "scale-ai", type: "founding" },
  { year: 2019, title: "Ramp Launches", description: "Ramp launches the corporate card that actually helps companies spend less money.", startupSlug: "ramp", type: "launch" },
  { year: 2020, title: "Airbnb IPO", description: "Airbnb goes public at a $47 billion valuation despite the pandemic.", startupSlug: "airbnb", type: "milestone" },
  { year: 2020, title: "DoorDash IPO", description: "DoorDash goes public in one of the biggest tech IPOs of 2020.", startupSlug: "doordash", type: "milestone" },
  { year: 2021, title: "Coinbase Direct Listing", description: "Coinbase goes public via direct listing, valued at $86 billion.", startupSlug: "coinbase", type: "milestone" },
  { year: 2023, title: "AI Batch Boom", description: "YC's W23 and S23 batches see record numbers of AI startups.", type: "milestone" },
];
