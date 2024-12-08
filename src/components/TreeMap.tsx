import React from 'react';
import { Treemap, ResponsiveContainer, Tooltip } from 'recharts';
import { SalesData } from '../types/data';

interface Props {
  data: SalesData[];
}

const COLORS = {
  Furniture: '#8884d8',
  Supplies: '#82ca9d',
  Technology: '#ffc658'
};

export const SalesTreeMap: React.FC<Props> = ({ data }) => {
  const processData = () => {
    const categoryGroups = data.reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = {
          name: item.category,
          children: []
        };
      }
      
      const regionNode = acc[item.category].children.find(
        (child: any) => child.name === item.region
      );
      
      if (regionNode) {
        regionNode.size += item.sales;
      } else {
        acc[item.category].children.push({
          name: item.region,
          size: item.sales,
          category: item.category
        });
      }
      
      return acc;
    }, {} as any);

    return Object.values(categoryGroups);
  };

  const CustomizedContent = (props: any) => {
    const { depth, x, y, width, height, name, category } = props;

    return (
      <g>
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          style={{
            fill: category ? COLORS[category] : '#fff',
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

  return (
    <ResponsiveContainer width="100%" height={400}>
      <Treemap
        data={processData()}
        dataKey="size"
        aspectRatio={4 / 3}
        stroke="#fff"
        content={<CustomizedContent />}
      >
        <Tooltip
          formatter={(value: number, name: string, props: any) => {
            const formattedValue = new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD'
            }).format(value);
            return [formattedValue, `${props.payload.category || ''} - ${name}`];
          }}
        />
      </Treemap>
    </ResponsiveContainer>
  );
};