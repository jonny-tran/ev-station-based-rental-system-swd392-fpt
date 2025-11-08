"use client";

import { Button } from "@/components/ui/button";
import { ConfirmRejectButton } from "../../common/ConfirmRejectButton";
import { Send } from "lucide-react";

interface ActionButtonsProps {
  primaryLabel: string;
  primaryDisabled: boolean;
  onPrimary: () => void;
  onReject: () => void;
  isSubmitting?: boolean;
}

export function ActionButtons({
  primaryLabel,
  primaryDisabled,
  onPrimary,
  onReject,
  isSubmitting = false,
}: ActionButtonsProps) {
  return (
    <div className="flex items-center justify-between pt-6 border-t">
      <div className="flex items-center space-x-3">
        <ConfirmRejectButton
          canReject={true}
          onConfirm={onReject}
          triggerLabel="Cancel"
          confirmTitle="Are you sure you want to cancel the contract signing process?"
          cancelLabel="No"
          confirmLabel="Yes, cancel"
          size="default"
        />
      </div>

      <div className="flex items-center space-x-3">
        <Button
          onClick={onPrimary}
          disabled={primaryDisabled || isSubmitting}
          className="min-w-[140px]"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              Processing...
            </>
          ) : (
            <>
              <Send className="h-4 w-4 mr-2" />
              {primaryLabel}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
