"use client";
import React, { useState, useRef } from "react";

interface RenameInputProps {
  value: string;
  onConfirm: (val: string) => void;
  onCancel: () => void;
}

const RenameInput: React.FC<RenameInputProps> = ({
  value,
  onConfirm,
  onCancel,
}) => {
  const [val, setVal] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <input
      ref={inputRef}
      className="bg-ex-bg border border-ex-accent rounded text-ex-text text-[13px] font-sans outline-none px-1.5 py-px w-30"
      value={val}
      autoFocus
      onFocus={(e) => e.currentTarget.select()}
      onChange={(e) => setVal(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") onConfirm(val.trim() || value);
        if (e.key === "Escape") onCancel();
      }}
      onBlur={() => onConfirm(val.trim() || value)}
    />
  );
};

export default RenameInput;
