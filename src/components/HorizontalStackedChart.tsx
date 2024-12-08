import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { SalesData } from '../types/data';
import { COLORS } from '../constants/colors';
import { groupByRegion } from '../utils/dataProcessing';

interface Props {
  data: SalesData[];
  isDark: boolean;
}

export const HorizontalStackedChart: React.FC<Props> = ({ data, isDark }) => {
  const processData = () => {
    // First, calculate totals and categories for each state
    const stateData = data.reduce((acc, item) => {
      if (!acc[item.stateCode]) {
        acc[item.stateCode] = {
          stateCode: item.stateCode,
          region: item.region,
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
    }, {} as { [key: string]: { stateCode: string; region: string; total: number; categories: { [key: string]: number } } });

    // Transform and group by region
    const transformedData = Object.values(stateData).map(state => ({
      stateCode: state.stateCode,
      region: state.region,
      total: state.total,
      ...state.categories
    }));

    return groupByRegion(transformedData);
  };

  const getPercentage = (value: number, total: number) => {
    return ((value / total) * 100).toFixed(1);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) return null;
    const stateData = processData().find(d => d.stateCode === label);
    const total = stateData?.total || 0;

    return (
      <div className={`p-2 rounded shadow-lg ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
        <p className="font-semibold">{label}</p>
        {payload.map((entry: any) => (
          <p key={entry.name} style={{ color: entry.color }}>
            {entry.name}: {formatCurrency(entry.value)} ({getPercentage(entry.value, total)}%)
          </p>
        ))}
        <p className="font-semibold mt-1">
          Total: {formatCurrency(total)}
        </p>
      </div>
    );
  };

  const maxTotal = Math.max(...processData().map(d => d.total));
  
  const CustomYAxisTick = (props: any) => {
    const { x, y, payload } = props;
    const stateData = processData().find(d => d.stateCode === payload.value);
    const isFirstInRegion = processData().findIndex(d => d.region === stateData?.region) === 
      processData().findIndex(d => d.stateCode === payload.value);
    
    return (
      <g transform={`translate(${x},${y})`}>
        {isFirstInRegion && (
          <text
            x={-45}
            y={-10}
            textAnchor="end"
            fill={isDark ? "#fff" : "#666"}
            fontWeight="bold"
          >
            {stateData?.region}
          </text>
        )}
        <text x={-5} y={0} dy={4} textAnchor="end" fill={isDark ? "#fff" : "#666"}>
          {payload.value}
        </text>
      </g>
    );
  };

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart
        data={processData()}
        layout="vertical"
        margin={{ top: 20, right: 120, bottom: 20, left: 40 }}
      >
        <XAxis 
          type="number" 
          domain={[0, maxTotal]}
          tickFormatter={(value) => formatCurrency(value)}
        />
        <YAxis 
          type="category" 
          dataKey="stateCode" 
          width={80}
          tick={<CustomYAxisTick />}
        />
        <Tooltip content={<CustomTooltip />} />
        {Object.keys(COLORS).map((category) => (
          <Bar
            key={category}
            dataKey={category}
            stackId="a"
            fill={COLORS[category as keyof typeof COLORS]}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(value);
};