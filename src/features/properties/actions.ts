"use server";

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import {
  PROPERTY_STATUS_LABELS,
  PROPERTY_TRANSACTION_TYPE_LABELS,
  PROPERTY_TYPE_LABELS,
  type PropertyStatus,
  type PropertyTransactionType,
  type PropertyType,
} from "@/features/properties/types";

const PROPERTY_TYPE_VALUES = Object.keys(PROPERTY_TYPE_LABELS) as [
  PropertyType,
  ...PropertyType[],
];
const PROPERTY_STATUS_VALUES = Object.keys(PROPERTY_STATUS_LABELS) as [
  PropertyStatus,
  ...PropertyStatus[],
];
const PROPERTY_TRANSACTION_TYPE_VALUES = Object.keys(
  PROPERTY_TRANSACTION_TYPE_LABELS,
) as [PropertyTransactionType, ...PropertyTransactionType[]];

const createPropertySchema = z.object({
  title: z.string().trim().min(2),
  description: z.string().trim().optional().nullable(),
  price: z.number().min(0),
  city: z.string().trim().min(2),
  district: z.string().trim().min(2),
  neighborhood: z.string().trim().optional().nullable(),
  propertyType: z.enum(PROPERTY_TYPE_VALUES),
  transactionType: z.enum(PROPERTY_TRANSACTION_TYPE_VALUES),
  rooms: z.string().trim().optional(),
  areaM2: z.number().min(1),
  status: z.enum(PROPERTY_STATUS_VALUES),
  agentId: z.string().nullable(),
});

export type CreatePropertyInput = z.infer<typeof createPropertySchema>;

type CreatePropertyResult = { error: string | null };

function generateListingCode(): string {
  const year = new Date().getFullYear();
  const suffix = crypto.randomUUID().replace(/-/g, "").slice(0, 6).toUpperCase();
  return `ARP-${year}-${suffix}`;
}

/**
 * Portföy insert işlemini yalnızca sunucu tarafında, doğrulanmış kullanıcı
 * session'ı üzerinden yapar. Böylece "properties" tablosundaki authenticated
 * INSERT RLS politikası, browser client'taki session senkronizasyon
 * farklarından etkilenmez.
 */
export async function createProperty(
  input: CreatePropertyInput,
): Promise<CreatePropertyResult> {
  const parsed = createPropertySchema.safeParse(input);
  if (!parsed.success) {
    return { error: "Girilen bilgiler geçersiz. Lütfen formu kontrol edin." };
  }

  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "Yetkisiz işlem. Lütfen tekrar giriş yapın." };
  }

  const values = parsed.data;

  const { error } = await supabase.from("properties").insert({
    id: crypto.randomUUID(),
    listing_code: generateListingCode(),
    title: values.title,
    description: values.description || null,
    price: values.price,
    city: values.city,
    district: values.district,
    neighborhood: values.neighborhood || null,
    property_type: values.propertyType,
    transaction_type: values.transactionType,
    rooms: values.rooms || "-",
    area_m2: values.areaM2,
    status: values.status,
    agent_id: values.agentId,
  });

  if (error) {
    return { error: "Portföy eklenirken bir hata oluştu. Lütfen tekrar deneyin." };
  }

  return { error: null };
}
