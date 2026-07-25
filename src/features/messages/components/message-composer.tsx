"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type MessageComposerProps = {
  onSend: (content: string) => void;
};

export function MessageComposer({ onSend }: MessageComposerProps) {
  const [draft, setDraft] = useState("");

  function handleSend() {
    const content = draft.trim();
    if (!content) return;
    onSend(content);
    setDraft("");
  }

  return (
    <div className="flex items-end gap-2 border-t p-3">
      <Textarea
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            handleSend();
          }
        }}
        placeholder="Mesajınızı yazın..."
        rows={1}
        className="max-h-32 min-h-9 flex-1 resize-none py-2"
      />
      <Button
        size="icon"
        aria-label="Mesaj gönder"
        disabled={draft.trim().length === 0}
        onClick={handleSend}
      >
        <Send className="size-4" />
      </Button>
    </div>
  );
}
