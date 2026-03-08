import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface Props {
  id: string;
  title: string;
  image: string;
  modelType: string;
  description: string;
  onClick: () => void;
}

const ModelCard = ({
  title,
  image,
  modelType,
  description,
  onClick,
}: Props) => {
  return (
    <Card
      className='cursor-pointer hover:shadow-lg transition-shadow duration-300'
      onClick={onClick}
    >
      <CardHeader>
        <CardTitle className='text-xl font-semibold'>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Image
          src={image}
          alt={title}
          width={200}
          height={100}
          className='w-full h-auto mb-4'
        />
        <p className='mb-2 text-lg'>{modelType}</p>
        <CardDescription>{description}</CardDescription>
      </CardContent>
    </Card>
  );
};

export default ModelCard;
