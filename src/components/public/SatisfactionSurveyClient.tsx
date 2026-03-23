"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPaw, faStar, faSpinner, faCheck, faPaperPlane,
} from "@fortawesome/free-solid-svg-icons";
import { Button } from "@/components/ui/button";

export default function SatisfactionSurveyClient() {
  const params = useParams();
  const tenantSlug = params.slug as string;

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) return;
    setSubmitting(true);
    try {
      await fetch("/api/public/survey", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tenantSlug, rating, comment }),
      });
      setSubmitted(true);
    } catch { /* ignore */ }
    finally { setSubmitting(false); }
  };

  const ratingLabels = ["", "Çok Kötü", "Kötü", "Fena Değil", "İyi", "Mükemmel"];

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-green-50 p-4">
        <div className="bg-white rounded-3xl shadow-xl border border-border p-8 max-w-md w-full text-center space-y-4">
          <div className="w-20 h-20 mx-auto rounded-full bg-emerald-50 flex items-center justify-center">
            <FontAwesomeIcon icon={faCheck} className="text-3xl text-emerald-500" />
          </div>
          <h1 className="text-2xl font-bold text-emerald-600">Teşekkür Ederiz!</h1>
          <p className="text-sm text-muted-foreground">Değerli geri bildiriminiz için teşekkür ederiz. Daha iyi hizmet vermek için çalışıyoruz.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="bg-white rounded-3xl shadow-xl border border-border p-8 max-w-md w-full space-y-6">
        {/* Logo */}
        <div className="text-center">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-kp-green to-kp-orange flex items-center justify-center shadow-lg mb-4">
            <FontAwesomeIcon icon={faPaw} className="text-white text-2xl" />
          </div>
          <h1 className="text-2xl font-bold">Nasıl Buldunuz?</h1>
          <p className="text-sm text-muted-foreground mt-1">Hizmetimizi değerlendirin</p>
        </div>

        {/* Star Rating */}
        <div className="text-center">
          <div className="flex justify-center gap-2 mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="transition-transform hover:scale-125"
              >
                <FontAwesomeIcon
                  icon={faStar}
                  className={`text-3xl transition-colors ${
                    star <= (hoverRating || rating) ? "text-amber-400" : "text-muted-foreground/20"
                  }`}
                />
              </button>
            ))}
          </div>
          {(hoverRating || rating) > 0 && (
            <p className="text-sm font-medium text-amber-600 animate-fade-in">
              {ratingLabels[hoverRating || rating]}
            </p>
          )}
        </div>

        {/* Comment */}
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Yorumunuz (opsiyonel)</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Deneyiminizi paylaşın..."
            className="w-full px-4 py-3 border border-border rounded-xl text-sm resize-none h-24 focus:outline-none focus:ring-2 focus:ring-kp-green/20 focus:border-kp-green"
          />
        </div>

        {/* Submit */}
        <Button
          className="w-full h-12 rounded-xl gap-2 bg-gradient-to-r from-kp-green to-kp-orange text-white border-0 shadow-md hover:shadow-lg transition-all"
          onClick={handleSubmit}
          disabled={rating === 0 || submitting}
        >
          {submitting ? (
            <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
          ) : (
            <FontAwesomeIcon icon={faPaperPlane} />
          )}
          Gönder
        </Button>

        <p className="text-[10px] text-muted-foreground text-center">
          Klinik Yönetim ERP/CRM — Evcil Hayvan İşletme Yönetim Sistemi
        </p>
      </div>
    </div>
  );
}
