import { UtensilsCrossed } from "lucide-react";

const NODES = [
  { x: 200, y: 40 },
  { x: 335, y: 115 },
  { x: 335, y: 285 },
  { x: 200, y: 360 },
  { x: 65, y: 285 },
  { x: 65, y: 115 },
];

export default function HeroGraphic() {
  return (
    <svg viewBox="0 0 400 400" className="h-full w-full" aria-hidden="true">
      <defs>
        <radialGradient id="hero-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle cx="200" cy="200" r="140" fill="url(#hero-glow)" />

      {NODES.map((node, i) => {
        const midX = 200 + (node.x - 200) * 0.55;
        const midY = 200 + (node.y - 200) * 0.55;
        return (
          <g key={i}>
            <line x1="200" y1="200" x2={node.x} y2={node.y} stroke="white" strokeOpacity="0.35" strokeWidth="1.5" />
            <circle cx={midX} cy={midY} r="3" fill="white" fillOpacity="0.5" />
            <circle cx={node.x} cy={node.y} r="6" fill="white" />
          </g>
        );
      })}

      <circle cx="200" cy="200" r="46" fill="white" />
      <foreignObject x="176" y="176" width="48" height="48">
        <div className="flex h-12 w-12 items-center justify-center text-emerald-600">
          <UtensilsCrossed className="h-6 w-6" />
        </div>
      </foreignObject>
    </svg>
  );
}
