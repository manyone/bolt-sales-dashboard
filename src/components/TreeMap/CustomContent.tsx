import React from 'react';
import { GRADIENTS } from '../../constants/colors';
import { CustomContentProps } from '../../types/treemap';

export const CustomContent: React.FC<CustomContentProps> = ({
  depth,
  x,
  y,
  width,
  height,
  name,
  category,
  region,
}) => {
  // Handle root node
  if (depth < 1) {
    return (
      <g>
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          style={{
            fill: '#fff',
            stroke: '#fff',
            strokeWidth: 2,
            strokeOpacity: 1,
          }}
        />
      </g>
    );
  }

  // Handle category and region nodes
  const isRegionNode = depth === 2 && region && category;
  const isCategoryNode = depth === 1 && category;
  
  const gradientId = isRegionNode ? `${category}-${region}-gradient` : '';
  const fillColor = isRegionNode && category && region
    ? `url(#${gradientId})`
    : isCategoryNode && category
    ? GRADIENTS[category].Central[0]
    : '#fff';

  return (
    <g>
      {isRegionNode && category && region && (
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
            <stop
              offset="0%"
              stopColor={GRADIENTS[category][region][0]}
            />
            <stop
              offset="100%"
              stopColor={GRADIENTS[category][region][1]}
            />
          </linearGradient>
        </defs>
      )}
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        style={{
          fill: fillColor,
          stroke: '#fff',
          strokeWidth: 2 / (depth + 1e-10),
          strokeOpacity: 1 / (depth + 1e-10),
        }}
      />
      {width > 50 && height > 30 && (
        <text
          x={x + width / 2}
          y={y + height / 2}
          textAnchor="middle"
          fill="#fff"
          fontSize={14}
          style={{
            filter: 'drop-shadow(1px 1px 1px rgba(0,0,0,0.5))'
          }}
        >
          {name}
        </text>
      )}
    </g>
  );
};