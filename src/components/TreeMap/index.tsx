import React from 'react';
import { Treemap, ResponsiveContainer, Tooltip } from 'recharts';
import { SalesData } from '../../types/data';
import { CustomContent } from './CustomContent';
import { processData } from './processData';

interface Props {
  data: SalesData[];
}

export const SalesTreeMap: React.FC<Props> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <Treemap
        data={processData(data)}
        dataKey="size"
        aspectRatio={4 / 3}
        stroke="#fff"
        content={<CustomContent />}
      >
        <Tooltip
          formatter={(value: number) => new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
          }).format(value)}
        />
      </Treemap>
    </ResponsiveContainer>
  );
};