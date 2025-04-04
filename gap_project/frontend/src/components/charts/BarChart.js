import * as echarts from 'echarts';
import React, { useEffect, useRef } from 'react';

// For "Summary of Sections"
// chartData structure for bar charts eg:
// const [barData] = useState({
//     categories: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
//     values: [120, 200, 150, 80, 70],
//   });

const BarChart = ({ chartData }) => {
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
      grid: { 
        left: 0,
        right: 0,
        top: 0, 
        bottom: 0,
        containLabel: true
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      xAxis: {
        type: 'value',
        boundaryGap: [0, 0],
        axisLabel: {
          show: false
        },
        splitLine: {
          show: false,
          lineStyle: {
            color: 'grey',
          }
        }
      },
      yAxis: {
        type: 'category',
        data: chartData.categories,
        inverse: true,  
        axisLabel: {
            show: false,
        }
      },
      series: [
        {
          name: 'Value',
          type: 'bar',
          data: chartData.values,
          barCategoryGap: '0%',
          barGap: '0%',
          label: {
            show: true,
            position: 'insideLeft', // Show labels inside the bars
            formatter: '{b}', // Format: show the category name
            color: '#ffffff', // Label text color
          },
          itemStyle: {
            color: (params) => getColorForValue(params.value),
          },
        },
      ],
    };

    chartInstance.setOption(chartOptions);
    const handleResize = () => {
      chartInstance.resize();
    };
    window.addEventListener('resize', handleResize);
    // Cleanup function
    return () => {
      window.removeEventListener('resize', handleResize);
      chartInstance.dispose();
    };
  }, [chartData]);

  return (
    <div style={{ width: '100%', height: '100%'}} ref={chartRef}></div>
  );
};

export default BarChart;
