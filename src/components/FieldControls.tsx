interface FieldControlsProps {
  index: number;
  total: number;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
}

export default function FieldControls({ index, total, onMoveUp, onMoveDown, onDelete, onDuplicate }: FieldControlsProps) {
  return (
    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
      <button
        type="button"
        onClick={onMoveUp}
        disabled={index === 0}
        className="fb-btn-ghost text-xs px-1.5 py-1 disabled:opacity-30"
        title="Move up"
      >
        ↑
      </button>
      <button
        type="button"
        onClick={onMoveDown}
        disabled={index === total - 1}
        className="fb-btn-ghost text-xs px-1.5 py-1 disabled:opacity-30"
        title="Move down"
      >
        ↓
      </button>
      <button
        type="button"
        onClick={onDuplicate}
        className="fb-btn-ghost text-xs px-1.5 py-1"
        title="Duplicate"
      >
        ⧉
      </button>
      <button
        type="button"
        onClick={onDelete}
        className="fb-btn-ghost text-xs px-1.5 py-1 text-destructive hover:text-destructive"
        title="Delete"
      >
        ✕
      </button>
    </div>
  );
}
