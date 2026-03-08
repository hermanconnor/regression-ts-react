'use client';

import React, { useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';

const Plot = dynamic(() => import('react-plotly.js'), {
  ssr: false,
  loading: () => (
    <div className='h-125 flex items-center justify-center'>
      Loading Plot...
    </div>
  ),
});

const STUDY_HOURS_DATA = [1, 2, 3, 4, 5];
const EXAM_SCORES_DATA = [55, 70, 80, 85, 90];

const ExamScorePrediction: React.FC = () => {
  const [inputHours, setInputHours] = useState<number | ''>('');

  // 1. Calculate Regression Parameters (b0, b1) once
  const stats = useMemo(() => {
    const n = STUDY_HOURS_DATA.length;
    const meanX = STUDY_HOURS_DATA.reduce((a, b) => a + b, 0) / n;
    const meanY = EXAM_SCORES_DATA.reduce((a, b) => a + b, 0) / n;

    const numerator = STUDY_HOURS_DATA.reduce(
      (sum, x, i) => sum + (x - meanX) * (EXAM_SCORES_DATA[i] - meanY),
      0,
    );
    const denominator = STUDY_HOURS_DATA.reduce(
      (sum, x) => sum + Math.pow(x - meanX, 2),
      0,
    );

    const b1 = numerator / denominator;
    const b0 = meanY - b1 * meanX;

    // Generate line data points
    const regressionLine = STUDY_HOURS_DATA.map((x) => b0 + b1 * x);

    // Calculate R² (Coefficient of Determination)
    const ssRes = STUDY_HOURS_DATA.reduce(
      (sum, x, i) => sum + Math.pow(EXAM_SCORES_DATA[i] - (b0 + b1 * x), 2),
      0,
    );
    const ssTot = EXAM_SCORES_DATA.reduce(
      (sum, y) => sum + Math.pow(y - meanY, 2),
      0,
    );
    const r2 = 1 - ssRes / ssTot;

    return { b0, b1, regressionLine, r2 };
  }, []);

  // 2. Derive prediction based on input
  const predictedScore = useMemo(() => {
    if (typeof inputHours !== 'number' || inputHours < 0) return null;

    const score = stats.b0 + stats.b1 * inputHours;

    return score > 100 ? '100.00' : score.toFixed(2);
  }, [inputHours, stats]);

  const plotData: Plotly.Data[] = [
    {
      x: STUDY_HOURS_DATA,
      y: EXAM_SCORES_DATA,
      mode: 'markers',
      type: 'scatter',
      name: 'Actual Data',
      marker: { color: 'blue', size: 10 },
    },
    {
      x: STUDY_HOURS_DATA,
      y: stats.regressionLine,
      mode: 'lines',
      type: 'scatter',
      name: 'Regression Line',
      line: { color: 'red', width: 3 },
    },
  ];

  const layout: Partial<Plotly.Layout> = {
    title: { text: 'Study Hours vs Exam Scores' },
    xaxis: { title: { text: 'Study Hours' } },
    yaxis: { title: { text: 'Exam Scores' } },
    autosize: true,
    margin: { l: 50, r: 50, b: 50, t: 80 },
  };

  return (
    <Card className='w-full'>
      <CardHeader>
        <CardTitle className='text-center font-semibold text-2xl'>
          Exam Score Prediction
        </CardTitle>
      </CardHeader>

      <CardContent>
        <p className='mb-1 text-center text-muted-foreground text-xl'>
          Simple Linear Regression
        </p>
        <p className='mb-4 text-center text-muted-foreground text-lg'>
          Predict exam score based on study hours
        </p>

        <div className='bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6 w-full max-w-md text-center mx-auto'>
          <div className='flex flex-col gap-4'>
            <Input
              type='number'
              value={inputHours}
              onChange={(e) =>
                setInputHours(
                  e.target.value === '' ? '' : Number(e.target.value),
                )
              }
              placeholder='Enter number of study hours'
              className='p-5'
            />

            <div className='h-12 flex items-center justify-center font-semibold text-lg text-blue-700'>
              {predictedScore ? (
                <p>Predicted Score: {predictedScore}%</p>
              ) : (
                <p className='text-gray-400 text-sm'>
                  Enter hours to see prediction
                </p>
              )}
            </div>
          </div>

          <div className='grid grid-cols-3 gap-2 mt-4 pt-4 border-t text-xs text-gray-500'>
            <div>
              <span className='block font-bold'>Intercept (b0)</span>{' '}
              {stats.b0.toFixed(2)}
            </div>
            <div>
              <span className='block font-bold'>Slope (b1)</span>{' '}
              {stats.b1.toFixed(2)}
            </div>
            <div>
              <span className='block font-bold'>R² Score</span>{' '}
              {stats.r2.toFixed(3)}
            </div>
          </div>
        </div>

        <div className='w-full h-100'>
          <Plot
            data={plotData}
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

export default ExamScorePrediction;
