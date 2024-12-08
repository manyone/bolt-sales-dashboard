export interface TreeMapNode {
  name: string;
  size: number;
  children?: TreeMapNode[];
  category?: string;
  region?: string;
}

export interface CustomContentProps {
  depth: number;
  x: number;
  y: number;
  width: number;
  height: number;
  name: string;
  category?: string;
  region?: string;
}