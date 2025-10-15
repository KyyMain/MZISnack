import { notFound } from 'next/navigation';
import { getServiceClient } from '@/lib/supabase/service';
import type { Tables } from '@/lib/supabase/database.types';

export type OrderDetail = Tables<'orders'> & {
  items: Tables<'order_items'>[];
  buyer: Pick<Tables<'profiles'>, 'id' | 'name' | 'phone'> & { email: string | null };
};

export async function getOrderByCode(code: string): Promise<OrderDetail> {
  const client = getServiceClient();
  const { data, error } = await client
    .from('orders')
    .select(
      `
      *,
      buyer:profiles!orders_buyer_id_fkey ( id, name, phone ),
      seller:profiles!orders_seller_id_fkey ( id, name, phone ),
      items:order_items ( * )
    `,
    )
    .eq('code', code)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    notFound();
  }

  return {
    ...data,
    buyer: {
      id: data.buyer?.id ?? '',
      name: data.buyer?.name ?? 'Pelanggan',
      phone: data.buyer?.phone ?? '',
      email: data.buyer?.phone
        ? `${data.buyer.phone.replace(/\D/g, '')}@pelanggan.local`
        : 'pelanggan@contoh.local',
    },
    items: data.items ?? [],
  } as OrderDetail;
}
