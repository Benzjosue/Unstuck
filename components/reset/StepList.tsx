type StepListProps = {
  steps: string[];
};

export default function StepList({ steps }: StepListProps) {
  return (
    <ol className="space-y-4">
      {steps.map((step, index) => (
        <li key={index} className="flex items-start gap-3">
          <span className="flex-shrink-0 w-7 h-7 rounded-full bg-brand-teal text-white text-sm font-semibold flex items-center justify-center">
            {index + 1}
          </span>
          <p className="text-brand-slate leading-relaxed pt-0.5">{step}</p>
        </li>
      ))}
    </ol>
  );
}
