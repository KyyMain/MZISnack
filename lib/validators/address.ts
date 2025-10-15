import { z } from 'zod';

export const addressSchema = z.object({
  label: z.string().min(1, 'Label alamat wajib diisi'),
  recipient_name: z.string().min(1, 'Nama penerima wajib diisi'),
  phone: z.string().min(8, 'Nomor telepon wajib diisi'),
  address_line: z.string().min(1, 'Alamat lengkap wajib diisi'),
  province: z.string().min(1, 'Provinsi wajib diisi'),
  city: z.string().min(1, 'Kota/Kabupaten wajib diisi'),
  district: z.string().min(1, 'Kecamatan wajib diisi'),
  postal_code: z.string().min(4, 'Kode pos wajib diisi'),
  is_default: z.boolean().optional().default(false),
});

export type AddressInput = z.infer<typeof addressSchema>;
