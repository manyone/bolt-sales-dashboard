import { SalesData } from '../../types/data';
import { TreeMapNode } from '../../types/treemap';

export const processData = (data: SalesData[]): TreeMapNode[] => {
  const categoryGroups = data.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = {
        name: item.category,
        children: [],
        size: 0
      };
    }
    
    const regionNode = acc[item.category].children?.find(
      child => child.name === item.region
    );
    
    if (regionNode) {
      regionNode.size += item.sales;
    } else {
      acc[item.category].children?.push({
        name: item.region,
        size: item.sales,
        category: item.category,
        region: item.region
      });
    }
    
    acc[item.category].size += item.sales;
    return acc;
  }, {} as Record<string, TreeMapNode>);

  return Object.values(categoryGroups);
};