"use client";

import { useState } from "react";

const BLOOD_CELLS_COUNT = 30;

type CellStyle = {
  left: string;
  width: string;
  height: string;
  animationDuration: string;
  animationDelay: string;
  opacity: number;
};

export default function FloatingBloodCells() {
  const [cells] = useState<CellStyle[]>(() =>
    Array.from({ length: BLOOD_CELLS_COUNT }).map(() => ({
      left: `${Math.random() * 200}%`,
      width: `${8 + Math.random() * 14}px`,
      height: `${8 + Math.random() * 14}px`,
      animationDuration: `${20 + Math.random() * 50}s`,
      animationDelay: `${Math.random() * 0.1}s`,
      opacity: 0.5 + Math.random() * 0.4,
    }))
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {cells.map((style, i) => (
        <span key={i} className="blood-cell" style={style} />
      ))}
    </div>
  );
}
