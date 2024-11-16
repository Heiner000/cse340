-- 5.1. insert new record to account table
INSERT INTO public.account (
	account_firstname,
	account_lastname,
	account_email,
	account_password
)
VALUES (
	'Tony',
	'Stark',
	'tony@starkent.com',
	'Iam1ronM@n'
);

-- 5.2. modify tony stark record to change account_type to admin
UPDATE public.account
SET account_type = 'Admin'
WHERE account_id = 1;

-- 5.3. delete tony stark record from db
DELETE FROM public.account
WHERE account_id = 1;

-- 5.4. modify GM Hummer record to say "huge"
UPDATE public.inventory
SET inv_description = 
REPLACE(inv_description, 'the small interiors', 'a huge interior')
WHERE inv_id = '25';

-- 5.5. join make & model from inventory w/ sport classification
SELECT inventory.inv_make, inventory.inv_model, classification.classification_name
FROM public.inventory
INNER JOIN public.classification
ON inventory.classification_id = classification.classification_id
WHERE classification.classification_id = '2';

-- 5.6. update inventory image path
UPDATE public.inventory
SET 
	inv_image = REPLACE(inv_image, '/images', '/images/vehicles'),
	inv_thumbnail = REPLACE(inv_thumbnail, '/images', '/images/vehicles');