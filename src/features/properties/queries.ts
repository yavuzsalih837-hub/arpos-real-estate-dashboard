import { createClient } from "@/lib/supabase/server";
import { mockProperties } from "@/features/properties/data";
import type { Property } from "@/features/properties/types";
import type { Database } from "@/types/database";

type PropertyRow = Database["public"]["Tables"]["properties"]["Row"];

function mapPropertyRow(row: PropertyRow): Property {
  return {
    id: row.id,
    listingCode: row.listing_code,
    title: row.title,
    description: row.description ?? "",
    price: row.price,
    city: row.city,
    district: row.district,
    neighborhood: row.neighborhood ?? "",
    propertyType: row.property_type,
    rooms: row.rooms,
    areaM2: row.area_m2,
    status: row.status,
    agentId: row.agent_id ?? "",
    updatedAt: row.updated_at,
  };
}

/**
 * Supabase `properties` tablosundan portföy listesini updated_at azalan
 * sırada çeker. Bağlantı veya sorgu hatası durumunda mevcut mockProperties
 * verisine fallback yapar.
 */
export async function getProperties(): Promise<Property[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("properties")
      .select(
        "id, listing_code, title, description, price, city, district, neighborhood, property_type, rooms, area_m2, status, agent_id, updated_at",
      )
      .order("updated_at", { ascending: false });

    if (error) {
      console.error(
        "Supabase properties sorgusu başarısız, mockProperties kullanılıyor:",
        error,
      );
      return mockProperties;
    }

    return data.map(mapPropertyRow);
  } catch (error) {
    console.error(
      "Supabase properties bağlantısı başarısız, mockProperties kullanılıyor:",
      error,
    );
    return mockProperties;
  }
}
