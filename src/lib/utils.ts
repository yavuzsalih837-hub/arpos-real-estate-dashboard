import { clsx, type ClassValue } from "clsx"
import { format } from "date-fns"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Gerçek Supabase entegrasyonuna kadar sunucu bileşenlerinde ağ gecikmesini
 * simüle eder, böylece loading.tsx / Suspense akışı gerçek veriyle aynı
 * şekilde çalışır.
 */
export async function simulateNetworkDelay(ms = 250) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

const currencyFormatter = new Intl.NumberFormat("tr-TR", {
  style: "currency",
  currency: "TRY",
  maximumFractionDigits: 0,
});

export function formatCurrencyTRY(amount: number): string {
  return currencyFormatter.format(amount);
}

/**
 * Mock veride tüm tarihler saat dilimi eki olmadan (yerel saat olarak)
 * saklanır; `Date.toISOString()` UTC'ye çevirdiği için burada kullanılmaz.
 * İstemci tarafında yeni bir tarih üretilirken bu fonksiyon kullanılmalıdır.
 */
export function toNaiveISOString(date: Date): string {
  return format(date, "yyyy-MM-dd'T'HH:mm:ss.SSS");
}
