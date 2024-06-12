import { ReactNode } from 'react';

type Props = {
  title: string | ReactNode;
  mainContent: string | number;
  unit?: string;
  annotation?: string;
};

export default function CardInPlayerPage({
  title,
  mainContent,
  unit,
  annotation,
}: Props) {
  return (
    <div className="w-full rounded-lg border-2 bg-gray-50  p-4 shadow-xl ">
      <h4 className="flex justify-center text-lg font-semibold ">{title}</h4>
      <div className="mt-0.5 flex items-end justify-center text-4xl font-bold">
        <div>{mainContent}</div>
        {unit != null && <div className="mb-1 ml-2 text-sm">{unit}</div>}
      </div>
      <div className="mt-1 flex justify-center text-sm text-slate-500">
        {annotation}
      </div>
    </div>
  );
}
