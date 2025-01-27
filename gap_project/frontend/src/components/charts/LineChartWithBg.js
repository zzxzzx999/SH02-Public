import React, { useRef, useEffect } from 'react';
import * as echarts from 'echarts';

// For Potential Score Comparison in "Registered Company" Page

// chartData structure for line charts eg:
// const [chartData] = useState({
//      categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
//      values: [120, 200, 150, 80, 70, 110, 130],
// });

const LineChartWithBackground = ({ chartData }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    const chartInstance = echarts.init(chartRef.current);

    const chartOptions = {
      tooltip: {
        trigger: 'axis',
      },
      xAxis: {
        type: 'category',
        data: chartData.categories,
      },
      yAxis: {
        type: 'value',
        splitArea: {
            show: true,
            areaStyle: {
              color: [
                'rgba(255, 0, 0, 0.3)',
                'rgba(255, 127, 0, 0.3)',
                'rgba(255, 255, 0, 0.3)',
                'rgba(127, 255, 0, 0.3)',
                'rgba(0, 100, 0, 0.3)',
              ],
            },
          },
          min: 0,
          max: 50, // Maximum score per section
      },
      series: [
        {
          name: 'Values',
          type: 'line',
          data: chartData.values,
          symbolSize: 8, // Size of the points
          lineStyle: {
            color: 'blue', // Line color remains constant
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

export default LineChartWithBackground;
