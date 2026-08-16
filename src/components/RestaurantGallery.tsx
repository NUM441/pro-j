"use client";

import Image from "next/image";
import { useState } from "react";

type Props = {
  restaurantName: string;
  coverUrl: string;
  foodUrls: string[];
};

export default function RestaurantGallery({ restaurantName, coverUrl, foodUrls }: Props) {
  const images = [coverUrl, ...foodUrls];
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  function close() {
    setOpenIndex(null);
  }

  function showPrev(e: React.MouseEvent) {
    e.stopPropagation();
    setOpenIndex((i) => (i === null ? null : (i - 1 + images.length) % images.length));
  }

  function showNext(e: React.MouseEvent) {
    e.stopPropagation();
    setOpenIndex((i) => (i === null ? null : (i + 1) % images.length));
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpenIndex(0)}
        className="relative h-64 w-full cursor-zoom-in overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800"
      >
        <Image src={coverUrl} alt={restaurantName} fill className="object-cover" unoptimized />
      </button>

      {foodUrls.length > 0 && (
        <div>
          <h2 className="mb-3 text-lg font-semibold text-slate-900 dark:text-slate-50">รูปอาหาร</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {foodUrls.map((url, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setOpenIndex(i + 1)}
                className="relative aspect-square cursor-zoom-in overflow-hidden rounded-lg border border-slate-200 dark:border-slate-800"
              >
                <Image
                  src={url}
                  alt={`${restaurantName} รูปอาหาร ${i + 1}`}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {openIndex !== null && (
        <div
          onClick={close}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
        >
          <button
            type="button"
            onClick={close}
            className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/40 bg-white/10 text-2xl text-white hover:bg-white/20"
            aria-label="ปิด"
          >
            ×
          </button>

          {images.length > 1 && (
            <button
              type="button"
              onClick={showPrev}
              className="absolute left-2 flex h-10 w-10 items-center justify-center rounded-full border border-white/40 bg-white/10 text-2xl text-white hover:bg-white/20 sm:left-4"
              aria-label="รูปก่อนหน้า"
            >
              ‹
            </button>
          )}

          <div className="relative h-full max-h-[85vh] w-full max-w-3xl" onClick={(e) => e.stopPropagation()}>
            <Image
              src={images[openIndex]}
              alt={`${restaurantName} รูปที่ ${openIndex + 1}`}
              fill
              className="object-contain"
              unoptimized
            />
          </div>

          {images.length > 1 && (
            <button
              type="button"
              onClick={showNext}
              className="absolute right-2 flex h-10 w-10 items-center justify-center rounded-full border border-white/40 bg-white/10 text-2xl text-white hover:bg-white/20 sm:right-4"
              aria-label="รูปถัดไป"
            >
              ›
            </button>
          )}
        </div>
      )}
    </>
  );
}
