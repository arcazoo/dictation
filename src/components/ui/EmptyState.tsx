import { SecondaryActionButton } from './ActionButtons';
import { Icon } from './icons';

export function EmptyState({ title, text, action, onAction }: { title: string; text: string; action?: string; onAction?: () => void }) {
  return (
    <div className="rounded-2xl border-2 border-dashed border-ink-900/15 bg-white/60 p-8 text-center dark:border-white/15 dark:bg-ink-800/60">
      <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl border-2 border-brand-600/20 bg-brand-50 text-brand-600 dark:bg-brand-950 dark:text-brand-400">
        <Icon name="sparkles" size={26} />
      </div>
      <h3 className="text-lg font-black text-ink-900 dark:text-white">{title}</h3>
      <p className="mx-auto mt-2 max-w-sm text-sm font-bold text-slate-500 dark:text-slate-400">{text}</p>
      {action ? (
        <SecondaryActionButton className="mt-4" onClick={onAction}>
          {action}
        </SecondaryActionButton>
      ) : null}
    </div>
  );
}
