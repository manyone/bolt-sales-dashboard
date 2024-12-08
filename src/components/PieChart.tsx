import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { SalesData } from '../types/data';
import { COLORS } from '../constants/colors';

interface Props {
  data: SalesData[];
}

export const SalesPieChart: React.FC<Props> = ({ data }) => {
  const processData = () => {
    const categoryTotals = data.reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = 0;
      }
      acc[item.category] += item.sales;
      return acc;
    }, {} as { [key: string]: number });

    return Object.entries(categoryTotals).map(([category, value]) => ({
      name: category,
      value,
    }));
  };

  const processedData = processData();

  return (
    <ResponsiveContainer width="100%" height={400}>
      <PieChart>
        <Pie
          data={processedData}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={150}
          fill="#8884d8"
          dataKey="value"
        >
          {processedData.map((entry) => (
            <Cell key={entry.name} fill={COLORS[entry.name as keyof typeof COLORS]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};