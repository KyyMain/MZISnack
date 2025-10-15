import { z } from 'zod';

export const checkoutSchema = z.object({
  address_id: z.number({
    invalid_type_error: 'Alamat wajib dipilih',
    required_error: 'Alamat wajib dipilih',
  }),
  notes: z.string().optional(),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;
