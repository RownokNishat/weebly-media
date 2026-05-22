"use client";
import React from "react";
import { Folder, FolderOpen, FileText, ChevronRight } from "lucide-react";
import RenameInput from "./RenameInput";
import type { FileNode } from "./types";

interface FileTreeNodeProps {
  node: FileNode;
  depth: number;
  selectedId: string | null;
  expandedIds: Set<string>;
  onSelect: (id: string) => void;
  onToggle: (id: string) => void;
  onOpen: (node: FileNode) => void;
  onContextMenu: (e: React.MouseEvent, node: FileNode) => void;
  renamingId: string | null;
  onRenameConfirm: (newName: string) => void;
  onRenameCancel: () => void;
}

const FileTreeNode: React.FC<FileTreeNodeProps> = ({
  node,
  depth,
  selectedId,
  expandedIds,
  onSelect,
  onToggle,
  onOpen,
  onContextMenu,
  renamingId,
  onRenameConfirm,
  onRenameCancel,
}) => {
  const isFolder = node.type === "folder";
  const isExpanded = expandedIds.has(node.id);
  const isSelected = selectedId === node.id;
  const isRenaming = renamingId === node.id;

  return (
    <div>
      <div
        className={`flex items-center gap-1 h-7 cursor-pointer rounded mx-1.5 pr-2 transition-colors duration-100 select-none ${
          isSelected
            ? "bg-ex-hover outline outline-ex-border2"
            : "hover:bg-ex-hover"
        }`}
        style={{ paddingLeft: 8 + depth * 16 }}
        onClick={() => {
          onSelect(node.id);
          if (isFolder) onToggle(node.id);
        }}
        onDoubleClick={() => {
          if (!isFolder) onOpen(node);
        }}
        onContextMenu={(e) => {
          e.preventDefault();
          onContextMenu(e, node);
        }}
      >
        {isFolder ? (
          <span
            className="w-3.5 shrink-0 flex items-center justify-center text-ex-dim"
            onClick={(e) => {
              e.stopPropagation();
              onToggle(node.id);
            }}
          >
            <ChevronRight
              size={12}
              strokeWidth={2.5}
              className={`text-ex-dim transition-transform duration-150${isExpanded ? " rotate-90" : ""}`}
            />
          </span>
        ) : (
          <span className="w-3.5 shrink-0 inline-block" />
        )}

        <span className="mr-1 shrink-0 flex items-center">
          {isFolder ? (
            isExpanded ? (
              <FolderOpen size={15} strokeWidth={1.5} className="text-yellow-400" />
            ) : (
              <Folder size={15} strokeWidth={1.5} className="text-yellow-500" />
            )
          ) : (
            <FileText size={14} strokeWidth={1.5} className="text-ex-muted" />
          )}
        </span>

        {isRenaming ? (
          <RenameInput
            value={node.name}
            onConfirm={onRenameConfirm}
            onCancel={onRenameCancel}
          />
        ) : (
          <span
            className={`text-[13px] font-sans font-normal whitespace-nowrap overflow-hidden text-ellipsis ${
              isSelected ? "text-ex-text" : "text-ex-muted"
            }`}
          >
            {node.name}
          </span>
        )}
      </div>

      {isFolder &&
        isExpanded &&
        node.children?.map((child) => (
          <FileTreeNode
            key={child.id}
            node={child}
            depth={depth + 1}
            selectedId={selectedId}
            expandedIds={expandedIds}
            onSelect={onSelect}
            onToggle={onToggle}
            onOpen={onOpen}
            onContextMenu={onContextMenu}
            renamingId={renamingId}
            onRenameConfirm={onRenameConfirm}
            onRenameCancel={onRenameCancel}
          />
        ))}
    </div>
  );
};

export default React.memo(FileTreeNode);
