"use client";

import { MapPin } from "lucide-react";

export default function Navbar() {
  return (
    <header
      className="fixed top-0 left-0 right-0 h-14 bg-savanna border-b border-ochre/20 flex items-center px-5 gap-3 shadow-sm"
      style={{ zIndex: 50 }}
    >
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-ochre flex items-center justify-center">
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
      <div className="ml-auto flex items-center gap-2">
        <span className="text-xs text-gray-500 hidden sm:block">
          Kajiado County, Kenya
        </span>
        <div className="w-2 h-2 rounded-full bg-acacia animate-pulse" />
      </div>
    </header>
  );
}
