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
        Ghi chú (lý do từ chối)
      </div>
      <Textarea
        placeholder="Nhập lý do từ chối nếu Reject..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-24"
      />
    </div>
  );
}
