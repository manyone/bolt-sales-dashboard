export interface SalesData {
  stateCode: string;
  region: 'Central' | 'East' | 'West';
  category: keyof typeof COLORS;
  sales: number;