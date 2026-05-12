-- =====================================================
-- ADD USER ROLES & UNIVERSITY TRACKING
-- =====================================================

-- Update profiles table to include university and role
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS university_id INTEGER REFERENCES public.universities(id),
ADD COLUMN IF NOT EXISTS user_role TEXT DEFAULT 'private_student' CHECK (user_role IN ('private_student', 'non_private_student', 'admin')),
ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT FALSE;

-- Insert Nigerian Private Universities
INSERT INTO public.universities (name, abbreviation, location, description) VALUES
('Afe Babalola University', 'ABUAD', 'Ado-Ekiti, Ekiti State', 'Private University'),
('Achievers University', 'AU', 'Owo, Ondo State', 'Private University'),
('Adeleke University', 'AUO', 'Ede, Osun State', 'Private University'),
('Ajayi Crowther University', 'ACU', 'Oyo, Oyo State', 'Private University'),
('Al-Hikmah University', 'AHU', 'Ilorin, Kwara State', 'Private University'),
('American University of Nigeria', 'AUN', 'Yola, Adamawa State', 'Private University'),
('Augustine University', 'AUI', 'Ilara-Epe, Lagos State', 'Private University'),
('Babcock University', 'BU', 'Ilishan-Remo, Ogun State', 'Private University'),
('Baze University', 'BU', 'Abuja, FCT', 'Private University'),
('Bells University of Technology', 'BUT', 'Ota, Ogun State', 'Private University'),
('Benson Idahosa University', 'BIU', 'Benin City, Edo State', 'Private University'),
('Bowen University', 'BU', 'Iwo, Osun State', 'Private University'),
('Caleb University', 'CU', 'Imota, Lagos State', 'Private University'),
('Caritas University', 'CU', 'Enugu, Enugu State', 'Private University'),
('Chrisland University', 'CU', 'Abeokuta, Ogun State', 'Private University'),
('Christopher University', 'CU', 'Mowe, Ogun State', 'Private University'),
('Covenant University', 'CU', 'Ota, Ogun State', 'Private University'),
('Crawford University', 'CU', 'Igbesa, Ogun State', 'Private University'),
('Crescent University', 'CU', 'Abeokuta, Ogun State', 'Private University'),
('Edwin Clark University', 'ECU', 'Kiagbodo, Delta State', 'Private University'),
('Elizade University', 'EU', 'Ilara-Mokin, Ondo State', 'Private University'),
('Evangel University', 'EU', 'Akaeze, Ebonyi State', 'Private University'),
('Fountain University', 'FU', 'Osogbo, Osun State', 'Private University'),
('Godfrey Okoye University', 'GOUNI', 'Enugu, Enugu State', 'Private University'),
('Gregory University', 'GU', 'Uturu, Abia State', 'Private University'),
('Hallmark University', 'HU', 'Ijebu-Itele, Ogun State', 'Private University'),
('Hezekiah University', 'HU', 'Umudi, Imo State', 'Private University'),
('Igbinedion University', 'IU', 'Okada, Edo State', 'Private University'),
('Joseph Ayo Babalola University', 'JABU', 'Ikeji-Arakeji, Osun State', 'Private University'),
('Kings University', 'KU', 'Ode Omu, Osun State', 'Private University'),
('Kwararafa University', 'KU', 'Wukari, Taraba State', 'Private University'),
('Landmark University', 'LMU', 'Omu-Aran, Kwara State', 'Private University'),
('Lead City University', 'LCU', 'Ibadan, Oyo State', 'Private University'),
('Madonna University', 'MU', 'Okija, Anambra State', 'Private University'),
('Mcpherson University', 'MCU', 'Seriki Sotayo, Ogun State', 'Private University'),
('Mountain Top University', 'MTU', 'Ibafo, Ogun State', 'Private University'),
('Nile University', 'NU', 'Abuja, FCT', 'Private University'),
('Novena University', 'NU', 'Ogume, Delta State', 'Private University'),
('Obong University', 'OU', 'Obong Ntak, Akwa Ibom State', 'Private University'),
('Oduduwa University', 'OU', 'Ipetumodu, Osun State', 'Private University'),
('Pan-Atlantic University', 'PAU', 'Lagos, Lagos State', 'Private University'),
('Paul University', 'PU', 'Awka, Anambra State', 'Private University'),
('Redeemers University', 'RUN', 'Ede, Osun State', 'Private University'),
('Renaissance University', 'RU', 'Enugu, Enugu State', 'Private University'),
('Rhema University', 'RU', 'Aba, Abia State', 'Private University'),
('Ritman University', 'RU', 'Ikot Ekpene, Akwa Ibom State', 'Private University'),
('Salem University', 'SU', 'Lokoja, Kogi State', 'Private University'),
('Samuel Adegboyega University', 'SAU', 'Ogwa, Edo State', 'Private University'),
('Southwestern University', 'SU', 'Oku Owa, Ogun State', 'Private University'),
('Tansian University', 'TU', 'Umunya, Anambra State', 'Private University'),
('Veritas University', 'VU', 'Abuja, FCT', 'Private University'),
('Wellspring University', 'WU', 'Evbuobanosa, Edo State', 'Private University'),
('Wesley University', 'WU', 'Ondo, Ondo State', 'Private University'),
('Western Delta University', 'WDU', 'Oghara, Delta State', 'Private University'),
('Other (Non-Private University)', 'OTHER', 'Nigeria', 'For students from federal/state universities')
ON CONFLICT DO NOTHING;

-- Create index for faster university lookups
CREATE INDEX IF NOT EXISTS idx_profiles_university ON public.profiles(university_id);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(user_role);

SELECT 'User roles and universities added successfully!' AS status;
