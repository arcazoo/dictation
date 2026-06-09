import { AudioButton } from './AudioButton';

export function AiCoachMessage({ role, text }: { role: 'user' | 'assistant'; text: string }) {
  const assistant = role === 'assistant';
  return (
    <div
      className={`max-w-[94%] rounded-2xl p-3 text-sm leading-6 ${
        assistant
          ? 'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-50'
          : 'ml-auto bg-brand-600 text-white'
      }`}
    >
      {assistant ? (
        <div className="mb-2 flex justify-end">
          <AudioButton text={text} lang="ru-RU" autoLabel="O'qish" />
        </div>
      ) : null}
      {text.split('\n').map((line, index) => (
        <p key={index} className="mb-2 last:mb-0">
          {line}
        </p>
      ))}
    </div>
  );
}
