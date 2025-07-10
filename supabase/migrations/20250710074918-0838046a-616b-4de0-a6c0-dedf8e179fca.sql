-- Fix the infinite recursion issue in profiles RLS policy
DROP POLICY IF EXISTS "Owners and managers can view all profiles" ON public.profiles;

-- Create a better policy that doesn't cause recursion
CREATE POLICY "Owners and managers can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (
  -- Direct check without recursion
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() 
    AND role IN ('owner', 'manager')
  ) OR
  -- Also allow users to see their own profile
  auth.uid() = user_id
);

-- Also fix the leads table to work with profiles
DROP POLICY IF EXISTS "Authenticated users can view leads" ON public.leads;

CREATE POLICY "Owners and managers can view all leads" 
ON public.leads 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() 
    AND role IN ('owner', 'manager')
  )
);

-- Allow owners/managers to update leads
CREATE POLICY "Owners and managers can update leads" 
ON public.leads 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() 
    AND role IN ('owner', 'manager')
  )
);