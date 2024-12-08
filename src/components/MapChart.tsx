import React from 'react';
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from 'react-simple-maps';
import { scaleLinear } from 'd3-scale';
import { SalesData } from '../types/data';
import { stateCoordinates } from '../constants/stateCoordinates';
import { geoUrl } from '../constants/topology';
import { COLORS } from '../constants/colors';

interface Props {
  data: SalesData[];
  isDark: boolean;
}

const StatePieChart: React.FC<{
  data: { name: string; value: number }[];
  size: number;
  stateCode: string;
  onHover: (content: string | null, x: number, y: number) => void;
}> = ({ data, size, stateCode, onHover }) => {
  const radius = size / 2 - 2;
  const total = data.reduce((sum, entry) => sum + entry.value, 0);
  let startAngle = 0;
  const [hoveredCategory, setHoveredCategory] = React.useState<string | null>(null);

  return (
    <g transform={`translate(-${size/2},-${size/2})`}>
      <circle
        cx={size/2}
        cy={size/2}
        r={radius}
        fill="white"
        stroke="#fff"
        strokeWidth={1}
      />
      {data.map((entry) => {
        const angle = (entry.value / total) * 360;
        const endAngle = startAngle + angle;
        
        // Calculate arc path
        const startRad = (startAngle * Math.PI) / 180;
        const endRad = (endAngle * Math.PI) / 180;
        const x1 = size/2 + radius * Math.cos(startRad);
        const y1 = size/2 + radius * Math.sin(startRad);
        const x2 = size/2 + radius * Math.cos(endRad);
        const y2 = size/2 + radius * Math.sin(endRad);
        
        const largeArc = angle > 180 ? 1 : 0;
        
        const pathData = [
          `M ${size/2} ${size/2}`,
          `L ${x1} ${y1}`,
          `A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`,
          'Z'
        ].join(' ');
        
        const path = (
          <path
            key={entry.name}
            d={pathData}
            fill={hoveredCategory === entry.name ? 
              `${COLORS[entry.name as keyof typeof COLORS]}dd` : 
              COLORS[entry.name as keyof typeof COLORS]}
            stroke="#fff"
            strokeWidth={1}
            onMouseEnter={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              setHoveredCategory(entry.name);
              onHover(
                `${stateCode}\n${entry.name}: ${formatCurrency(entry.value)}`,
                rect.left + rect.width / 2,
                rect.top
              );
            }}
            onMouseLeave={() => {
              setHoveredCategory(null);
              onHover(null, 0, 0);
            }}
          />
        );
        
        startAngle = endAngle;
        return path;
      })}
    <text
      x={size/2}
      y={size + 12}
      textAnchor="middle"
      style={{
        fontFamily: "system-ui",
        fontSize: "10px",
        fill: "#4a5568"
      }}
    >
      {stateCode}
    </text>
    </g>
  );
};

export const SalesMapChart: React.FC<Props> = ({ data, isDark }) => {
  const [tooltip, setTooltip] = React.useState<{
    show: boolean;
    content: string;
    x: number;
    y: number;
  } | null>(null);

  const processSalesData = () => {
    const salesByStateAndCategory = data.reduce((acc, item) => {
      if (!acc[item.stateCode]) {
        acc[item.stateCode] = {
          total: 0,
          categories: {}
        };
      }
      acc[item.stateCode].total += item.sales;
      if (!acc[item.stateCode].categories[item.category]) {
        acc[item.stateCode].categories[item.category] = 0;
      }
      acc[item.stateCode].categories[item.category] += item.sales;
      return acc;
    }, {} as { [key: string]: { total: number, categories: { [key: string]: number } } });

    return salesByStateAndCategory;
  };

  const salesData = processSalesData();
  const maxSales = Math.max(...Object.values(salesData).map(d => d.total));

  const sizeScale = scaleLinear()
    .domain([0, maxSales])
    .range([30, 45]);

  return (
    <div className="relative w-full h-[600px]">
      <div className="flex flex-col items-start mb-4">
        <div className={`mt-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          <div className="flex gap-4">
            {Object.entries(COLORS).map(([category, color]) => (
              <div key={category} className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: color }}
                />
                <span className="text-sm">{category}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <ComposableMap
        projection="geoAlbersUsa"
        projectionConfig={{
          scale: 800,
          center: [-96, 38]
        }}
        width={800}
        height={600}
        style={{
          width: "100%",
          height: "100%"
        }}
      >
        <ZoomableGroup>
          <Geographies geography={geoUrl} key="us-states">
            {({ geographies }) =>
              geographies.map(geo => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={isDark ? '#4A5568' : '#E2E8F0'}
                  stroke="#FFF"
                  strokeWidth={0.5}
                />
              ))
            }
          </Geographies>
          {Object.entries(salesData).map(([stateCode, data]) => stateCoordinates[stateCode] && (
            <Marker
              key={stateCode}
              coordinates={stateCoordinates[stateCode]}
            >
              <StatePieChart
                data={Object.entries(data.categories).map(([category, value]) => ({
                  name: category,
                  value
                }))}
                size={sizeScale(data.total)}
                stateCode={stateCode}
                onHover={(content, x, y) => {
                  setTooltip(content ? {
                    show: true,
                    content,
                    x,
                    y
                  } : null);
                }}
              />
            </Marker>
          ))}
        </ZoomableGroup>
      </ComposableMap>
      
      {tooltip && (
        <div 
          className={`absolute z-10 px-3 py-2 rounded shadow-lg border text-sm whitespace-pre-line
            ${isDark ? 'bg-gray-800 text-white border-gray-700' : 'bg-white text-gray-900 border-gray-200'}`}
          style={{
            left: tooltip.x,
            top: tooltip.y,
            transform: 'translate(-50%, -100%)',
            pointerEvents: 'none'
          }}
        >
          {tooltip.content}
        </div>
      )}
    </div>
  );
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(value);
};