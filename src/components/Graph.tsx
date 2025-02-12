import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

interface GraphProps {
  expression: string;
  result: string;
}

const Graph: React.FC<GraphProps> = ({ expression }) => {
  const chartRef = useRef<Chart<'line'> | null>(null);

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    if (!expression) return;

    try {
      const compiledExpression = (x: number) => {
        // eslint-disable-next-line no-new-func
        const func = new Function('x', 'y', 'z', 'return ' + expression);
        return func(x, 0, 0); // Assuming y and z are 0 for 2D graph
      };

      const dataPoints = [];
      for (let x = -10; x <= 10; x += 0.5) {
        try {
          const y = compiledExpression(x);
          if (typeof y === 'number' && !isNaN(y) && isFinite(y)) {
            dataPoints.push({ x, y });
          } else {
            console.warn(`Invalid y value at x=${x}:`, y);
          }
        } catch (error) {
          console.error(`Error evaluating expression at x=${x}:`, error);
        }
      }

      const data = {
        datasets: [
          {
            label: expression,
            data: dataPoints,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1,
            pointRadius: 0,
          },
        ],
      };

      const options = {
        scales: {
          x: {
            type: 'linear',
            position: 'bottom',
          },
          y: {
            type: 'linear',
            position: 'left',
          },
        },
        plugins: {
          legend: {
            display: false,
          },
        },
      };

      const ctx = document.getElementById('myChart') as HTMLCanvasElement;
      if (ctx) {
        chartRef.current = new Chart(ctx, {
          type: 'line',
          data: data,
          options: options,
        });
      }
    } catch (error) {
      console.error('Error creating chart:', error);
    }

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [expression]);

  return (
    <div className="graph bg-gray-100 dark:bg-gray-700 p-4 rounded-md mt-4">
      <canvas id="myChart" />
    </div>
  );
};

export default Graph;
