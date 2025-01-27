import React, { useRef, useEffect } from 'react';
import * as echarts from 'echarts';

// For "Specifc Output"
// TODO: Colors for the pie chart are yet to be changed to FIGMA

// chartData structure for pie charts eg:
// const [pieData] = useState([
//     { name: 'Mon', value: 120 },
//     { name: 'Tue', value: 200 },
//     { name: 'Wed', value: 150 },
//     { name: 'Thu', value: 80 },
//     { name: 'Fri', value: 70 },
//   ]);

const PieChart = ({ chartData }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    const chartInstance = echarts.init(chartRef.current);

    const options = {
      tooltip: {
        trigger: 'item',
      },
      series: [
        {
          name: 'Sales',
          type: 'pie',
          radius: '50%',
          data: chartData.map(item => ({
            value: item.value,
            name: item.name,
          })),
        },
      ],
    };

    chartInstance.setOption(options);

    return () => {
      chartInstance.dispose();
    };
  }, [chartData]);

  return <div ref={chartRef} style={{ width: '100%', height: '400px' }} />;
};

export default PieChart;
