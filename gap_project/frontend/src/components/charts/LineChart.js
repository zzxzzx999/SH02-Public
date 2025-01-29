import React, { useRef, useEffect } from 'react';
import * as echarts from 'echarts';

// For Benchmark Improvement in "Registered Company" Page
// For Score Over Time in "Output" Page

// chartData structure for line charts eg:
// const [chartData] = useState({
//      categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
//      values: [120, 200, 150, 80, 70, 110, 130],
// });

const LineChart = ({ chartData }) => {
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
    <div style={{width: '24.5em', height: '18.7em', marginTop: '-3.5em', marginLeft: '-1em'}} ref={chartRef}></div>
  );
};

export default LineChart;
