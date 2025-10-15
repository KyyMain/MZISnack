import { ORDER_STATUS } from '@/lib/constants';
import { Badge } from '@/components/ui/badge';

type Status = keyof typeof ORDER_STATUS;

const STATUS_VARIANTS: Record<Status, 'default' | 'success' | 'warning' | 'danger'> = {
  pending: 'warning',
  awaiting_payment: 'warning',
  paid: 'success',
  processing: 'default',
  shipped: 'default',
  completed: 'success',
  cancelled: 'danger',
};

export function OrderStatusBadge({ status }: { status: Status }) {
  const info = ORDER_STATUS[status];

  return (
    <Badge variant={STATUS_VARIANTS[status]}>
      {info.label}
    </Badge>
  );
}
