import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { wavelength: 400, value: 0.2 },
  { wavelength: 450, value: 0.4 },
  { wavelength: 500, value: 0.6 },
  { wavelength: 550, value: 0.8 },
  { wavelength: 600, value: 0.7 },
  { wavelength: 650, value: 0.5 },
  { wavelength: 700, value: 0.3 },
];

const SpectrumChart = () => {
  return (
    <div className="w-full h-64 p-4 rounded-lg">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">Spectrum Chart</h2>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart 
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="wavelength" 
            label={{ value: 'Wavelength', position: 'bottom', fill: '#666' }} 
            tick={{ fill: '#666' }}
          />
          <YAxis 
            label={{ value: 'Value', angle: -90, position: 'left', fill: '#666' }} 
            tick={{ fill: '#666' }}
          />
          <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.8)' }} />
          <Legend />
          <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SpectrumChart;