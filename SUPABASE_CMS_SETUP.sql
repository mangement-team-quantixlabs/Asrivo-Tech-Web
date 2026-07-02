-- =========================================================================
-- Step 1: Admin Roles Table and Role-based Access Control (RLS) Setup
-- =========================================================================

-- 1. Create the admin_profiles table
CREATE TABLE IF NOT EXISTS public.admin_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('high', 'low')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security on admin_profiles
ALTER TABLE public.admin_profiles ENABLE ROW LEVEL SECURITY;

-- 2. Create helper functions to check roles securely without RLS recursion
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN SECURITY DEFINER SET search_path = public AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_profiles
    WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.is_high_admin()
RETURNS BOOLEAN SECURITY DEFINER SET search_path = public AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_profiles
    WHERE id = auth.uid() AND role = 'high'
  );
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.is_low_admin()
RETURNS BOOLEAN SECURITY DEFINER SET search_path = public AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_profiles
    WHERE id = auth.uid() AND role = 'low'
  );
END;
$$ LANGUAGE plpgsql;

-- 3. RLS Policies for admin_profiles itself
DROP POLICY IF EXISTS "Admins can view admin profiles" ON public.admin_profiles;
CREATE POLICY "Admins can view admin profiles" ON public.admin_profiles
  FOR SELECT
  USING (public.is_admin());

DROP POLICY IF EXISTS "High admins can manage admin profiles" ON public.admin_profiles;
CREATE POLICY "High admins can manage admin profiles" ON public.admin_profiles
  FOR ALL
  USING (public.is_high_admin())
  WITH CHECK (public.is_high_admin());

-- =========================================================================
-- UPDATE RLS POLICIES ON ALL EXISTING TABLES FOR THE CMS SYSTEM
-- =========================================================================

-- ----------------------------------------------------
-- A. CMS Content Tables (Public Read, Edit by Admins, Create/Delete by High Admin)
-- ----------------------------------------------------

-- 1. projects
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable read for all users" ON public.projects;
DROP POLICY IF EXISTS "High admins can create projects" ON public.projects;
DROP POLICY IF EXISTS "Admins can edit projects" ON public.projects;
DROP POLICY IF EXISTS "High admins can delete projects" ON public.projects;

CREATE POLICY "Enable read for all users" ON public.projects FOR SELECT USING (true);
CREATE POLICY "High admins can create projects" ON public.projects FOR INSERT WITH CHECK (public.is_high_admin());
CREATE POLICY "Admins can edit projects" ON public.projects FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "High admins can delete projects" ON public.projects FOR DELETE USING (public.is_high_admin());

-- 2. team_members
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable read for all users" ON public.team_members;
DROP POLICY IF EXISTS "High admins can create team members" ON public.team_members;
DROP POLICY IF EXISTS "Admins can edit team members" ON public.team_members;
DROP POLICY IF EXISTS "High admins can delete team members" ON public.team_members;

CREATE POLICY "Enable read for all users" ON public.team_members FOR SELECT USING (true);
CREATE POLICY "High admins can create team members" ON public.team_members FOR INSERT WITH CHECK (public.is_high_admin());
CREATE POLICY "Admins can edit team members" ON public.team_members FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "High admins can delete team members" ON public.team_members FOR DELETE USING (public.is_high_admin());

-- 3. services
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable read for all users" ON public.services;
DROP POLICY IF EXISTS "High admins can create services" ON public.services;
DROP POLICY IF EXISTS "Admins can edit services" ON public.services;
DROP POLICY IF EXISTS "High admins can delete services" ON public.services;

CREATE POLICY "Enable read for all users" ON public.services FOR SELECT USING (true);
CREATE POLICY "High admins can create services" ON public.services FOR INSERT WITH CHECK (public.is_high_admin());
CREATE POLICY "Admins can edit services" ON public.services FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "High admins can delete services" ON public.services FOR DELETE USING (public.is_high_admin());

-- 4. testimonials
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable read for all users" ON public.testimonials;
DROP POLICY IF EXISTS "High admins can create testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Admins can edit testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "High admins can delete testimonials" ON public.testimonials;

CREATE POLICY "Enable read for all users" ON public.testimonials FOR SELECT USING (true);
CREATE POLICY "High admins can create testimonials" ON public.testimonials FOR INSERT WITH CHECK (public.is_high_admin());
CREATE POLICY "Admins can edit testimonials" ON public.testimonials FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "High admins can delete testimonials" ON public.testimonials FOR DELETE USING (public.is_high_admin());

-- 5. job_postings
ALTER TABLE public.job_postings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable read for all users" ON public.job_postings;
DROP POLICY IF EXISTS "High admins can create job postings" ON public.job_postings;
DROP POLICY IF EXISTS "Admins can edit job postings" ON public.job_postings;
DROP POLICY IF EXISTS "High admins can delete job postings" ON public.job_postings;

CREATE POLICY "Enable read for all users" ON public.job_postings FOR SELECT USING (true);
CREATE POLICY "High admins can create job postings" ON public.job_postings FOR INSERT WITH CHECK (public.is_high_admin());
CREATE POLICY "Admins can edit job postings" ON public.job_postings FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "High admins can delete job postings" ON public.job_postings FOR DELETE USING (public.is_high_admin());


-- ----------------------------------------------------
-- B. Website Settings Table (Public Read, Full CRUD by High Admin Only)
-- ----------------------------------------------------

