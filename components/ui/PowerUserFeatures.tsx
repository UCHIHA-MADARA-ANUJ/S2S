"use client";
import { CommandPalette } from "./CommandPalette";
import { ShortcutsModal } from "./ShortcutsModal";
import { useKeyboardShortcuts, useShortcutsModal } from "@/hooks/use-keyboard-shortcuts";

/**
 * Mounts the command palette (Cmd+K) and shortcuts modal (?) and binds keyboard handlers.
 * Drop this once at the root of the app.
 */
export function PowerUserFeatures() {
  const { open, show, hide } = useShortcutsModal();
  useKeyboardShortcuts(show);
  return (
    <>
      <CommandPalette />
      <ShortcutsModal open={open} onClose={hide} />
    </>
  );
}
