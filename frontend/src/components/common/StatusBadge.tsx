interface StatusBadgeProps {
  status: string;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const normalized = (status || "").toUpperCase();
  const className =
    normalized === "APPROVED" || normalized === "ACTIVE"
      ? "bg-success"
      : normalized === "REJECTED" || normalized === "INACTIVE"
        ? "bg-danger"
        : "bg-warning text-dark";

  return (
    <span className={`badge rounded-pill px-2 py-1 ${className}`}>
      {normalized || "UNKNOWN"}
    </span>
  );
}
