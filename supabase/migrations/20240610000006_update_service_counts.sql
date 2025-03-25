-- Add a function to update service counts for categories and subcategories
CREATE OR REPLACE FUNCTION update_service_counts()
RETURNS TRIGGER AS $$
BEGIN
  -- Update subcategory counts
  UPDATE subcategories
  SET service_count = (
    SELECT COUNT(*)
    FROM services
    WHERE services.subcategory_id = subcategories.id
    AND services.is_active = true
  )
  WHERE id = NEW.subcategory_id OR id = OLD.subcategory_id;
  
  -- Update category counts
  UPDATE categories
  SET service_count = (
    SELECT COUNT(*)
    FROM services
    JOIN subcategories ON services.subcategory_id = subcategories.id
    WHERE subcategories.category_id = categories.id
    AND services.is_active = true
  )
  WHERE id IN (
    SELECT category_id 
    FROM subcategories 
    WHERE id = NEW.subcategory_id OR id = OLD.subcategory_id
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add service_count column to subcategories if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'subcategories' AND column_name = 'service_count') THEN
    ALTER TABLE subcategories ADD COLUMN service_count INTEGER DEFAULT 0;
  END IF;
END$$;

-- Add service_count column to categories if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'categories' AND column_name = 'service_count') THEN
    ALTER TABLE categories ADD COLUMN service_count INTEGER DEFAULT 0;
  END IF;
END$$;

-- Create trigger for services table
DROP TRIGGER IF EXISTS update_service_counts_trigger ON services;
CREATE TRIGGER update_service_counts_trigger
AFTER INSERT OR UPDATE OR DELETE ON services
FOR EACH ROW
EXECUTE FUNCTION update_service_counts();

-- Initialize counts
UPDATE subcategories
SET service_count = (
  SELECT COUNT(*)
  FROM services
  WHERE services.subcategory_id = subcategories.id
  AND services.is_active = true
);

UPDATE categories
SET service_count = (
  SELECT COUNT(*)
  FROM services
  JOIN subcategories ON services.subcategory_id = subcategories.id
  WHERE subcategories.category_id = categories.id
  AND services.is_active = true
);