import React, { useState } from 'react';
import { SalesBarChart } from './components/BarChart';
import { SalesTreeMap } from './components/TreeMap';
import { SalesPieChart } from './components/PieChart';
import { HorizontalStackedChart } from './components/HorizontalStackedChart';
import { SalesMapChart } from './components/MapChart';
import { ThemeToggle } from './components/ThemeToggle';
import { mockSalesData } from './data/mockData';
import { THEME } from './constants/theme';

function App() {
  const [isDark, setIsDark] = useState(false);
  const theme = THEME[isDark ? 'dark' : 'light'];

  return (
    <div className={`min-h-screen ${theme.background} p-8 transition-colors duration-200`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className={`text-3xl font-bold ${theme.text}`}>Sales Dashboard</h1>
          <ThemeToggle isDark={isDark} onToggle={() => setIsDark(!isDark)} />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className={`${theme.card} p-6 rounded-lg shadow-md transition-colors duration-200`}>
            <h2 className={`text-xl font-semibold mb-4 ${theme.text}`}>Sales by Region and Category</h2>
            <SalesBarChart data={mockSalesData} />
          </div>
          
          <div className={`${theme.card} p-6 rounded-lg shadow-md transition-colors duration-200`}>
            <h2 className={`text-xl font-semibold mb-4 ${theme.text}`}>Sales Distribution</h2>
            <SalesPieChart data={mockSalesData} />
          </div>
          
          <div className={`${theme.card} p-6 rounded-lg shadow-md lg:col-span-2 transition-colors duration-200`}>
            <h2 className={`text-xl font-semibold mb-4 ${theme.text}`}>Sales TreeMap</h2>
            <SalesTreeMap data={mockSalesData} />
          </div>
          
          <div className={`${theme.card} p-6 rounded-lg shadow-md lg:col-span-2 transition-colors duration-200`}>
            <h2 className={`text-xl font-semibold mb-4 ${theme.text}`}>Sales by State</h2>
            <div className="relative">
              <SalesMapChart data={mockSalesData} isDark={isDark} />
            </div>
          </div>
          
          <div className={`${theme.card} p-6 rounded-lg shadow-md lg:col-span-2 transition-colors duration-200`}>
            <h2 className={`text-xl font-semibold mb-4 ${theme.text}`}>Sales Distribution by State</h2>
            <HorizontalStackedChart data={mockSalesData} isDark={isDark} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;