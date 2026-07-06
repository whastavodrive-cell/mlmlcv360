-- Fix check_user_exists to also check auth.users table
CREATE OR REPLACE FUNCTION public.check_user_exists(p_username text, p_email text)
RETURNS TABLE(username_exists boolean, email_exists boolean)
LANGUAGE sql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT 
    EXISTS(SELECT 1 FROM public.profiles WHERE username = LOWER(p_username)) as username_exists,
    EXISTS(SELECT 1 FROM public.profiles WHERE email = LOWER(p_email))
    OR EXISTS(SELECT 1 FROM auth.users WHERE email = LOWER(p_email)) as email_exists;
$function$;