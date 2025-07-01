
-- Create a table to store user's customized quick pay preferences
CREATE TABLE public.user_quick_pay_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  service_name TEXT NOT NULL,
  service_icon TEXT NOT NULL,
  service_color TEXT NOT NULL,
  service_type TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, service_name)
);

-- Add Row Level Security (RLS)
ALTER TABLE public.user_quick_pay_preferences ENABLE ROW LEVEL SECURITY;

-- Create policies for user quick pay preferences
CREATE POLICY "Users can view their own quick pay preferences" 
  ON public.user_quick_pay_preferences 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own quick pay preferences" 
  ON public.user_quick_pay_preferences 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own quick pay preferences" 
  ON public.user_quick_pay_preferences 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own quick pay preferences" 
  ON public.user_quick_pay_preferences 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create trigger to update the updated_at column
CREATE TRIGGER update_user_quick_pay_preferences_updated_at
  BEFORE UPDATE ON public.user_quick_pay_preferences
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
