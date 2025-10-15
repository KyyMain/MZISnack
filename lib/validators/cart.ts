import { z } from 'zod';

export const addToCartSchema = z.object({
  product_id: z.number(),
  qty: z.number().int().min(1, 'Minimal 1'),
});

export const updateCartSchema = z.object({
  item_id: z.number(),
  qty: z.number().int().min(0),
});

export type AddToCartInput = z.infer<typeof addToCartSchema>;
export type UpdateCartInput = z.infer<typeof updateCartSchema>;
