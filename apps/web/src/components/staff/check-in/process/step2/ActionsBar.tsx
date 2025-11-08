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
  onReject: () => void;
  onSaveDraft?: () => void;
  canReject?: boolean;
}) {
  // no local dialog state, handled by ConfirmRejectButton

  return (
    <div className="flex items-center justify-end gap-3">
      {onSaveDraft ? (
        <Button variant="secondary" onClick={onSaveDraft}>
          Save Draft
        </Button>
      ) : null}
      <ConfirmRejectButton
        canReject={Boolean(canReject)}
        onConfirm={onReject}
      />

      <Button onClick={onContinue} disabled={!canContinue}>
        Approve & Continue
      </Button>
    </div>
  );
}
