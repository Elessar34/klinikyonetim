"use client";

import { useState, useEffect } from "react";
import { useSubdomain } from "@/hooks/useSubdomain";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPaw,
  faEnvelope,
  faLock,
  faSpinner,
  faUser,
  faPhone,
  faBuilding,
  faEye,
  faEyeSlash,
  faStethoscope,
  faStore,
  faScissors,
  faCircleCheck,
} from "@fortawesome/free-solid-svg-icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type BusinessType = "VETERINER" | "PET_KUAFOR";

const businessTypes = [
  {
    value: "VETERINER" as BusinessType,
    label: "Veteriner Kliniği",
    icon: faStethoscope,
    iconColor: "text-kp-green",
    bgColor: "bg-emerald-50",
    borderActive: "border-kp-green ring-2 ring-kp-green/20",
  },
  {
    value: "PET_KUAFOR" as BusinessType,
    label: "Pet Kuaför",
    icon: faScissors,
    iconColor: "text-kp-coral",
    bgColor: "bg-rose-50",
    borderActive: "border-kp-coral ring-2 ring-kp-coral/20",
  },
];

export default function RegisterPage() {
  const router = useRouter();
  const { businessType: subBusinessType, isVet, isPet } = useSubdomain();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    businessName: "",
    businessType: "" as BusinessType | "",
  });

  // Auto-select business type from subdomain and skip step 1
  useEffect(() => {
    if (subBusinessType) {
      setFormData(prev => ({ ...prev, businessType: subBusinessType }));
      setStep(2); // Skip business type selection
    }
  }, [subBusinessType]);

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError("");
  };

  const handleStep1 = () => {
    if (!formData.businessType) {
      setError("Lütfen bir iş tipi seçin");
      return;
    }
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.details) {
          const firstError = Object.values(data.details).flat()[0] as string;
          setError(firstError || data.error);
        } else {
          setError(data.error || "Kayıt sırasında bir hata oluştu");
        }
        return;
      }

      // Auto-login after registration
      router.push("/giris?registered=true");
    } catch {
      setError("Kayıt sırasında bir hata oluştu");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left: Decorative */}
      <div className="hidden lg:flex flex-1 items-center justify-center gradient-hero relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-kp-green/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-64 h-64 bg-kp-orange/10 rounded-full blur-3xl" />
        </div>
        <div className="relative text-center px-12 max-w-lg">
          <div className="w-20 h-20 mx-auto rounded-2xl gradient-primary flex items-center justify-center shadow-xl mb-8">
            <FontAwesomeIcon icon={faPaw} className="text-white text-3xl" />
          </div>
          <h2 className="text-3xl font-bold font-[family-name:var(--font-heading)] mb-4">
            14 Gün{" "}
            <span className="gradient-text">Ücretsiz Deneyin</span>
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-8">
            Kredi kartı gerekmez. Tüm özelliklere erişim.
            Dakikalar içinde kurulumu tamamlayın.
          </p>

          <div className="space-y-3 text-left max-w-xs mx-auto">
            {[
              "Sınırsız müşteri & pet kaydı",
              "Online randevu sistemi",
              "Gelir/gider takibi",
              "Otomatik hatırlatmalar",
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-sm text-foreground/70">
                <FontAwesomeIcon icon={faCircleCheck} className="text-kp-green flex-shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right: Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
          <div className="text-center">
            <Link href="/" className="inline-flex items-center gap-2 group">
              <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                <FontAwesomeIcon icon={faPaw} className="text-white text-xl" />
              </div>
              <span className="text-2xl font-bold font-[family-name:var(--font-heading)] gradient-text">
                Klinik Yönetim
              </span>
            </Link>
            <h1 className="mt-6 text-3xl font-bold font-[family-name:var(--font-heading)]">
              Hesap Oluşturun
            </h1>
            <p className="mt-2 text-muted-foreground text-sm">
              {step === 1
                ? "İş tipinizi seçerek başlayın"
                : "Bilgilerinizi girerek kaydı tamamlayın"}
            </p>
          </div>

          {/* Steps indicator */}
          <div className="flex items-center justify-center gap-3">
            <div className={`w-3 h-3 rounded-full transition-colors ${step >= 1 ? "bg-kp-green" : "bg-muted"}`} />
            <div className={`w-12 h-0.5 transition-colors ${step >= 2 ? "bg-kp-green" : "bg-muted"}`} />
            <div className={`w-3 h-3 rounded-full transition-colors ${step >= 2 ? "bg-kp-green" : "bg-muted"}`} />
          </div>

          {/* Error */}
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-xl text-sm animate-scale-in">
              {error}
            </div>
          )}

          {step === 1 ? (
            /* Step 1: Business Type Selection */
            <div className="space-y-4 animate-fade-in">
              <div className="grid gap-3">
                {businessTypes.map((bt) => (
                  <button
                    key={bt.value}
                    type="button"
                    onClick={() => updateField("businessType", bt.value)}
                    className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${
                      formData.businessType === bt.value
                        ? bt.borderActive
                        : "border-border hover:border-muted-foreground/20"
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-xl ${bt.bgColor} flex items-center justify-center flex-shrink-0`}>
                      <FontAwesomeIcon icon={bt.icon} className={`${bt.iconColor} text-lg`} />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{bt.label}</p>
                      <p className="text-xs text-muted-foreground">
                        {bt.value === "VETERINER" && "Hasta dosyası, aşı takibi, reçete yönetimi"}
                        {bt.value === "PET_KUAFOR" && "Bakım takvimi, fotoğraf portfolyo, online randevu"}
                      </p>
                    </div>
                    {formData.businessType === bt.value && (
                      <FontAwesomeIcon icon={faCircleCheck} className={bt.iconColor} />
                    )}
                  </button>
                ))}
              </div>
              <Button
                onClick={handleStep1}
                className="w-full h-12 gradient-primary text-white border-0 shadow-md hover:shadow-lg transition-all text-base rounded-xl"
              >
                Devam Et
              </Button>
            </div>
          ) : (
            /* Step 2: User Details */
            <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Ad</Label>
                  <div className="relative">
                    <FontAwesomeIcon icon={faUser} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm" />
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => updateField("firstName", e.target.value)}
                      placeholder="Adınız"
                      className="pl-10 h-11 rounded-xl"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Soyad</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => updateField("lastName", e.target.value)}
                    placeholder="Soyadınız"
                    className="h-11 rounded-xl"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="businessName">İşletme Adı</Label>
                <div className="relative">
                  <FontAwesomeIcon icon={faBuilding} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm" />
                  <Input
                    id="businessName"
                    value={formData.businessName}
                    onChange={(e) => updateField("businessName", e.target.value)}
                    placeholder="İşletme adınız"
                    className="pl-10 h-11 rounded-xl"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="registerEmail">Email</Label>
                <div className="relative">
                  <FontAwesomeIcon icon={faEnvelope} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm" />
                  <Input
                    id="registerEmail"
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    placeholder="ornek@email.com"
                    className="pl-10 h-11 rounded-xl"
                    required
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="registerPhone">Telefon (Opsiyonel)</Label>
                <div className="relative">
                  <FontAwesomeIcon icon={faPhone} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm" />
                  <Input
                    id="registerPhone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                    placeholder="+90 5XX XXX XX XX"
                    className="pl-10 h-11 rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="registerPassword">Şifre</Label>
                <div className="relative">
                  <FontAwesomeIcon icon={faLock} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm" />
                  <Input
                    id="registerPassword"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => updateField("password", e.target.value)}
                    placeholder="En az 8 karakter"
                    className="pl-10 pr-10 h-11 rounded-xl"
                    required
                    autoComplete="new-password"
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
                <p className="text-xs text-muted-foreground">
                  En az 8 karakter, 1 büyük harf, 1 küçük harf, 1 rakam
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="flex-1 h-12 rounded-xl"
                >
                  Geri
                </Button>
                <Button
                  type="submit"
                  className="flex-[2] h-12 gradient-primary text-white border-0 shadow-md hover:shadow-lg transition-all text-base rounded-xl"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <FontAwesomeIcon icon={faSpinner} className="mr-2 animate-spin" />
                      Kaydediliyor...
                    </>
                  ) : (
                    "Kayıt Ol"
                  )}
                </Button>
              </div>

              <p className="text-xs text-center text-muted-foreground">
                Kayıt olarak{" "}
                <Link href="/kullanim-sartlari" className="text-kp-green hover:underline">
                  Kullanım Şartları
                </Link>{" "}
                ve{" "}
                <Link href="/gizlilik-politikasi" className="text-kp-green hover:underline">
                  Gizlilik Politikası
                </Link>
                &apos;nı kabul etmiş olursunuz.
              </p>
            </form>
          )}

          {/* Login link */}
          <p className="text-center text-sm text-muted-foreground">
            Zaten hesabınız var mı?{" "}
            <Link href="/giris" className="text-kp-green font-medium hover:underline">
              Giriş Yap
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
