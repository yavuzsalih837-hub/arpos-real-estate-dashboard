export const siteConfig = {
  name: "ARPOS Real Estate OS",
  shortName: "ARPOS",
  description: "Emlak operasyonunuzu tek merkezden yönetin.",
  locale: "tr-TR",
} as const;

export const readyBackendModules = [
  "Lead Intake",
  "Follow-up Engine",
  "WhatsApp Incoming Reply Handler",
  "Lead & Agent Status Manager",
  "Property Matching Engine",
  "Appointment Engine",
  "Error & Retry Monitor",
] as const;

export const automationCount = readyBackendModules.length;