-- 6. settings
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable read for all users" ON public.settings;
DROP POLICY IF EXISTS "High admins can create settings" ON public.settings;
DROP POLICY IF EXISTS "High admins can edit settings" ON public.settings;
DROP POLICY IF EXISTS "High admins can delete settings" ON public.settings;

CREATE POLICY "Enable read for all users" ON public.settings FOR SELECT USING (true);
CREATE POLICY "High admins can create settings" ON public.settings FOR INSERT WITH CHECK (public.is_high_admin());
CREATE POLICY "High admins can edit settings" ON public.settings FOR UPDATE USING (public.is_high_admin()) WITH CHECK (public.is_high_admin());
CREATE POLICY "High admins can delete settings" ON public.settings FOR DELETE USING (public.is_high_admin());


-- ----------------------------------------------------
-- C. Inbound Form/Submission Tables (Public Insert, Admins Select/Update, High Admin Delete)
-- ----------------------------------------------------

-- 7. contacts
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable insert for all users" ON public.contacts;
DROP POLICY IF EXISTS "Enable read for authenticated users only" ON public.contacts;
DROP POLICY IF EXISTS "Admins can view contacts" ON public.contacts;
DROP POLICY IF EXISTS "Admins can update contacts" ON public.contacts;
DROP POLICY IF EXISTS "High admins can delete contacts" ON public.contacts;

CREATE POLICY "Public can submit contacts" ON public.contacts FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view contacts" ON public.contacts FOR SELECT USING (public.is_admin());
CREATE POLICY "Admins can update contacts" ON public.contacts FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "High admins can delete contacts" ON public.contacts FOR DELETE USING (public.is_high_admin());

-- 8. service_inquiries
ALTER TABLE public.service_inquiries ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable insert for all users" ON public.service_inquiries;
DROP POLICY IF EXISTS "Admins can view service inquiries" ON public.service_inquiries;
DROP POLICY IF EXISTS "Admins can update service inquiries" ON public.service_inquiries;
DROP POLICY IF EXISTS "High admins can delete service inquiries" ON public.service_inquiries;

CREATE POLICY "Public can submit service inquiries" ON public.service_inquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view service inquiries" ON public.service_inquiries FOR SELECT USING (public.is_admin());
CREATE POLICY "Admins can update service inquiries" ON public.service_inquiries FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "High admins can delete service inquiries" ON public.service_inquiries FOR DELETE USING (public.is_high_admin());

-- 9. job_applications
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable insert for all users" ON public.job_applications;
DROP POLICY IF EXISTS "Admins can view job applications" ON public.job_applications;
DROP POLICY IF EXISTS "Admins can edit job applications" ON public.job_applications;
DROP POLICY IF EXISTS "High admins can delete job applications" ON public.job_applications;

CREATE POLICY "Public can submit job applications" ON public.job_applications FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view job applications" ON public.job_applications FOR SELECT USING (public.is_admin());
CREATE POLICY "Admins can edit job applications" ON public.job_applications FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "High admins can delete job applications" ON public.job_applications FOR DELETE USING (public.is_high_admin());

-- 10. newsletter_subscribers
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable insert for all users" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "Enable update for users based on email" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "Admins can view newsletter subscribers" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "Public and admins can update subscribers" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "High admins can delete subscribers" ON public.newsletter_subscribers;

CREATE POLICY "Public can subscribe to newsletter" ON public.newsletter_subscribers FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view newsletter subscribers" ON public.newsletter_subscribers FOR SELECT USING (public.is_admin());
CREATE POLICY "Public and admins can update subscribers" ON public.newsletter_subscribers FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "High admins can delete subscribers" ON public.newsletter_subscribers FOR DELETE USING (public.is_high_admin());


-- ----------------------------------------------------
-- D. System Log/Data Tables (Admins Select, System Insert/All)
-- ----------------------------------------------------

-- 11. audit_logs
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable read for authenticated users" ON public.audit_logs;
DROP POLICY IF EXISTS "Admins can view audit logs" ON public.audit_logs;
DROP POLICY IF EXISTS "Anyone can insert audit logs" ON public.audit_logs;

CREATE POLICY "Admins can view audit logs" ON public.audit_logs FOR SELECT USING (public.is_admin());
CREATE POLICY "Anyone can insert audit logs" ON public.audit_logs FOR INSERT WITH CHECK (true);

-- 12. analytics
ALTER TABLE public.analytics ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable insert for all users" ON public.analytics;
DROP POLICY IF EXISTS "Admins can view analytics" ON public.analytics;
DROP POLICY IF EXISTS "Public can insert analytics" ON public.analytics;
DROP POLICY IF EXISTS "High admins can manage analytics" ON public.analytics;

CREATE POLICY "Public can insert analytics" ON public.analytics FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view analytics" ON public.analytics FOR SELECT USING (public.is_admin());
CREATE POLICY "High admins can manage analytics" ON public.analytics FOR ALL USING (public.is_high_admin());

-- =========================================================================
-- HOW TO ADD THE FIRST HIGH ADMIN
-- =========================================================================
-- To add yourself or any user as a 'high' admin, sign up the user through the 
-- app interface (or create a user in Supabase Auth), find their user UUID 
-- in the Supabase Auth table, and run:
--
-- INSERT INTO public.admin_profiles (id, email, role) 
-- VALUES ('<USER_UUID>', 'admin@example.com', 'high');
-- =========================================================================
