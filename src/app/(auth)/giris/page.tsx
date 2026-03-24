"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaw, faEnvelope, faLock, faSpinner, faEye, faEyeSlash, faStethoscope, faScissors } from "@fortawesome/free-solid-svg-icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSubdomain } from "@/hooks/useSubdomain";

export default function LoginPage() {
  const router = useRouter();
  const { isVet, isPet, label } = useSubdomain();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
      } else {
        // Fetch session to get business type for correct subdomain redirect
        const sessionRes = await fetch("/api/auth/session");
        const session = await sessionRes.json();
        const bizType = session?.user?.businessType;
        const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "klinikyonetim.net";
        const isLocalhost = window.location.hostname.includes("localhost");

        // If on main domain in production, redirect to correct subdomain
        if (!isLocalhost && bizType) {
          const subPrefix = bizType === "PET_KUAFOR" ? "pet" : "vet";
          const currentHost = window.location.hostname;
          const expectedHost = `${subPrefix}.${rootDomain}`;

          if (currentHost !== expectedHost) {
            window.location.href = `https://${expectedHost}/panel/dashboard`;
            return;
          }
        }

        router.push("/panel/dashboard");
        router.refresh();
      }
    } catch {
      setError("Giriş sırasında bir hata oluştu");
    } finally {
      setIsLoading(false);
    }
  };

  const subIcon = isVet ? faStethoscope : isPet ? faScissors : faPaw;
  const subTitle = isVet ? "Veteriner Giriş" : isPet ? "Pet Kuaför Giriş" : "Hoş Geldiniz";
  const subDesc = isVet
    ? "Veteriner kliniği panelinize giriş yapın"
    : isPet
    ? "Pet kuaför panelinize giriş yapın"
    : "Hesabınıza giriş yapın";

  return (
    <div className="min-h-screen flex">
      {/* Left: Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
          <div className="text-center">
            <Link href="/" className="inline-flex items-center gap-2 group">
              <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                <FontAwesomeIcon icon={subIcon} className="text-white text-xl" />
              </div>
              <span className="text-2xl font-bold font-[family-name:var(--font-heading)] gradient-text">
                {label}
              </span>
            </Link>
            <h1 className="mt-6 text-3xl font-bold font-[family-name:var(--font-heading)]">
              {subTitle}
            </h1>
            <p className="mt-2 text-muted-foreground">
              {subDesc}
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-xl text-sm animate-scale-in">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email Adresi</Label>
              <div className="relative">
                <FontAwesomeIcon icon={faEnvelope} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ornek@email.com"
                  className="pl-10 h-12 rounded-xl"
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Şifre</Label>
                <Link href="/sifre-sifirla" className="text-xs text-kp-green hover:underline">
                  Şifremi Unuttum
                </Link>
              </div>
              <div className="relative">
                <FontAwesomeIcon icon={faLock} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-10 pr-10 h-12 rounded-xl"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showPassword ? "Şifreyi gizle" : "Şifreyi göster"}
                >
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} className="text-sm" />
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 gradient-primary text-white border-0 shadow-md hover:shadow-lg transition-all text-base rounded-xl"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} className="mr-2 animate-spin" />
                  Giriş yapılıyor...
                </>
              ) : (
                "Giriş Yap"
              )}
            </Button>
          </form>

          {/* Register link */}
          <p className="text-center text-sm text-muted-foreground">
            Hesabınız yok mu?{" "}
            <Link href="/kayit" className="text-kp-green font-medium hover:underline">
              Ücretsiz Kayıt Ol
            </Link>
          </p>
        </div>
      </div>

      {/* Right: Decorative */}
      <div className="hidden lg:flex flex-1 items-center justify-center gradient-hero relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-72 h-72 bg-kp-green/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-20 w-64 h-64 bg-kp-orange/10 rounded-full blur-3xl" />
        </div>
        <div className="relative text-center px-12 max-w-lg">
          <div className="w-20 h-20 mx-auto rounded-2xl gradient-primary flex items-center justify-center shadow-xl mb-8">
            <FontAwesomeIcon icon={subIcon} className="text-white text-3xl" />
          </div>
          <h2 className="text-3xl font-bold font-[family-name:var(--font-heading)] mb-4">
            {isVet ? "Veteriner Kliniğinizi" : isPet ? "Pet Kuaförünüzü" : "İşletmenizi"}
            <br />
            <span className="gradient-text">tek panelden yönetin</span>
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            {isVet
              ? "Hasta dosyası, aşı takibi, reçete yazma ve randevu yönetimi tek platformda."
              : isPet
              ? "Bakım takvimi, öncesi/sonrası fotoğraf, müşteri portalı ve online randevu."
              : "Randevu, müşteri, stok ve muhasebe yönetimini tek platformda birleştirin. Veteriner kliniği veya pet kuaför — hepsi burada."}
          </p>
        </div>
      </div>
    </div>
  );
}
