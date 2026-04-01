"use client";

import { useState, useEffect } from "react";

interface ImageData {
  data: string;
}

export function GlobalBackground() {
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("oshi-schedule-oshi");
      if (!raw) return;
      const oshiList = JSON.parse(raw) as {
        image?: string;
        images?: ImageData[];
      }[];
      const imgs: string[] = [];
      oshiList.forEach((oshi) => {
        if (oshi.image) imgs.push(oshi.image);
        if (oshi.images) oshi.images.forEach((img) => imgs.push(img.data));
      });
      setImages(imgs);
    } catch {
      /* ignore */
    }
  }, []);

  return null;
}
