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
];
