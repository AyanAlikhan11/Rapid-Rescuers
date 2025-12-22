"use client";

type Marker = {
  position: { lat: number; lng: number };
};

interface Props {
  center: { lat: number; lng: number };
  zoom?: number;
  satellite?: boolean;
}

export default function MapComponent({
  center,
  zoom = 13,
  satellite = false,
}: Props) {
  const mapType = satellite ? "k" : "m"; // k = satellite

  const src = `https://www.google.com/maps?q=${center.lat},${center.lng}&z=${zoom}&t=${mapType}&output=embed`;

  return (
    <iframe
      src={src}
      className="w-full h-full rounded-xl"
      loading="lazy"
    />
  );
}
