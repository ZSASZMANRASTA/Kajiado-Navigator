"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import { Town, Shop } from "@/lib/types";

interface MapComponentProps {
  towns: Town[];
  shops: Shop[];
  selectedTown: Town | null;
  onTownSelect: (town: Town) => void;
}

const ESRI_TILE_URL =
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
const ESRI_ATTRIBUTION =
  "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community";

const KAJIADO_CENTER: [number, number] = [-1.65, 36.75];
const DEFAULT_ZOOM = 10;

function createTownIcon(isSelected: boolean, shopCount: number) {
  const color = isSelected ? "#C36F48" : "#4F7942";
  const size = isSelected ? 18 : shopCount > 0 ? 14 : 10;
  const pulse = isSelected
    ? `<div style="
        position:absolute;
        top:50%;left:50%;
        transform:translate(-50%,-50%);
        width:${size + 10}px;height:${size + 10}px;
        border-radius:50%;
        border:2px solid ${color};
        opacity:0.4;
        animation:pulse 1.8s ease-out infinite;
      "></div>`
    : "";

  return L.divIcon({
    className: "",
    html: `
      <style>@keyframes pulse{0%{transform:translate(-50%,-50%) scale(0.8);opacity:0.6}100%{transform:translate(-50%,-50%) scale(1.8);opacity:0}}</style>
      <div style="position:relative;width:${size}px;height:${size}px">
        ${pulse}
        <div style="
          width:${size}px;height:${size}px;
          background:${color};
          border:2.5px solid white;
          border-radius:50%;
          box-shadow:0 2px 8px rgba(0,0,0,0.45);
          display:flex;align-items:center;justify-content:center;
          position:relative;
        ">${shopCount > 0 ? `<span style="color:white;font-size:${size > 12 ? 8 : 7}px;font-weight:700;font-family:system-ui">${shopCount}</span>` : ""}</div>
      </div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -(size / 2) - 4],
  });
}

export default function MapComponent({
  towns,
  shops,
  selectedTown,
  onTownSelect,
}: MapComponentProps) {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: KAJIADO_CENTER,
      zoom: DEFAULT_ZOOM,
      zoomControl: true,
    });

    L.tileLayer(ESRI_TILE_URL, {
      attribution: ESRI_ATTRIBUTION,
      maxZoom: 18,
    }).addTo(map);

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
      markersRef.current.clear();
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    markersRef.current.forEach((m) => m.remove());
    markersRef.current.clear();

    const safeShops = shops ?? [];

    towns.forEach((town) => {
      const isSelected = selectedTown?.id === town.id;
      const shopCount = safeShops.filter((s) => s.town_id === town.id).length;

      const marker = L.marker([town.latitude, town.longitude], {
        icon: createTownIcon(isSelected, shopCount),
        zIndexOffset: isSelected ? 1000 : 0,
      }).addTo(map);

      const popupContent = `
        <div style="font-family:system-ui,sans-serif;min-width:150px">
          <p style="font-weight:700;font-size:13px;margin:0 0 3px;color:#1f2937">${town.name}</p>
          <p style="font-size:11px;color:#6b7280;margin:0">
            ${shopCount > 0 ? `${shopCount} merchant${shopCount !== 1 ? "s" : ""}` : "No listings yet"}
          </p>
          <p style="font-size:10px;color:#C36F48;margin:4px 0 0;font-weight:600">Click to explore →</p>
        </div>
      `;
      marker.bindPopup(popupContent, {
        closeButton: false,
        offset: [0, -6],
        className: "kajiado-popup",
      });

      marker.on("mouseover", () => marker.openPopup());
      marker.on("click", () => {
        onTownSelect(town);
      });

      markersRef.current.set(town.id, marker);
    });
  }, [towns, shops, selectedTown, onTownSelect]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !selectedTown) return;

    map.flyTo([selectedTown.latitude, selectedTown.longitude], 13, {
      animate: true,
      duration: 1.4,
    });

    const marker = markersRef.current.get(selectedTown.id);
    if (marker) {
      setTimeout(() => marker.openPopup(), 900);
    }
  }, [selectedTown]);

  return (
    <>
      <style>{`
        .kajiado-popup .leaflet-popup-content-wrapper {
          border-radius: 10px !important;
          padding: 0 !important;
          box-shadow: 0 4px 24px rgba(0,0,0,0.18) !important;
          border: none !important;
        }
        .kajiado-popup .leaflet-popup-content {
          margin: 10px 14px !important;
        }
        .kajiado-popup .leaflet-popup-tip {
          display: none !important;
        }
        .leaflet-control-zoom {
          border: none !important;
          box-shadow: 0 2px 12px rgba(0,0,0,0.2) !important;
        }
        .leaflet-control-zoom a {
          border-radius: 8px !important;
          color: #374151 !important;
          font-weight: 600 !important;
        }
      `}</style>
      <div ref={containerRef} className="w-full h-full" style={{ zIndex: 0 }} />
    </>
  );
}
