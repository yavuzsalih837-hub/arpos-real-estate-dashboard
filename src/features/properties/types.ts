export type PropertyStatus = "aktif" | "pasif" | "satildi" | "kiralandi";

export type PropertyType =
  | "daire"
  | "villa"
  | "mustakil-ev"
  | "ofis"
  | "isyeri"
  | "arsa";

export type Property = {
  id: string;
  listingCode: string;
  title: string;
  description: string;
  price: number;
  city: string;
  district: string;
  neighborhood: string;
  propertyType: PropertyType;
  rooms: string;
  areaM2: number;
  status: PropertyStatus;
  agentId: string;
  updatedAt: string;
};

export const PROPERTY_STATUS_LABELS: Record<PropertyStatus, string> = {
  aktif: "Aktif",
  pasif: "Pasif",
  satildi: "Satıldı",
  kiralandi: "Kiralandı",
};

export const PROPERTY_TYPE_LABELS: Record<PropertyType, string> = {
  daire: "Daire",
  villa: "Villa",
  "mustakil-ev": "Müstakil Ev",
  ofis: "Ofis",
  isyeri: "İşyeri",
  arsa: "Arsa",
};
