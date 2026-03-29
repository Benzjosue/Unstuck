type ErrorStateProps = {
  onRetry?: () => void;
};

export default function ErrorState({ onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      <p className="text-brand-mid text-sm">Something went wrong.</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="text-sm text-brand-teal underline underline-offset-2"
        >
          Tap to try again.
        </button>
      )}
    </div>
  );
}
