"use client";

import { useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaw, faEnvelope, faSpinner, faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function PasswordResetPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Bir hata oluştu");
        return;
      }

      setIsSent(true);
    } catch {
      setError("Bir hata oluştu, lütfen tekrar deneyin");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 gradient-hero">
      <div className="w-full max-w-md">
        <div className="bg-card border border-border rounded-2xl p-8 shadow-lg">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 group">
              <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center shadow-md">
                <FontAwesomeIcon icon={faPaw} className="text-white text-xl" />
              </div>
              <span className="text-2xl font-bold font-[family-name:var(--font-heading)] gradient-text">
                Klinik Yönetim
              </span>
            </Link>
          </div>

          {isSent ? (
            <div className="text-center animate-fade-in-up">
              <div className="w-16 h-16 mx-auto rounded-full bg-kp-green/10 flex items-center justify-center mb-4">
                <FontAwesomeIcon icon={faCircleCheck} className="text-kp-green text-2xl" />
              </div>
              <h1 className="text-xl font-bold font-[family-name:var(--font-heading)] mb-2">
                Email Gönderildi
              </h1>
              <p className="text-sm text-muted-foreground mb-6">
                Şifre sıfırlama bağlantısı <strong>{email}</strong> adresine gönderildi.
                Gelen kutunuzu kontrol edin.
              </p>
              <Link href="/giris">
                <Button variant="outline" className="rounded-xl">
                  Giriş Sayfasına Dön
                </Button>
              </Link>
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-bold font-[family-name:var(--font-heading)] text-center mb-2">
                Şifre Sıfırlama
              </h1>
              <p className="text-sm text-muted-foreground text-center mb-6">
                Kayıtlı email adresinizi girin, şifre sıfırlama bağlantısı göndereceğiz.
              </p>

              {error && (
                <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-xl text-sm mb-4 animate-scale-in">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="resetEmail">Email Adresi</Label>
                  <div className="relative">
                    <FontAwesomeIcon icon={faEnvelope} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm" />
                    <Input
                      id="resetEmail"
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

                <Button
                  type="submit"
                  className="w-full h-12 gradient-primary text-white border-0 shadow-md hover:shadow-lg transition-all text-base rounded-xl"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <FontAwesomeIcon icon={faSpinner} className="mr-2 animate-spin" />
                      Gönderiliyor...
                    </>
                  ) : (
                    "Sıfırlama Bağlantısı Gönder"
                  )}
                </Button>
              </form>

              <p className="text-center text-sm text-muted-foreground mt-6">
                Şifrenizi hatırladınız mı?{" "}
                <Link href="/giris" className="text-kp-green font-medium hover:underline">
                  Giriş Yap
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
