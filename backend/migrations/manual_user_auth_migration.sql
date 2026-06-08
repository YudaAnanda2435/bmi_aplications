-- Manual migration untuk konsep user-owned data DietCare.
-- Jalankan dari phpMyAdmin atau MySQL client pada database sinagar_dietcare.
-- Jika ada error "Duplicate column/key", berarti bagian tersebut sudah pernah diterapkan.

ALTER TABLE users
    ADD COLUMN IF NOT EXISTS is_active TINYINT(1) NOT NULL DEFAULT 1;

ALTER TABLE residents
    ADD COLUMN IF NOT EXISTS user_id INT NULL,
    ADD INDEX IF NOT EXISTS ix_residents_user_id (user_id);

ALTER TABLE classification_results
    ADD COLUMN IF NOT EXISTS user_id INT NULL,
    ADD INDEX IF NOT EXISTS ix_classification_results_user_id (user_id);

-- Backfill data lama.
-- Prioritas owner resident:
-- 1. residents.created_by jika sudah ada
-- 2. user pertama di tabel users sebagai fallback development
SET @default_user_id := (SELECT id FROM users ORDER BY id LIMIT 1);

UPDATE residents
SET user_id = COALESCE(created_by, @default_user_id)
WHERE user_id IS NULL;

UPDATE classification_results cr
JOIN residents r ON r.id = cr.resident_id
SET cr.user_id = r.user_id
WHERE cr.user_id IS NULL;

-- Foreign key. Jalankan hanya jika constraint belum ada.
ALTER TABLE residents
    ADD CONSTRAINT fk_residents_user_id
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE;

ALTER TABLE classification_results
    ADD CONSTRAINT fk_classification_results_user_id
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE;
