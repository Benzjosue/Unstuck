import { SIGNAL_TABLE } from "@/lib/state-detection/signals";
import SignalChip from "@/components/checkin/SignalChip";

type Category = "physical" | "mental" | "emotional" | "behavioral";

const CATEGORY_LABELS: Record<Category, string> = {
  physical: "Physical",
  mental: "Mental",
  emotional: "Emotional",
  behavioral: "Behavioral",
};

const CATEGORY_ORDER: Category[] = ["physical", "mental", "emotional", "behavioral"];

type SignalGridProps = {
  selectedIds: string[];
  onToggle: (id: string) => void;
};

export default function SignalGrid({ selectedIds, onToggle }: SignalGridProps) {
  const signalsByCategory = CATEGORY_ORDER.reduce<Record<Category, { id: string; label: string }[]>>(
    (acc, cat) => {
      acc[cat] = Object.values(SIGNAL_TABLE)
        .filter((s) => s.category === cat)
        .map((s) => ({ id: s.id, label: s.label }));
      return acc;
    },
    { physical: [], mental: [], emotional: [], behavioral: [] }
  );

  return (
    <div className="space-y-5">
      {CATEGORY_ORDER.map((cat) => (
        <div key={cat}>
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-mid mb-2">
            {CATEGORY_LABELS[cat]}
          </p>
          <div className="flex flex-wrap gap-2">
            {signalsByCategory[cat].map((signal) => (
              <SignalChip
                key={signal.id}
                label={signal.label}
                selected={selectedIds.includes(signal.id)}
                onToggle={() => onToggle(signal.id)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
