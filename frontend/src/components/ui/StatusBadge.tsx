import { STATUS_COLORS } from "@/lib/constants";

interface Props {
  status: string;
  size?: "sm" | "md";
}

export default function StatusBadge({ status, size = "sm" }: Props) {
  const sizeClasses = size === "sm" ? "text-[10px] px-2 py-0.5" : "text-xs px-3 py-1";
  return (
    <span className={`font-semibold rounded-full border ${sizeClasses} ${STATUS_COLORS[status] || ""}`}>
      {status}
    </span>
  );
}
