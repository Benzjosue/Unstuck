import type { TechniqueType } from "@/lib/types";

type TechniqueCardProps = {
  name: string;
  type: TechniqueType;
};

export default function TechniqueCard({ name, type }: TechniqueCardProps) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-brand-border">
      <span className="inline-block bg-brand-teal-light text-brand-teal text-xs font-semibold uppercase tracking-wide rounded-full px-3 py-1">
        {type}
      </span>
      <h2 className="mt-3 text-xl font-semibold text-brand-slate">{name}</h2>
    </div>
  );
}
