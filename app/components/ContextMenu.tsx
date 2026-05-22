"use client";
import React, { useRef, useEffect } from "react";

export interface ContextMenuItem {
  label?: string;
  icon?: React.ReactNode;
  action?: () => void;
  danger?: boolean;
  separator?: boolean;
}

interface ContextMenuProps {
  x: number;
  y: number;
  items: ContextMenuItem[];
  onClose: () => void;
}

const ContextMenu: React.FC<ContextMenuProps> = ({ x, y, items, onClose }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  return (
    <div
      ref={ref}
      style={{ position: "fixed", top: y, left: x }}
      className="z-9999 bg-ex-panel/95 backdrop-blur-md border border-ex-border2 rounded-lg p-1 min-w-40 shadow-[0_8px_40px_rgba(0,0,0,0.7)]"
    >
      {items.map((item, i) =>
        item.separator ? (
          <div key={i} className="h-px bg-[#2A3340] my-1" />
        ) : (
          <button
            key={i}
            className="flex items-center gap-2 w-full px-2.5 py-1.5 border-none bg-transparent rounded cursor-pointer text-[13px] font-sans text-left transition-colors duration-100 hover:bg-ex-hover"
            onClick={() => {
              item.action?.();
              onClose();
            }}
          >
            <span
              className={`flex items-center ${item.danger ? "text-ex-danger" : "text-ex-muted"}`}
            >
              {item.icon}
            </span>
            <span className={item.danger ? "text-ex-danger" : "text-[#CBD9E6]"}>
              {item.label}
            </span>
          </button>
        ),
      )}
    </div>
  );
};

export default ContextMenu;
