"use client";

import { KeyboardEvent, useEffect, useId, useMemo, useRef, useState } from "react";

export type LocationChoice = { id: string; en: string; bn: string };

type Props = {
  label: string;
  placeholder: string;
  searchPlaceholder: string;
  options: LocationChoice[];
  value: string;
  onChange: (id: string) => void;
  disabled?: boolean;
  required?: boolean;
  emptyText: string;
};

function display(option: LocationChoice) {
  return `${option.en} (${option.bn})`;
}

export function LocationSearchSelect({ label, placeholder, searchPlaceholder, options, value, onChange, disabled, required, emptyText }: Props) {
  const inputId = useId();
  const root = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const selected = options.find((option) => option.id === value);
  const matches = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase();
    if (!normalized) return options;
    return options.filter((option) => `${option.en} ${option.bn}`.toLocaleLowerCase().includes(normalized));
  }, [options, query]);

  useEffect(() => {
    function close(event: MouseEvent) {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  function select(option: LocationChoice) {
    onChange(option.id);
    setQuery("");
    setOpen(false);
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") { event.preventDefault(); setOpen(true); setActive((index) => Math.min(index + 1, Math.max(matches.length - 1, 0))); }
    if (event.key === "ArrowUp") { event.preventDefault(); setOpen(true); setActive((index) => Math.max(index - 1, 0)); }
    if (event.key === "Enter" && open && matches[active]) { event.preventDefault(); select(matches[active]); }
    if (event.key === "Escape") setOpen(false);
  }

  return <div className="relative" ref={root}>
    <label htmlFor={inputId} className="block text-sm font-semibold">{label}{required ? <span className="ml-1 text-red-700" aria-hidden="true">*</span> : null}</label>
    <input
      id={inputId}
      type="text"
      role="combobox"
      aria-autocomplete="list"
      aria-expanded={open}
      aria-controls={`${inputId}-listbox`}
      aria-required={required}
      disabled={disabled}
      value={open ? query : (selected ? display(selected) : "")}
      placeholder={disabled ? "Select district first" : placeholder}
      onFocus={() => { if (!disabled) setOpen(true); }}
      onChange={(event) => { setQuery(event.target.value); setOpen(true); setActive(0); }}
      onKeyDown={onKeyDown}
      className="mt-2 w-full border border-[#0b1830]/20 bg-white px-3 py-3 outline-none placeholder:text-[#68758a] focus:border-[#b38b45] focus:ring-2 focus:ring-[#b38b45]/20 disabled:cursor-not-allowed disabled:bg-[#f0f1f3]"
    />
    {open && !disabled ? <div id={`${inputId}-listbox`} role="listbox" className="absolute z-30 mt-1 max-h-56 w-full overflow-y-auto border border-[#0b1830]/20 bg-white py-1 shadow-xl">
      <div className="sticky top-0 border-b border-[#0b1830]/10 bg-[#fffdf8] px-3 py-2 text-xs text-[#40506b]">{searchPlaceholder}</div>
      {matches.length ? matches.map((option, index) => <button key={option.id} type="button" role="option" aria-selected={option.id === value} onMouseDown={(event) => event.preventDefault()} onClick={() => select(option)} className={`block w-full px-3 py-2 text-left text-sm hover:bg-[#f7f0e4] focus:bg-[#f7f0e4] ${index === active ? "bg-[#f7f0e4]" : ""}`}>
        <span className="font-semibold text-[#09172e]">{option.en}</span><span className="ml-1 text-[#40506b]">({option.bn})</span>
      </button>) : <p className="px-3 py-4 text-sm text-[#68758a]">{emptyText}</p>}
    </div> : null}
  </div>;
}
