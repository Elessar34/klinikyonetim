-- PetVet RLS — Tüm tablolarda Row Level Security aktifleştirme
-- Bu SQL'i Supabase SQL Editor'de çalıştırın

-- Tüm tablolarda RLS aktifleştir
ALTER TABLE "Tenant" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Session" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "VerificationToken" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Customer" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Pet" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Service" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Appointment" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Transaction" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Invoice" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "InvoiceItem" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Staff" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "MedicalRecord" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Vaccination" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Prescription" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "LabResult" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "GroomingRecord" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Product" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Supplier" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "AuditLog" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Notification" ENABLE ROW LEVEL SECURITY;

-- Supabase Data API erişimini engelle (biz Prisma kullanıyoruz)
-- Bu policy'ler Data API üzerinden hiçbir erişime izin vermez
-- Uygulama Prisma ile doğrudan PostgreSQL bağlantısı kullandığı için etkilenmez

CREATE POLICY "Deny all via API" ON "Tenant" FOR ALL USING (false);
CREATE POLICY "Deny all via API" ON "User" FOR ALL USING (false);
CREATE POLICY "Deny all via API" ON "Session" FOR ALL USING (false);
CREATE POLICY "Deny all via API" ON "VerificationToken" FOR ALL USING (false);
CREATE POLICY "Deny all via API" ON "Customer" FOR ALL USING (false);
CREATE POLICY "Deny all via API" ON "Pet" FOR ALL USING (false);
CREATE POLICY "Deny all via API" ON "Service" FOR ALL USING (false);
CREATE POLICY "Deny all via API" ON "Appointment" FOR ALL USING (false);
CREATE POLICY "Deny all via API" ON "Transaction" FOR ALL USING (false);
CREATE POLICY "Deny all via API" ON "Invoice" FOR ALL USING (false);
CREATE POLICY "Deny all via API" ON "InvoiceItem" FOR ALL USING (false);
CREATE POLICY "Deny all via API" ON "Staff" FOR ALL USING (false);
CREATE POLICY "Deny all via API" ON "MedicalRecord" FOR ALL USING (false);
CREATE POLICY "Deny all via API" ON "Vaccination" FOR ALL USING (false);
CREATE POLICY "Deny all via API" ON "Prescription" FOR ALL USING (false);
CREATE POLICY "Deny all via API" ON "LabResult" FOR ALL USING (false);
CREATE POLICY "Deny all via API" ON "GroomingRecord" FOR ALL USING (false);
CREATE POLICY "Deny all via API" ON "Product" FOR ALL USING (false);
CREATE POLICY "Deny all via API" ON "Supplier" FOR ALL USING (false);
CREATE POLICY "Deny all via API" ON "AuditLog" FOR ALL USING (false);
CREATE POLICY "Deny all via API" ON "Notification" FOR ALL USING (false);
