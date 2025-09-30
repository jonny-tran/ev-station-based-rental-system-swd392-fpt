"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function ConfirmRejectButton({
  canReject,
  onConfirm,
  triggerLabel = "Từ chối",
  confirmTitle = "Bạn có chắc chắn muốn từ chối?",
  cancelLabel = "Hủy",
  confirmLabel = "Xác nhận từ chối",
  size,
}: {
  canReject: boolean;
  onConfirm: () => void;
  triggerLabel?: string;
  confirmTitle?: string;
  cancelLabel?: string;
  confirmLabel?: string;
  size?: "sm" | "default";
}) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" size={size} disabled={!canReject}>
          {triggerLabel}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{confirmTitle}</DialogTitle>
        </DialogHeader>
        <DialogFooter>
          <Button variant="secondary" onClick={() => setOpen(false)}>
            {cancelLabel}
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              onConfirm();
              setOpen(false);
            }}
          >
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
