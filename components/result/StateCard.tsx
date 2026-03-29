import type { StateLabel } from "@/lib/types";

type StateCardProps = {
  state: StateLabel;
  explanation: string;
};

export default function StateCard({ state, explanation }: StateCardProps) {
  return (
    <div className="bg-brand-teal-light rounded-2xl p-5">
      <h2 className="text-2xl font-semibold text-brand-slate">{state}</h2>
      <p className="mt-3 text-brand-mid leading-relaxed">{explanation}</p>
    </div>
  );
}
