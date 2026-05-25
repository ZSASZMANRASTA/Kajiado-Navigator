"use client";

import { MapPin, Menu, X } from "lucide-react";

interface NavbarProps {
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export default function Navbar({ sidebarOpen, onToggleSidebar }: NavbarProps) {
  return (
    <header
      className="fixed top-0 left-0 right-0 h-14 bg-savanna border-b border-ochre/20 flex items-center px-4 gap-3 shadow-sm"
      style={{ zIndex: 100 }}
    >
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-ochre flex items-center justify-center shrink-0">
          <MapPin className="w-4 h-4 text-white" />
        </div>
        <div>
          <h1 className="text-sm font-bold text-gray-800 leading-tight">
            Kajiado Directory
          </h1>
          <p className="text-[10px] text-gray-500 leading-tight">
            Virtual Stroll
          </p>
        </div>
      </div>

      <div className="ml-auto flex items-center gap-3">
        <span className="text-xs text-gray-500 hidden sm:block">
          Kajiado County, Kenya
        </span>
        <div className="w-2 h-2 rounded-full bg-acacia animate-pulse hidden sm:block" />
        {/* Mobile drawer toggle */}
        <button
          onClick={onToggleSidebar}
          className="md:hidden w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
          aria-label="Toggle directory"
        >
          {sidebarOpen ? (
            <X className="w-4 h-4 text-gray-700" />
          ) : (
            <Menu className="w-4 h-4 text-gray-700" />
          )}
        </button>
      </div>
    </header>
  );
}
