// Appearances gallery for Daredevil — tabbed grid of comics, TV, film.
'use client';

import { useState } from 'react';
import Image from 'next/image';

type Item = { title: string; image: string };
type Tab = 'comics' | 'tv' | 'film';

const data: Record<Tab, Item[]> = {
  comics: [
    { title: 'Daredevil #1 (1964)', image: 'https://upload.wikimedia.org/wikipedia/en/thumb/3/39/Daredevil_Vol_1_1.jpg/250px-Daredevil_Vol_1_1.jpg' },
    { title: 'Born Again (1986)', image: 'https://upload.wikimedia.org/wikipedia/en/thumb/5/5c/Daredevil_Born_Again.jpg/250px-Daredevil_Born_Again.jpg' },
    { title: 'The Man Without Fear (1993)', image: 'https://upload.wikimedia.org/wikipedia/en/thumb/8/8e/Daredevil_Man_Without_Fear.jpg/250px-Daredevil_Man_Without_Fear.jpg' },
  ],
  tv: [
    { title: 'Daredevil S1 (2015)', image: 'https://upload.wikimedia.org/wikipedia/en/thumb/6/6e/Daredevil_Season_1.jpg/250px-Daredevil_Season_1.jpg' },
    { title: 'Daredevil S2 (2016)', image: 'https://upload.wikimedia.org/wikipedia/en/thumb/a/a6/Daredevil_season_2.jpg/250px-Daredevil_season_2.jpg' },
    { title: 'Daredevil S3 (2018)', image: 'https://upload.wikimedia.org/wikipedia/en/thumb/3/3e/Daredevil_Season_3.jpg/250px-Daredevil_Season_3.jpg' },
    { title: 'Born Again S1 (2025)', image: 'https://upload.wikimedia.org/wikipedia/en/thumb/8/8c/Daredevil_Born_Again_Season_1.jpg/250px-Daredevil_Born_Again_Season_1.jpg' },
  ],
  film: [
    { title: 'Daredevil (2003)', image: 'https://upload.wikimedia.org/wikipedia/en/7/70/Daredevil_film.jpg' },
  ],
};

const tabs: Tab[] = ['comics', 'tv', 'film'];
const tabLabels: Record<Tab, string> = { comics: 'Comics', tv: 'TV', film: 'Film' };

// Renders image with a fallback div if the URL 404s
function SafeImage({ src, alt, surfaceColor, title }: { src: string; alt: string; surfaceColor: string; title: string }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        style={{ backgroundColor: surfaceColor }}
        className="w-full aspect-square flex items-center justify-center p-3"
      >
        <span className="text-[0.5rem] text-center leading-relaxed text-[#555]">{title}</span>
      </div>
    );
  }

  return (
    <div className="w-full aspect-square relative overflow-hidden">
      <Image src={src} alt={alt} fill className="object-cover" onError={() => setFailed(true)} />
    </div>
  );
}

type Props = {
  accentColor: string;
  surfaceColor: string;
  mutedColor: string;
  borderColor: string;
};

export function AppearancesGallery({ accentColor, surfaceColor, mutedColor, borderColor }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('comics');

  return (
    <div>
      {/* Tab row */}
      <div className="flex gap-6 mb-8" style={{ borderBottom: `1px solid ${borderColor}` }}>
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={
              activeTab === tab
                ? { color: accentColor, borderBottom: `1px solid ${accentColor}`, marginBottom: '-1px', paddingBottom: '12px' }
                : { color: mutedColor, paddingBottom: '12px' }
            }
            className="mono text-[0.56rem] tracking-[0.26em] uppercase transition-colors duration-200 bg-transparent border-0 cursor-pointer"
          >
            {tabLabels[tab]}
          </button>
        ))}
      </div>

      {/* Card grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {data[activeTab].map((item) => (
          <div key={item.title} className="border p-2" style={{ borderColor }}>
            <SafeImage src={item.image} alt={item.title} surfaceColor={surfaceColor} title={item.title} />
            <p className="text-[0.6rem] mt-2 leading-tight" style={{ color: mutedColor }}>
              {item.title}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
