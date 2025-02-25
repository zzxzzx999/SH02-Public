import * as echarts from 'echarts';
import React, { useEffect, useRef } from 'react';

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

const COLOR_MAP = {
  exceptional: '#006613', 
  good: '#42C259',
  basic: '#7CCC8B', 
  needsImprovement: '#FFC546', 
  unsatisfactory: '#FF0B0B', 
};

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
          //name: 'Sales',
          type: 'pie',
          radius: '80%',
          center: ['50%', '50%'],


          data: chartData.filter(item => item.value > 0).map(item => ({
            value: item.value,
            
            name: item.name === 'needsImprovement'
            ? 'Needs Improvement' //fixes piechart needs improvement
            : item.name[0].toUpperCase() + item.name.slice(1), //capitilizes
            itemStyle: {
              color: COLOR_MAP[item.name] || '#9E9E9E',}
          })),
        },
      ],
    };

    chartInstance.setOption(options);
    const handleResize = () => chartInstance.resize();
    window.addEventListener('resize', handleResize);


    return () => {
      window.removeEventListener('resize', handleResize);
      chartInstance.dispose();
    };
  }, [chartData]);

  return <div className="echart-container" ref={chartRef} />;
};

export default PieChart;
