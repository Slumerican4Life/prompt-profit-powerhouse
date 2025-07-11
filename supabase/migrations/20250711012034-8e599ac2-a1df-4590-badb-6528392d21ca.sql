-- Enable realtime for leads table so dashboard gets live updates
ALTER TABLE public.leads REPLICA IDENTITY FULL;