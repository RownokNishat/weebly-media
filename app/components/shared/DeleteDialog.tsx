"use client";
import React from "react";
import type { FileNode } from "../types";

interface DeleteDialogProps {
  node: FileNode;
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteDialog: React.FC<DeleteDialogProps> = ({
  node,
  onConfirm,
  onCancel,
}) => (
  <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-10000 backdrop-blur-sm">
    <div className="bg-ex-panel border border-ex-border2 rounded-xl p-5 min-w-80 shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
      <div className="text-[15px] font-semibold text-ex-danger mb-3.5 font-sans">
        Delete &quot;{node.name}&quot;?
      </div>
      <p className="text-[13px] text-ex-muted mb-4 leading-relaxed font-sans">
        {node.type === "folder"
          ? "This will permanently delete the folder and all its contents."
          : "This file will be permanently deleted."}
      </p>
      <div className="flex justify-end gap-2">
        <button
          className="px-3.5 py-1.5 border border-ex-border2 rounded-md bg-transparent text-ex-muted text-[13px] font-sans cursor-pointer transition-all duration-150 hover:bg-ex-hover hover:text-ex-text"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button
          className="px-3.5 py-1.5 border border-[#A03030] rounded-md bg-[#7A2020] text-[#FFB3B3] text-[13px] font-sans font-semibold cursor-pointer transition-all duration-150 hover:bg-[#8B2525]"
          onClick={onConfirm}
        >
          Delete
        </button>
      </div>
    </div>
  </div>
);

export default DeleteDialog;
