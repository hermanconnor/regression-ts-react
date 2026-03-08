export interface Model {
  id: string;
  title: string;
  image: string;
  modelType: string;
  description: string;
}

export const models: Model[] = [
  {
    id: '1',
    title: 'Exam Score Prediction',
    image: '/images/studying.jpg',
    modelType: 'Simple Linear Regression',
    description: 'Predict exam score based on study hours',
  },
  {
    id: '2',
    title: 'Exam Score Prediction',
    image: '/images/studying-2.webp',
    modelType: 'Multiple Linear Regression',
    description: 'Predicts score based on study hours and sleep hours',
  },
];
