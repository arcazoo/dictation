import { SecondaryActionButton } from './ActionButtons';

export function EmptyState({ title, text, action, onAction }: { title: string; text: string; action?: string; onAction?: () => void }) {
  return (
    <div className="rounded-3xl border border-dashed border-slate-300 bg-white/70 p-8 text-center dark:border-slate-700 dark:bg-slate-900/70">
      <div className="mx-auto mb-4 h-14 w-14 rounded-2xl bg-gradient-to-br from-brand-400 to-sky-500" />
      <h3 className="text-lg font-black">{title}</h3>
      <p className="mx-auto mt-2 max-w-sm text-sm text-slate-500">{text}</p>
      {action ? <SecondaryActionButton className="mt-4" onClick={onAction}>{action}</SecondaryActionButton> : null}
    </div>
  );
}
