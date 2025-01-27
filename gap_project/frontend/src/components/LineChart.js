import React, { useRef, useEffect } from 'react';
import * as echarts from 'echarts';

// chartData structure for line charts eg:
// const [chartData] = useState({
//      categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
//      values: [120, 200, 150, 80, 70, 110, 130],
// });

const Chart = ({ chartData }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    const chartInstance = echarts.init(chartRef.current);

    const chartOptions = {
      title: {
        text: 'ECharts Example',
      },
      tooltip: {},
      xAxis: {
        type: 'category',
        data: chartData?.categories || [],
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          name: 'Sales',
          type: 'line',
          data: chartData?.values || [],
        },
      ],
    };

    chartInstance.setOption(chartOptions);

    return () => {
      chartInstance.dispose();
    };
  }, [chartData]);

  return <div ref={chartRef} style={{ width: '100%', height: '400px' }} />;
};

export default Chart;
