'use client';

import React, { useEffect, useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

// Dynamic import to handle Plotly's reliance on the 'window' object
const Plot = dynamic(() => import('react-plotly.js'), {
  ssr: false,
  loading: () => (
    <div className='h-200 flex items-center justify-center'>
      Loading 3D Chart...
    </div>
  ),
});

interface ModelCoefficients {
  coefficients: (string | number)[];
}

const MrExamScorePrediction: React.FC = () => {
  const [coefficients, setCoefficients] = useState<number[]>([]);

  // Static Data
  const studyHours = [1, 2, 3, 4, 5];
  const sleepHours = [6, 2, 1, 5, 7];
  const score = [60, 55, 50, 70, 85];

  useEffect(() => {
    fetch('/mr-example-coefficients.json')
      .then((response) => response.json())
      .then((data: ModelCoefficients) => {
        setCoefficients(data.coefficients.map(Number));
      })
      .catch((error) => console.error('Error fetching coefficients: ', error));
  }, []);

  // Compute the 3D regression plane surface
  const regressionPlane = useMemo(() => {
    if (coefficients.length === 0) return null;

    const x1Surface: number[] = [];
    const x2Surface: number[] = [];
    const ySurface: number[] = [];

    // Creating a grid for the mesh3d plane
    for (let x1 = 0; x1 <= 5; x1 += 0.5) {
      for (let x2 = 0; x2 <= 7; x2 += 0.5) {
        x1Surface.push(x1);
        x2Surface.push(x2);
        // Formula: y = b0 + b1*x1 + b2*x2
        const predictedY =
          coefficients[0] + coefficients[1] * x1 + coefficients[2] * x2;
        ySurface.push(predictedY);
      }
    }

    return {
      x: x1Surface,
      y: x2Surface,
      z: ySurface,
      type: 'mesh3d' as const,
      opacity: 0.5,
      color: 'blue',
      name: 'Regression Plane',
    };
  }, [coefficients]);

  const trace: Plotly.Data = {
    x: studyHours,
    y: sleepHours,
    z: score,
    mode: 'markers',
    type: 'scatter3d',
    name: 'Actual Data',
    marker: {
      size: 8,
      color: score,
      colorscale: 'Viridis',
      opacity: 0.8,
    },
  };

  const layout: Partial<Plotly.Layout> = {
    title: { text: 'Study and Sleep Hours vs Score' },
    scene: {
      xaxis: { title: { text: 'Study Hours' } },
      yaxis: { title: { text: 'Sleep Hours' } },
      zaxis: { title: { text: 'Score' } },
    },
    margin: { l: 0, r: 0, b: 0, t: 50 },
    autosize: true,
  };

  return (
    <Card className='w-full'>
      <CardHeader>
        <CardTitle className='text-center font-semibold text-2xl'>
          Exam Score Prediction
        </CardTitle>
      </CardHeader>

      <CardContent>
        <p className='mb-2 text-center text-muted-foreground text-xl'>
          Multiple Linear Regression
        </p>

        <p className='mb-4 text-center text-muted-foreground text-lg'>
          Predicts score based on study hours and sleep hours
        </p>

        <div className='w-full h-200'>
          <Plot
            data={regressionPlane ? [trace, regressionPlane] : [trace]}
            layout={layout}
            useResizeHandler={true}
            style={{ width: '100%', height: '100%' }}
            config={{ responsive: true }}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default MrExamScorePrediction;
