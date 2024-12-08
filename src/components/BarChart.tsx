import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { SalesData } from '../types/data';
import { COLORS } from '../constants/colors';

interface ProcessedData {
  region: string;
  Furniture: number;
  Supplies: number;
  Technology: number;
}

interface Props {
  data: SalesData[];
}

export const SalesBarChart: React.FC<Props> = ({ data }) => {
  const processData = (): ProcessedData[] => {
    const groupedData: { [key: string]: ProcessedData } = {};

    data.forEach((item) => {
      if (!groupedData[item.region]) {
        groupedData[item.region] = {
          region: item.region,
          Furniture: 0,
          Supplies: 0,
          Technology: 0,
        };
      }
      groupedData[item.region][item.category] += item.sales;
    });

    return Object.values(groupedData);
  };

  const processedData = processData();

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={processedData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="region" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="Furniture" stackId="a" fill={COLORS.Furniture} />
        <Bar dataKey="Supplies" stackId="a" fill={COLORS.Supplies} />
        <Bar dataKey="Technology" stackId="a" fill={COLORS.Technology} />
      </BarChart>
    </ResponsiveContainer>
  );
};