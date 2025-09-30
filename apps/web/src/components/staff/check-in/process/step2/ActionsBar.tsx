import { Button } from "@/components/ui/button";
import { ConfirmRejectButton } from "@/components/staff/check-in/common/ConfirmRejectButton";

export function ActionsBar({
  canContinue,
  onContinue,
  onReject,
  onSaveDraft,
  canReject,
}: {
  canContinue: boolean;
  onContinue: () => void;
  onReject: (reason: string) => void;
  onSaveDraft?: () => void;
  canReject?: boolean;
}) {
  // no local dialog state, handled by ConfirmRejectButton

  return (
    <div className="flex items-center justify-end gap-3">
      {onSaveDraft ? (
        <Button variant="secondary" onClick={onSaveDraft}>
          Lưu tạm
        </Button>
      ) : null}
      <ConfirmRejectButton
        canReject={Boolean(canReject)}
        onConfirm={() => onReject("")}
      />

      <Button onClick={onContinue} disabled={!canContinue}>
        Phê duyệt & Tiếp tục
      </Button>
    </div>
  );
}
