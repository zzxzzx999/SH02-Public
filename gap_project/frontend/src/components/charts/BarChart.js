import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

// For "Summary of Sections"

// chartData structure for bar charts eg:
// const [barData] = useState({
//     categories: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
//     values: [120, 200, 150, 80, 70],
//   });

const HorizontalBarChart = ({ chartData }) => {
  const chartRef = useRef(null);

  const getColorForValue = (value) => {
    if (value < 10) return 'red';
    if (value < 20) return 'orange';
    if (value < 30) return 'lightgreen';
    if (value < 40) return 'green';
    return 'darkgreen';
  };

  useEffect(() => {
    const chartInstance = echarts.init(chartRef.current);

    const chartOptions = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      xAxis: {
        type: 'value',
        boundaryGap: [0, 0.1],
      },
      yAxis: {
        type: 'category',
        data: chartData.categories,
        axisLabel: {
            show: false
        }
      },
      series: [
        {
          name: 'Value',
          type: 'bar',
          data: chartData.values,
          label: {
            show: true,
            position: 'inside', // Show labels inside the bars
            formatter: '{b}', // Format: show the category name
            color: '#fff', // Label text color
          },
          itemStyle: {
            color: (params) => getColorForValue(params.value),
          },
        },
      ],
    };

    chartInstance.setOption(chartOptions);

    // Cleanup function
    return () => {
      chartInstance.dispose();
    };
  }, [chartData]);

  return (
    <div style={{ width: '80%', height: '400px', margin: '0 auto' }} ref={chartRef}></div>
  );
};

export default HorizontalBarChart;
