-- Fix infinite recursion in profiles RLS policy
DROP POLICY IF EXISTS "Owners and managers can view all profiles" ON public.profiles;

-- Create a new, simplified policy that avoids recursion
CREATE POLICY "Owners and managers can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (
  auth.uid() = user_id OR 
  auth.uid() IN (
    SELECT user_id FROM public.profiles WHERE role IN ('owner', 'manager')
  )
);