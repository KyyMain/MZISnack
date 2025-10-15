import { ORDER_STATUS } from '@/lib/constants';

type TimelineProps = {
  current: keyof typeof ORDER_STATUS;
};

const steps: Array<keyof typeof ORDER_STATUS> = [
  'awaiting_payment',
  'paid',
  'processing',
  'shipped',
  'completed',
];

export function OrderTimeline({ current }: TimelineProps) {
  return (
    <ol className="space-y-4">
      {steps.map((step) => {
        const active = steps.indexOf(step) <= steps.indexOf(current);
        return (
          <li key={step} className="flex items-start gap-3">
            <span
              className={`mt-1 h-3 w-3 rounded-full ${
                active ? 'bg-primary' : 'bg-slate-200'
              }`}
            />
            <div>
              <p className="text-sm font-semibold text-slate-900">{ORDER_STATUS[step].label}</p>
              <p className="text-xs text-slate-500">{ORDER_STATUS[step].description}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
