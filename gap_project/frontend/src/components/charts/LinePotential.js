import React, { useRef, useEffect } from 'react';
import * as echarts from 'echarts';

// For Benchmark Improvement in "Registered Company" Page
// For Score Over Time in "Output" Page

// chartData structure for line charts eg:
// const [chartData] = useState({
//      categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
//      values: [120, 200, 150, 80, 70, 110, 130],
// });

const LineChart = ({ chartData, potentialScore }) => {
  const chartRef = useRef(null);

  // Function to determine color based on increasing or decreasing trend
  const getColorForPoint = (index, values) => {
    if (index === values.length - 1) return 'blue';

    const currentValue = values[index];
    const nextValue = values[index + 1];

    if (nextValue > currentValue) {
      return 'green'; // Increasing
    } else if (nextValue < currentValue) {
      return 'red'; // Decreasing
    } else {
      return 'blue';
    }
  };

  useEffect(() => {
    const chartInstance = echarts.init(chartRef.current);

    const chartOptions = {
      grid: { 
        left:'0%',
        right:'0%',
        top: '6%', 
        bottom: '0%',
        containLabel: true,
      },
      tooltip: {
        trigger: 'axis',
      },
      xAxis: {
        type: 'category',
        data: chartData.categories,
      },
      yAxis: {
        type: 'value',
        splitLine: {
          show: true,
          lineStyle: {
            color: 'grey',
          }
        },
      },
      series: [
        {
          name: 'Values',
          type: 'line',
          data: chartData.values,
          itemStyle: {
            // Modify the color for each point in the line
            normal: {
              color: (params) => getColorForPoint(params.dataIndex, chartData.values),
            },
          },
          symbolSize: 8, // Size of the points
          lineStyle: {
            color: 'blue', // Line color remains constant
          },
          markLine: {
            symbol: 'none',
            label: { formatter: 'Potential Score', position: 'end', color: 'black', offset: [-100, -10] },
            data: [{yAxis: potentialScore}],
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
      window.removeEventListener('resize', handleResize);
      chartInstance.dispose();
    };
  }, [chartData]);

  return (
    <div style={{width: '100%', height: '100%'}} ref={chartRef}></div>
  );
};

export default LineChart;
