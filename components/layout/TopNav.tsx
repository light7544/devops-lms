"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Search, Menu, X, GitBranch, ChevronDown, UserPlus, Trash2, Check, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchDialog } from "./SearchDialog";
import { useProfile } from "@/lib/hooks/useProfile";
import { useTheme } from "@/lib/hooks/useTheme";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface TopNavProps {
  onSidebarToggle: () => void;
  sidebarOpen: boolean;
}

export function TopNav({ onSidebarToggle, sidebarOpen }: TopNavProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newBio, setNewBio] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  const { profiles, activeProfile, setActiveProfile, createProfile, deleteProfile } = useProfile();
  const { theme, toggleTheme } = useTheme();

  // Global keyboard shortcut for search
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    if (createOpen) setTimeout(() => nameInputRef.current?.focus(), 50);
  }, [createOpen]);

  const handleCreate = () => {
    if (!newName.trim()) return;
    const profile = createProfile(newName, newBio);
    setActiveProfile(profile);
    setNewName("");
    setNewBio("");
    setCreateOpen(false);
    setDropdownOpen(false);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirmDelete === id) {
      deleteProfile(id);
      setConfirmDelete(null);
    } else {
      setConfirmDelete(id);
    }
  };

  return (
    <>
      <header className="h-14 border-b border-zinc-800 flex items-center gap-3 px-4 bg-zinc-950 sticky top-0 z-40 shrink-0">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0 mr-2">
          <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center">
            <GitBranch className="h-4 w-4 text-white" />
          </div>
          <span className="font-semibold text-sm text-white hidden sm:block">DevOps Learn</span>
        </Link>

        {/* Sidebar toggle */}
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onSidebarToggle}
          className="text-zinc-500"
          aria-label="Toggle sidebar"
        >
          {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>

        {/* Search bar */}
        <button
          onClick={() => setSearchOpen(true)}
          className="flex-1 max-w-sm flex items-center gap-2 px-3 h-8 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 rounded-lg text-sm text-zinc-500 transition-colors group"
        >
          <Search className="h-3.5 w-3.5 shrink-0" />
          <span className="flex-1 text-left text-xs truncate">Search lessons…</span>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 text-[10px] text-zinc-600 font-mono">
            <span>⌘</span><span>K</span>
          </kbd>
        </button>

        <div className="flex-1" />

        {/* Theme toggle */}
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={toggleTheme}
          className="text-zinc-500 hover:text-zinc-300"
          aria-label="Toggle theme"
          title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        >
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>

        {/* Profile switcher */}
        <DropdownMenu
          open={dropdownOpen}
          onOpenChange={(open) => {
            setDropdownOpen(open);
            if (!open) {
              setCreateOpen(false);
              setConfirmDelete(null);
              setNewName("");
              setNewBio("");
            }
          }}
        >
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-2 h-8 text-zinc-300 hover:text-white">
              {activeProfile ? (
                <>
                  <div className="h-6 w-6 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-[10px] font-bold text-white shrink-0">
                    {activeProfile.avatar}
                  </div>
                  <span className="hidden sm:block text-xs">{activeProfile.name}</span>
                </>
              ) : (
                <div className="h-6 w-6 rounded-full bg-zinc-700 shrink-0" />
              )}
              <ChevronDown className="h-3 w-3 text-zinc-600" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="w-56 bg-zinc-900 border-zinc-800"
            onCloseAutoFocus={(e) => e.preventDefault()}
          >
            <DropdownMenuLabel className="text-xs text-zinc-500 font-normal">Profiles</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-zinc-800" />

            {profiles.map((profile) => (
              <DropdownMenuItem
                key={profile.id}
                onClick={() => {
                  setActiveProfile(profile);
                  setDropdownOpen(false);
                }}
                className="flex items-center gap-2 text-sm cursor-pointer hover:bg-zinc-800 focus:bg-zinc-800 pr-2 group/item"
              >
                <div className="h-6 w-6 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-[10px] font-bold text-white shrink-0">
                  {profile.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-zinc-200 text-xs truncate">{profile.name}</div>
                  <div className="text-zinc-600 text-[10px] truncate">{profile.bio}</div>
                </div>
                {activeProfile?.id === profile.id && (
                  <div className="h-1.5 w-1.5 rounded-full bg-green-500 shrink-0" />
                )}
                <button
                  onClick={(e) => handleDelete(profile.id, e)}
                  title={confirmDelete === profile.id ? "Click again to confirm" : "Delete profile"}
                  className={cn(
                    "ml-1 p-1 rounded transition-all shrink-0",
                    confirmDelete === profile.id
                      ? "text-red-400 bg-red-900/30 opacity-100"
                      : "text-zinc-600 hover:text-red-400 hover:bg-red-900/20 opacity-0 group-hover/item:opacity-100"
                  )}
                >
                  {confirmDelete === profile.id ? (
                    <Trash2 className="h-3 w-3" />
                  ) : (
                    <Trash2 className="h-3 w-3" />
                  )}
                </button>
              </DropdownMenuItem>
            ))}

            <DropdownMenuSeparator className="bg-zinc-800" />

            {/* Create new profile */}
            {createOpen ? (
              <div className="px-2 py-2 space-y-2" onClick={(e) => e.stopPropagation()}>
                <input
                  ref={nameInputRef}
                  type="text"
                  placeholder="Name"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") handleCreate(); if (e.key === "Escape") setCreateOpen(false); }}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded px-2 py-1.5 text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-blue-500"
                />
                <input
                  type="text"
                  placeholder="Role / bio (optional)"
                  value={newBio}
                  onChange={(e) => setNewBio(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") handleCreate(); if (e.key === "Escape") setCreateOpen(false); }}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded px-2 py-1.5 text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-blue-500"
                />
                <div className="flex gap-1.5">
                  <button
                    onClick={handleCreate}
                    disabled={!newName.trim()}
                    className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-medium transition-colors"
                  >
                    <Check className="h-3 w-3" />
                    Create
                  </button>
                  <button
                    onClick={() => { setCreateOpen(false); setNewName(""); setNewBio(""); }}
                    className="px-3 py-1.5 rounded text-zinc-500 hover:text-zinc-300 text-xs transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <DropdownMenuItem
                onClick={(e) => { e.preventDefault(); setCreateOpen(true); }}
                className="flex items-center gap-2 text-xs text-zinc-400 hover:text-zinc-200 cursor-pointer hover:bg-zinc-800 focus:bg-zinc-800"
              >
                <UserPlus className="h-3.5 w-3.5" />
                New Profile
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
}
