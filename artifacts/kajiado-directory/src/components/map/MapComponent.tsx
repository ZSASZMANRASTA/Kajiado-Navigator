"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import { Town } from "@/lib/types";

interface MapComponentProps {
  towns: Town[];
  selectedTown: Town | null;
  onTownSelect: (town: Town) => void;
}

const ESRI_TILE_URL =
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
const ESRI_ATTRIBUTION =
  "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community";

const KAJIADO_CENTER: [number, number] = [-1.65, 36.75];
const DEFAULT_ZOOM = 10;

function createTownIcon(isSelected: boolean) {
  const color = isSelected ? "#C36F48" : "#4F7942";
  const size = isSelected ? 16 : 12;
  return L.divIcon({
    className: "",
    html: `<div style="
      width:${size}px;height:${size}px;
      background:${color};
      border:2px solid white;
      border-radius:50%;
      box-shadow:0 2px 6px rgba(0,0,0,0.4);
      transition:all 0.2s ease;
    "></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

export default function MapComponent({
  towns,
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

    towns.forEach((town) => {
      const isSelected = selectedTown?.id === town.id;
      const marker = L.marker([town.latitude, town.longitude], {
        icon: createTownIcon(isSelected),
      }).addTo(map);

      const popupContent = `
        <div style="font-family:system-ui,sans-serif;min-width:140px">
          <p style="font-weight:700;font-size:14px;margin:0 0 4px">${town.name}</p>
          <p style="font-size:12px;color:#666;margin:0">${town.shop_count} merchant${town.shop_count !== 1 ? "s" : ""}</p>
        </div>
      `;
      marker.bindPopup(popupContent, { closeButton: false, offset: [0, -8] });

      marker.on("click", () => {
        onTownSelect(town);
      });

      markersRef.current.set(town.id, marker);
    });
  }, [towns, selectedTown, onTownSelect]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !selectedTown) return;

    map.flyTo([selectedTown.latitude, selectedTown.longitude], 13, {
      animate: true,
      duration: 1.4,
    });

    const marker = markersRef.current.get(selectedTown.id);
    if (marker) {
      setTimeout(() => marker.openPopup(), 800);
    }
  }, [selectedTown]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full"
      style={{ zIndex: 0 }}
    />
  );
}
