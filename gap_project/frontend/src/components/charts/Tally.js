import React from 'react';


const ChartTable = ({ data }) => {
  const formatCategory = (name) => {
    if (name === 'needsImprovement') {
      return 'Needs Improvement';
    }
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  return (
    <table className="chart-table">
      <thead>
        <tr>
          <th>Category</th>
          <th>Count</th>
        </tr>
      </thead>
      <tbody>
        {data
          .filter(item => item.value > 0)
          .map((item, index) => (
            <tr key={index}>
              <td>{formatCategory(item.name)}</td>
              <td>{item.value}</td>
            </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ChartTable;
