"use client";

import { useState, type ReactNode } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface ConfirmDialogProps {
  /** Element opening the dialog (usually a Button). */
  trigger: ReactNode;
  title: string;
  description: string;
  confirmLabel: string;
  /** Async handler; the dialog closes only on success. */
  onConfirm: () => Promise<string | null>;
  /** Renders the confirm action in the destructive color. */
  destructive?: boolean;
}

/**
 * The confirm pattern for every destructive action (spec §4): regenerate
 * invite, remove member, leave workspace, delete workspace. Deletes state
 * their consequence explicitly in `description`. Calls onConfirm and keeps
 * the dialog open on error so the inline error stays visible.
 */
export function ConfirmDialog({
  trigger,
  title,
  description,
  confirmLabel,
  onConfirm,
  destructive = false,
}: ConfirmDialogProps) {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={pending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={pending}
            className={destructive ? "bg-red-600 text-white hover:bg-red-700" : undefined}
            onClick={async (event) => {
              event.preventDefault(); // keep the dialog open until done
              setPending(true);
              const error = await onConfirm();
              setPending(false);
              if (!error) setOpen(false);
            }}
          >
            {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
