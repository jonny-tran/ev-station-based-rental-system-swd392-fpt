import { Textarea } from "@/components/ui/textarea";

export function RejectNote({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-2">
      <div className="text-sm text-muted-foreground">
        Note (Rejection Reason)
      </div>
      <Textarea
        placeholder="Enter rejection reason if rejecting..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-24"
      />
    </div>
  );
}
