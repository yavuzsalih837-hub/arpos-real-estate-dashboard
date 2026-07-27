import { AlertCircle } from "lucide-react";
import { LogoMark } from "@/components/shared/logo-mark";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { siteConfig } from "@/config/site";
import { signIn } from "@/app/login/actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-background p-4">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <div className="flex flex-col items-center gap-3 text-center">
          <LogoMark className="size-11" />
          <div>
            <p className="text-sm font-semibold">{siteConfig.shortName}</p>
            <p className="text-xs text-muted-foreground">Real Estate OS</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Giriş Yap</CardTitle>
            <CardDescription>
              Devam etmek için e-posta ve şifrenizi girin.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={signIn} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="email" className="text-sm font-medium">
                  E-posta
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="ornek@arpos.com"
                  required
                  autoFocus
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="password" className="text-sm font-medium">
                  Şifre
                </label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                />
              </div>

              {error ? (
                <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  <AlertCircle className="size-4 shrink-0" />
                  <span>E-posta veya şifre hatalı.</span>
                </div>
              ) : null}

              <Button type="submit" className="w-full">
                Giriş Yap
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
