-- Add quantity column to the cart table if it doesn't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'cart' AND column_name = 'quantity') THEN
        ALTER TABLE public.cart ADD COLUMN quantity INTEGER NOT NULL DEFAULT 1;
    END IF;
END $$;

-- Update existing rows to have a quantity of 1 if they are NULL
UPDATE public.cart SET quantity = 1 WHERE quantity IS NULL;