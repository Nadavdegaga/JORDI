
-- Project managers list (for dropdown)
CREATE TABLE public.project_managers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.project_managers TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.project_managers TO authenticated;
GRANT ALL ON public.project_managers TO service_role;

ALTER TABLE public.project_managers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read managers" ON public.project_managers FOR SELECT USING (true);
CREATE POLICY "Public insert managers" ON public.project_managers FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update managers" ON public.project_managers FOR UPDATE USING (true);
CREATE POLICY "Public delete managers" ON public.project_managers FOR DELETE USING (true);

-- Feedback projects (optional list)
CREATE TABLE public.feedback_projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  manager_name TEXT,
  archived BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.feedback_projects TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.feedback_projects TO authenticated;
GRANT ALL ON public.feedback_projects TO service_role;

ALTER TABLE public.feedback_projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read projects" ON public.feedback_projects FOR SELECT USING (true);
CREATE POLICY "Public insert projects" ON public.feedback_projects FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update projects" ON public.feedback_projects FOR UPDATE USING (true);
CREATE POLICY "Public delete projects" ON public.feedback_projects FOR DELETE USING (true);

-- Feedback items
CREATE TABLE public.feedback_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_name TEXT NOT NULL,
  project_name TEXT NOT NULL,
  manager_name TEXT,
  section TEXT NOT NULL,
  section_custom TEXT,
  category TEXT NOT NULL,
  priority TEXT NOT NULL DEFAULT 'nice',
  description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.feedback_items TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.feedback_items TO authenticated;
GRANT ALL ON public.feedback_items TO service_role;

ALTER TABLE public.feedback_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read feedback" ON public.feedback_items FOR SELECT USING (true);
CREATE POLICY "Public insert feedback" ON public.feedback_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update feedback" ON public.feedback_items FOR UPDATE USING (true);
CREATE POLICY "Public delete feedback" ON public.feedback_items FOR DELETE USING (true);

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_feedback_items_updated_at
BEFORE UPDATE ON public.feedback_items
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_feedback_items_project ON public.feedback_items(project_name);
CREATE INDEX idx_feedback_items_status ON public.feedback_items(status);
