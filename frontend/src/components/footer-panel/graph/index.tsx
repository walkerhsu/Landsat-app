// import React from 'react';
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// const data = [
//   { wavelength: 400, value: 0.2 },
//   { wavelength: 450, value: 0.4 },
//   { wavelength: 500, value: 0.6 },
//   { wavelength: 550, value: 0.8 },
//   { wavelength: 600, value: 0.7 },
//   { wavelength: 650, value: 0.5 },
//   { wavelength: 700, value: 0.3 },
// ];

// const SpectrumChart = () => {
//   return (
//     <div className="w-full h-120 p-4 rounded-lg">
//       <h2 className="text-lg font-semibold mb-4 text-gray-800">Spectrum Chart</h2>
//       <ResponsiveContainer width="100%" height="100%">
//         <LineChart
//           data={data}
//           margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
//         >
//           <CartesianGrid strokeDasharray="3 3" />
//           <XAxis
//             dataKey="wavelength"
//             label={{ value: 'Wavelength', position: 'bottom', fill: '#666' }}
//             tick={{ fill: '#666' }}
//           />
//           <YAxis
//             label={{ value: 'Value', angle: -90, position: 'left', fill: '#666' }}
//             tick={{ fill: '#666' }}
//           />
//           <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.8)' }} />
//           <Legend />
//           <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} />
//         </LineChart>
//       </ResponsiveContainer>
//     </div>
//   );
// };

// export default SpectrumChart;

// import "./styles.css";
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const data = [
  {
    name: "Band 1",
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: "Band 2",
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: "Band 3",
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: "Band 4",
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: "Band 5",
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: "Band 6",
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: "Band 7",
    uv: 3000,
    pv: 1598,
    amt: 1210,
  },
  {
    name: "Band 8",
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
];

const mockData = [
  // 10 float numbers
  0.122, 0.879, 0.33, 0.8789, 0.78, 0.879, 0.33, 0.8789, 0.78, 0.879, 0.98,
];

type Props = {
  bands: number[];
};
export default function SpectrumChart({ bands }: { bands: number[] }) {
  const data = bands.map((value, index) => ({
    name: `Band ${index + 1}`,
    pv: value,
  }));

  return (
    <div className="w-full overflow-x-auto flex-row">
      <LineChart width={400} height={200} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        {/* <YAxis label={{ value: 'Value', angle: -90, position: 'insideLeft' }} /> Label on the left */}
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="pv"
          stroke="#8884d8"
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </div>
  );
}