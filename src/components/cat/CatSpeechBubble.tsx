import { X } from 'lucide-react';

interface CatSpeechBubbleProps {
  text: string;
  onDismiss: () => void;
}

export function CatSpeechBubble({ text, onDismiss }: CatSpeechBubbleProps) {
  return (
    <div
      role="status"
      className="animate-bubble-pop mb-2 max-w-[210px] rounded-2xl rounded-br-sm bg-white border border-slate-200/90 shadow-lg shadow-slate-900/10 px-3.5 py-2 text-xs text-slate-700 flex items-start gap-2"
    >
      <span className="leading-snug font-medium">{text}</span>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onDismiss();
        }}
        aria-label="Dismiss cat message"
        className="text-slate-400 hover:text-slate-600 p-0.5 rounded shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
      >
        <X className="w-3 h-3" aria-hidden="true" />
      </button>
    </div>
  );
}
