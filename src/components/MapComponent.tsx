// /components/MapComponent.tsx
"use client";
import { useEffect, useRef } from "react";

type Marker = {
  position: { lat: number; lng: number };
  title?: string;
  info?: string;
};

export default function MapComponent({
  center = { lat: 20.5937, lng: 78.9629 },
  markers = [],
  zoom = 12,
}: {
  center?: { lat: number; lng: number };
  markers?: Marker[];
  zoom?: number;
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const loadScriptAndInit = async () => {
      if (!(window as any).google) {
        const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "YOUR_GOOGLE_MAPS_API_KEY";
        const s = document.createElement("script");
        s.src = `https://maps.googleapis.com/maps/api/js?key=${key}`;
        s.async = true;
        s.defer = true;
        document.head.appendChild(s);
        s.onload = init;
      } else {
        init();
      }
    };

    function init() {
      if (!ref.current) return;
      const map = new (window as any).google.maps.Map(ref.current, {
        center,
        zoom,
      });

      markers.forEach((m) => {
        const marker = new (window as any).google.maps.Marker({
          position: m.position,
          map,
          title: m.title,
        });
        if (m.info) {
          const infowindow = new (window as any).google.maps.InfoWindow({ content: m.info });
          marker.addListener("click", () => infowindow.open(map, marker));
        }
      });
    }

    loadScriptAndInit();
  }, [center, markers, zoom]);

  return <div ref={ref} style={{ width: "100%", height: "520px" }} className="rounded-md shadow-sm bg-gray-100" />;
}
