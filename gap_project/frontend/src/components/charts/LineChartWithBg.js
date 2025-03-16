import * as echarts from 'echarts';
import React, { useEffect, useRef } from 'react';

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
        axisLine: {
          show: false,
        },
        axisLabel: {
          show: false,
        }
      },
      yAxis: {
        type: 'value',
        splitLine: {
          show: false
        },
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
          markLine: {
            symbol: 'none',
            label: { formatter: 'Potential Score', position: 'end', color: 'black', offset: [-80, -10] },
            data: [{yAxis: 50}],
            lineStyle: {color: 'red', type: 'dashed'}
          }
        },
      ],
    };

    chartInstance.setOption(chartOptions);
    const handleResize = () => chartInstance.resize();
    window.addEventListener('resize', handleResize);
    // Cleanup function
    return () => {
      window.removeEventListener('resize', handleResize)
      chartInstance.dispose();
    };
  }, [chartData]);

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} ref={chartRef}></div>
  );
};

export default LineChartWithBackground;
