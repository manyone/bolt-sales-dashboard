interface DataItem {
  stateCode: string;
  region: string;
  total: number;
  [key: string]: any;
}

export const groupByRegion = (data: DataItem[]): DataItem[] => {
  // Group states by region
  const regionGroups: { [key: string]: DataItem[] } = {};
  
  data.forEach(item => {
    if (!regionGroups[item.region]) {
      regionGroups[item.region] = [];
    }
    regionGroups[item.region].push(item);
  });

  // Sort states within each region by state code
  Object.values(regionGroups).forEach(group => {
    group.sort((a, b) => a.stateCode.localeCompare(b.stateCode));
  });

  // Combine all regions in order: Central, East, West
  const regionOrder = ['Central', 'East', 'West'];
  return regionOrder.reduce((acc, region) => {
    if (regionGroups[region]) {
      acc.push(...regionGroups[region]);
    }
    return acc;
  }, [] as DataItem[]);
};