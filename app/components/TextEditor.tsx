"use client";
import React, { useState, useEffect, useCallback } from "react";
import { FileText, Save } from "lucide-react";
import type { FileNode } from "./types";

interface TextEditorProps {
  file: FileNode;
  onSave: (content: string) => void;
  onClose: () => void;
}

const TextEditor: React.FC<TextEditorProps> = ({ file, onSave, onClose }) => {
  const [content, setContent] = useState(file.content ?? "");
  const [dirty, setDirty] = useState(false);

  const save = useCallback(() => {
    onSave(content);
    setDirty(false);
  }, [content, onSave]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        save();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [save]);

  return (
    <div className="flex-1 flex flex-col overflow-hidden border-l border-ex-border">
      <div className="flex items-center justify-between px-3 h-11 bg-ex-surface border-b border-ex-border shrink-0">
        <span className="flex items-center gap-2 font-mono text-[13px] text-ex-text">
          <FileText size={14} strokeWidth={1.5} className="text-ex-muted" />
          {file.name}
          {dirty && <span className="text-ex-dim text-[11px]">— unsaved</span>}
        </span>
        <div className="flex gap-2">
          <button
            className={`flex items-center gap-1.5 px-3 py-1 border rounded text-xs font-sans cursor-pointer transition-all duration-150 ${
              dirty
                ? "bg-ex-accent border-ex-accent text-white"
                : "bg-ex-hover border-ex-border2 text-ex-muted hover:bg-ex-accent hover:border-ex-accent hover:text-white"
            }`}
            onClick={save}
          >
            <Save size={12} strokeWidth={2} /> Save
          </button>
          <button
            className="px-3 py-1 border border-ex-border2 rounded bg-transparent text-ex-muted text-xs font-sans cursor-pointer transition-all duration-150 hover:bg-ex-hover hover:text-ex-text"
            onClick={onClose}
          >
            ✕
          </button>
        </div>
      </div>
      <textarea
        className="flex-1 bg-ex-bg text-ex-text border-none outline-none resize-none px-5 py-4 font-mono text-[13px] leading-[1.7] tab-2 selection-accent overflow-auto"
        value={content}
        onChange={(e) => {
          setContent(e.target.value);
          setDirty(true);
        }}
        spellCheck={false}
      />
    </div>
  );
};

export default TextEditor;
