-- Add email column to reports table
ALTER TABLE reports ADD COLUMN email VARCHAR(255);

-- Add index on email for faster lookups
CREATE INDEX idx_reports_email ON reports(email);
