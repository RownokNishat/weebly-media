"use client";
import React, { useState, useRef, useEffect } from "react";
import { Folder, FileText } from "lucide-react";

interface NewItemDialogProps {
  onConfirm: (type: "folder" | "file", name: string) => void;
  onCancel: () => void;
}

const NewItemDialog: React.FC<NewItemDialogProps> = ({
  onConfirm,
  onCancel,
}) => {
  const [name, setName] = useState("");
  const [type, setType] = useState<"folder" | "file">("folder");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-10000 backdrop-blur-sm">
      <div className="bg-ex-panel border border-ex-border2 rounded-xl p-5 min-w-80 shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
        <div className="text-[15px] font-semibold text-ex-text mb-3.5 font-sans">
          New item
        </div>

        <div className="flex gap-2 mb-3">
          <button
            className={`flex-1 flex items-center justify-center gap-1.5 p-2 border rounded-md text-[13px] font-sans cursor-pointer transition-all duration-150 ${
              type === "folder"
                ? "border-ex-accent bg-ex-accent/10 text-ex-text"
                : "border-ex-border2 bg-ex-hover text-ex-muted hover:text-ex-text"
            }`}
            onClick={() => setType("folder")}
          >
            <Folder size={15} strokeWidth={1.5} /> Folder
          </button>
          <button
            className={`flex-1 flex items-center justify-center gap-1.5 p-2 border rounded-md text-[13px] font-sans cursor-pointer transition-all duration-150 ${
              type === "file"
                ? "border-ex-accent bg-ex-accent/10 text-ex-text"
                : "border-ex-border2 bg-ex-hover text-ex-muted hover:text-ex-text"
            }`}
            onClick={() => setType("file")}
          >
            <FileText size={14} strokeWidth={1.5} /> Text File
          </button>
        </div>

        <input
          ref={inputRef}
          className="w-full bg-ex-surface border border-ex-border2 rounded-md text-ex-text text-[13px] font-mono px-3 py-2 outline-none mb-3.5 transition-colors duration-150 focus:border-ex-accent placeholder:text-ex-dim"
          placeholder={type === "folder" ? "Folder name" : "filename.txt"}
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && name.trim()) onConfirm(type, name.trim());
            if (e.key === "Escape") onCancel();
          }}
        />

        <div className="flex justify-end gap-2">
          <button
            className="px-3.5 py-1.5 border border-ex-border2 rounded-md bg-transparent text-ex-muted text-[13px] font-sans cursor-pointer transition-all duration-150 hover:bg-ex-hover hover:text-ex-text"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="px-3.5 py-1.5 border border-ex-accent2 rounded-md bg-ex-accent text-white text-[13px] font-sans font-semibold cursor-pointer transition-all duration-150 hover:bg-ex-accent2 disabled:opacity-40 disabled:cursor-not-allowed"
            onClick={() => name.trim() && onConfirm(type, name.trim())}
            disabled={!name.trim()}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewItemDialog;
