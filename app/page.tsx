'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';
import ModelCard from '@/components/model-card';
import { Button } from '@/components/ui/button';
import ExamScorePrediction from '@/components/exam-score-prediction';
import MrExamScorePrediction from '@/components/mr-exam-score-prediction';
import { models } from '@/lib/models';

const modelMap: Record<string, React.ComponentType> = {
  '1': ExamScorePrediction,
  '2': MrExamScorePrediction,
};

export default function Home() {
  const [activeModelId, setActiveModelId] = useState<null | string>(null);

  const ComponentToRender = activeModelId ? modelMap[activeModelId] : null;

  return (
    <main className='container mx-auto px-4 py-8'>
      <header className='text-center mb-12'>
        <h1 className='text-4xl font-extrabold mb-4'>
          Regression Analysis Models
        </h1>
        <p className='text-muted-foreground text-lg'>
          Select a model to visualize predictions and data planes.
        </p>
      </header>

      {/* Model Selection Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12'>
        {models.map((model) => (
          <ModelCard
            key={model.id}
            {...model}
            // Add a visual indicator if active
            // isActive={activeModelId === model.id}
            onClick={() => setActiveModelId(model.id)}
          />
        ))}
      </div>

      {/* Dynamic Model Section */}
      {ComponentToRender ? (
        <section className='mt-8'>
          <div className='flex justify-between items-center mb-6'>
            <h2 className='text-2xl font-bold'>Visualization</h2>

            <Button
              variant='outline'
              size='sm'
              aria-label='Close Model'
              className='hover:text-destructive transition-colors cursor-pointer'
              onClick={() => setActiveModelId(null)}
            >
              <X /> Close Model
            </Button>
          </div>
          <ComponentToRender />
        </section>
      ) : (
        <div className='text-center py-20 border-2 border-gray-200 rounded-2xl'>
          <p className='text-gray-400'>
            Please select a model above to begin visualization.
          </p>
        </div>
      )}
    </main>
  );
}
