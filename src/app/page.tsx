import { Loader2, Zap } from "lucide-react";
import { SiteHeader } from "@/components/layout/site-header";
import { ModuleStatusList } from "@/components/dashboard/module-status-list";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { automationCount, siteConfig } from "@/config/site";

export default function Home() {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-background">
      <SiteHeader />

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-4 py-10 sm:px-6 sm:py-14">
        <section className="flex flex-col gap-3">
          <Badge
            variant="outline"
            className="w-fit gap-1.5 border-primary/30 bg-accent text-accent-foreground"
          >
            <Loader2 className="size-3.5 animate-spin" />
            Sistem hazırlanıyor
          </Badge>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {siteConfig.name}
          </h1>
          <p className="max-w-2xl text-base text-muted-foreground sm:text-lg">
            {siteConfig.description}
          </p>
        </section>

        <Card>
          <CardHeader>
            <CardTitle>Sistem hazırlanıyor</CardTitle>
            <CardDescription>
              Dashboard altyapısı kuruluyor. Backend modülleri ve otomasyon
              hatları hazır, arayüz ekranları aşamalı olarak devreye alınacak.
            </CardDescription>
          </CardHeader>
        </Card>

        <div className="grid gap-6 sm:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Hazır backend modülleri
              </CardTitle>
              <CardDescription>
                Aşağıdaki modüller devreye alınmaya hazır durumda.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ModuleStatusList />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Zap className="size-4 text-primary" />
                Otomasyon hatları
              </CardTitle>
              <CardDescription>
                n8n üzerinde çalışan otomasyon workflow&apos;ları
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-semibold tabular-nums">
                  {automationCount}
                </span>
                <span className="text-sm text-muted-foreground">
                  otomasyon hazır
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                Lead alımından randevu planlamaya, WhatsApp yanıtlarından
                hata takibine kadar tüm süreçler otomasyon hatlarıyla
                destekleniyor.
              </p>
            </CardContent>
          </Card>
        </div>

        <p className="text-sm text-muted-foreground">
          Dashboard altyapısı kuruluyor — lead yönetimi, satış pipeline,
          portföy yönetimi ve diğer modüller yakında bu ekranda yer alacak.
        </p>
      </main>
    </div>
  );
}
