"use client";
import { useState, useCallback, useMemo, useEffect } from "react";
import FileTreeNode from "./FileTreeNode";
import ContextMenu from "./ContextMenu";
import { NewItemDialog, DeleteDialog } from "./shared";
import TextEditor from "./TextEditor";
import { Plus, Pencil, Trash2, Menu, X } from "lucide-react";
import type { ContextMenuItem } from "./ContextMenu";
import type { FileNode } from "./types";
import {
  uid,
  findNode,
  findParent,
  cloneTree,
  initialFS,
  loadFS,
  saveFS,
} from "../lib/fsUtils";

interface ContextMenuState {
  x: number;
  y: number;
  node: FileNode;
}

export default function FileExplorer() {
  const [fs, setFs] = useState<FileNode>(() => cloneTree(initialFS));
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(
    () => new Set(["root", "f1", "f2"]),
  );
  const [storageLoaded, setStorageLoaded] = useState(false);

  // Runs only on the client after first render — safe to read localStorage
  useEffect(() => {
    setFs(loadFS());
    try {
      const s = localStorage.getItem("webb_expanded");
      if (s) setExpandedIds(new Set(JSON.parse(s)));
    } catch {}
    setStorageLoaded(true);
  }, []);

  // Only persist after the initial load so we never overwrite storage with defaults
  useEffect(() => {
    if (!storageLoaded) return;
    localStorage.setItem("webb_expanded", JSON.stringify([...expandedIds]));
  }, [storageLoaded, expandedIds]);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [openFileId, setOpenFileId] = useState<string | null>(null);
  const [newItemFor, setNewItemFor] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<FileNode | null>(null);
  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const persist = useCallback((tree: FileNode) => {
    setFs(tree);
    saveFS(tree);
  }, []);

  // Derived — memoised to avoid traversing the tree on every render
  const openFile = useMemo(
    () => (openFileId ? findNode(fs, openFileId) : null),
    [fs, openFileId],
  );

  const toggleExpand = useCallback((id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const handleOpenFile = useCallback((node: FileNode) => {
    if (node.type === "file") {
      setOpenFileId(node.id);
      setSidebarOpen(false);
    }
  }, []);

  // e.preventDefault() is already called by FileTreeNode before this fires
  const handleContextMenu = useCallback(
    (e: React.MouseEvent, node: FileNode) => {
      if (node.id === "root") return;
      setContextMenu({ x: e.clientX, y: e.clientY, node });
    },
    [],
  );

  const handleRenameCancel = useCallback(() => setRenamingId(null), []);

  const handleCreate = useCallback(
    (type: "folder" | "file", name: string) => {
      if (!newItemFor) return;
      setNewItemFor(null);
      const newNode: FileNode =
        type === "folder"
          ? { id: uid(), name, type: "folder", children: [] }
          : { id: uid(), name, type: "file", content: "" };
      const tree = cloneTree(fs);
      const target = findNode(tree, newItemFor);
      if (target?.type === "folder") {
        target.children!.push(newNode);
        setExpandedIds((prev) => new Set([...prev, newItemFor]));
        persist(tree);
      }
    },
    [fs, newItemFor, persist],
  );

  const handleRenameConfirm = useCallback(
    (newName: string) => {
      const id = renamingId;
      setRenamingId(null);
      if (!newName || !id) return;
      const tree = cloneTree(fs);
      const node = findNode(tree, id);
      if (node) {
        node.name = newName;
        persist(tree);
      }
    },
    [fs, renamingId, persist],
  );

  const handleDelete = useCallback(() => {
    if (!deleteTarget) return;
    const { id } = deleteTarget;
    setDeleteTarget(null);
    const tree = cloneTree(fs);
    const parent = findParent(tree, id);
    if (parent) {
      parent.children = parent.children!.filter((c) => c.id !== id);
      persist(tree);
      if (selectedId === id) setSelectedId(null);
      if (openFileId === id) setOpenFileId(null);
    }
  }, [fs, deleteTarget, selectedId, openFileId, persist]);

  const handleSaveFile = useCallback(
    (content: string) => {
      if (!openFileId) return;
      const tree = cloneTree(fs);
      const node = findNode(tree, openFileId);
      if (node) {
        node.content = content;
        persist(tree);
      }
    },
    [fs, openFileId, persist],
  );

  const buildContextMenuItems = useCallback(
    (node: FileNode): ContextMenuItem[] => {
      const isFolder = node.type === "folder";
      return [
        ...(isFolder
          ? [
              {
                label: "New item here",
                icon: <Plus size={12} strokeWidth={2} />,
                action: () => {
                  setSelectedId(node.id);
                  setExpandedIds((prev) => new Set([...prev, node.id]));
                  setNewItemFor(node.id);
                },
              },
              { separator: true } as ContextMenuItem,
            ]
          : []),
        {
          label: "Rename",
          icon: <Pencil size={12} strokeWidth={1.5} />,
          action: () => setRenamingId(node.id),
        },
        { separator: true } as ContextMenuItem,
        {
          label: "Delete",
          icon: <Trash2 size={12} strokeWidth={1.5} />,
          danger: true,
          action: () => setDeleteTarget(node),
        },
      ];
    },
    [],
  );

  return (
    <div className="flex flex-col h-screen bg-ex-bg overflow-hidden">

      {/* ── Titlebar ── */}
      <header className="flex items-center justify-between px-5 h-11 bg-ex-surface border-b border-ex-border shrink-0">
        <div className="flex items-center gap-3">
          <button
            className="flex items-center justify-center text-ex-muted hover:text-ex-text transition-colors duration-150 md:hidden"
            onClick={() => setSidebarOpen((s) => !s)}
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? <X size={14} strokeWidth={2} /> : <Menu size={16} strokeWidth={1.5} />}
          </button>
          <div className="flex items-center gap-2 font-sans font-bold text-sm tracking-[0.08em] text-ex-text">
            <div className="w-1.5 h-1.5 rounded-full bg-ex-accent shadow-[0_0_8px_#3D8BFF]" />
            WEBB EXPLORER
          </div>
        </div>
        <div className="font-mono text-[11px] text-ex-dim tracking-wider hidden sm:block">
          Webbly Media · v1.0.0
        </div>
      </header>

      {/* ── Body ── */}
      <div className="flex flex-1 overflow-hidden relative">

        {/* Mobile backdrop */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/50 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* ── Sidebar / Explorer ── */}
        <aside
          className={`
            fixed inset-y-0 left-0 z-50 w-72 flex flex-col
            bg-ex-surface border-r border-ex-border overflow-hidden shrink-0
            transition-transform duration-300
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
            md:relative md:inset-auto md:w-64 md:translate-x-0 md:z-auto
          `}
        >
          <div className="flex items-center justify-between px-3 py-2.5 border-b border-ex-border shrink-0">
            <span className="text-[11px] font-semibold tracking-widest uppercase text-ex-dim font-mono">
              Explorer
            </span>
            <button
              className="flex items-center justify-center w-6 h-6 rounded border border-transparent text-ex-muted cursor-pointer transition-all duration-150 hover:bg-ex-hover hover:border-ex-border2 hover:text-ex-text"
              title="New item in root"
              onClick={() => setNewItemFor("root")}
            >
              <Plus size={12} strokeWidth={2} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto py-1.5 scrollbar-thin">
            {fs.children?.map((node) => (
              <FileTreeNode
                key={node.id}
                node={node}
                depth={0}
                selectedId={selectedId}
                expandedIds={expandedIds}
                onSelect={setSelectedId}
                onToggle={toggleExpand}
                onOpen={handleOpenFile}
                onContextMenu={handleContextMenu}
                renamingId={renamingId}
                onRenameConfirm={handleRenameConfirm}
                onRenameCancel={handleRenameCancel}
              />
            ))}
          </div>
        </aside>

        {/* ── Editor / Empty state ── */}
        {openFile ? (
          <TextEditor
            key={openFile.id}
            file={openFile}
            onSave={handleSaveFile}
            onClose={() => setOpenFileId(null)}
          />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 text-ex-dim select-none">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <path
                d="M8 10a2 2 0 012-2h8l4 4h10a2 2 0 012 2v14a2 2 0 01-2 2H10a2 2 0 01-2-2V10z"
                stroke="#2E3F52"
                strokeWidth="1.5"
                fill="none"
              />
              <path
                d="M15 21h10M15 25h6"
                stroke="#2E3F52"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            <p className="text-[13px] font-mono text-center leading-relaxed">
              Double-click a file to open it
            </p>
          </div>
        )}
      </div>

      {/* ── Modals ── */}
      {newItemFor && (
        <NewItemDialog
          onConfirm={handleCreate}
          onCancel={() => setNewItemFor(null)}
        />
      )}

      {deleteTarget && (
        <DeleteDialog
          node={deleteTarget}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          items={buildContextMenuItems(contextMenu.node)}
          onClose={() => setContextMenu(null)}
        />
      )}
    </div>
  );
}
