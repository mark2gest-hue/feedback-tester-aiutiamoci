import React from 'react';

interface RadarChartProps {
  baseScore: number;
  proScore: number;
  cyberScore: number;
  overallScore: number;
}

export const RadarChart: React.FC<RadarChartProps> = ({
  baseScore,
  proScore,
  cyberScore,
  overallScore,
}) => {
  // Dimensioni SVG: centro 150, 150 - raggio max 100
  const cx = 150;
  const cy = 150;
  const maxR = 95;

  // 4 assi:
  // 0: Nord (Base)
  // 1: Est (Pro)
  // 2: Sud (Cybersecurity)
  // 3: Ovest (Complessivo)
  const axes = [
    { label: 'AI Start (Base)', value: Math.max(10, Math.min(100, baseScore)), angle: -Math.PI / 2 },
    { label: 'AI Pro (Workflow)', value: Math.max(10, Math.min(100, proScore)), angle: 0 },
    { label: 'Cybersecurity', value: Math.max(10, Math.min(100, cyberScore)), angle: Math.PI / 2 },
    { label: 'Indice Globale', value: Math.max(10, Math.min(100, overallScore)), angle: Math.PI },
  ];

  // Helper per calcolare coordinate
  const getCoordinates = (angle: number, valuePercent: number) => {
    const r = (valuePercent / 100) * maxR;
    return {
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
    };
  };

  // Punti del poligono utente
  const pointsString = axes
    .map((axis) => {
      const { x, y } = getCoordinates(axis.angle, axis.value);
      return `${x},${y}`;
    })
    .join(' ');

  // Cerchi concentrici di guida (25%, 50%, 75%, 100%)
  const gridLevels = [25, 50, 75, 100];

  return (
    <div className="flex flex-col items-center">
      <svg className="w-72 h-72 md:w-80 md:h-80 overflow-visible" viewBox="0 0 300 300">
        {/* Griglie concentriche */}
        {gridLevels.map((lvl) => {
          const r = (lvl / 100) * maxR;
          return (
            <circle
              key={lvl}
              cx={cx}
              cy={cy}
              r={r}
              fill="none"
              stroke="#27272a"
              strokeDasharray={lvl < 100 ? '3,3' : undefined}
              strokeWidth="1"
            />
          );
        })}

        {/* Assi ortogonali */}
        {axes.map((axis, i) => {
          const outer = getCoordinates(axis.angle, 100);
          return (
            <line
              key={i}
              x1={cx}
              y1={cy}
              x2={outer.x}
              y2={outer.y}
              stroke="#3f3f46"
              strokeWidth="1"
            />
          );
        })}

        {/* Poligono di valutazione */}
        <polygon
          points={pointsString}
          fill="rgba(59, 130, 246, 0.25)"
          stroke="#3b82f6"
          strokeWidth="2.5"
          className="transition-all duration-700 ease-out"
        />

        {/* Punti sui vertici */}
        {axes.map((axis, i) => {
          const { x, y } = getCoordinates(axis.angle, axis.value);
          return (
            <g key={i}>
              <circle
                cx={x}
                cy={y}
                r="5"
                fill="#60a5fa"
                stroke="#09090b"
                strokeWidth="2"
              />
            </g>
          );
        })}

        {/* Etichette degli assi */}
        {axes.map((axis, i) => {
          const labelDist = maxR + 24;
          const lx = cx + labelDist * Math.cos(axis.angle);
          const ly = cy + labelDist * Math.sin(axis.angle);

          let anchor: 'middle' | 'start' | 'end' = 'middle';
          if (axis.angle === 0) anchor = 'start';
          if (axis.angle === Math.PI) anchor = 'end';

          return (
            <text
              key={i}
              x={lx}
              y={ly}
              textAnchor={anchor}
              alignmentBaseline="middle"
              className="text-[11px] font-medium fill-neutral-300 select-none"
            >
              {axis.label} ({axis.value}%)
            </text>
          );
        })}
      </svg>
    </div>
  );
};
