-- EmmaAI Database Schema

CREATE TABLE IF NOT EXISTS public.companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  industry text,
  website_url text,
  description text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own company"
  ON public.companies FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid REFERENCES public.companies(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  description text,
  price_usd numeric,
  features jsonb DEFAULT '[]'::jsonb,
  category text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their company products"
  ON public.products FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.companies WHERE id = products.company_id AND user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.companies WHERE id = products.company_id AND user_id = auth.uid()));

CREATE TABLE IF NOT EXISTS public.competitors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid REFERENCES public.companies(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  website_url text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.competitors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their company competitors"
  ON public.competitors FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.companies WHERE id = competitors.company_id AND user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.companies WHERE id = competitors.company_id AND user_id = auth.uid()));

CREATE TABLE IF NOT EXISTS public.monitoring_queries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid REFERENCES public.companies(id) ON DELETE CASCADE NOT NULL,
  query_text text NOT NULL,
  category text DEFAULT 'general',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.monitoring_queries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their monitoring queries"
  ON public.monitoring_queries FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.companies WHERE id = monitoring_queries.company_id AND user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.companies WHERE id = monitoring_queries.company_id AND user_id = auth.uid()));

CREATE TABLE IF NOT EXISTS public.monitoring_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid REFERENCES public.companies(id) ON DELETE CASCADE NOT NULL,
  query_id uuid REFERENCES public.monitoring_queries(id) ON DELETE SET NULL,
  query_text text NOT NULL,
  ai_model text NOT NULL,
  ai_response text,
  brand_mentioned boolean DEFAULT false,
  mention_rank integer,
  sentiment text CHECK (sentiment IN ('positive', 'neutral', 'negative')),
  competitors_mentioned jsonb DEFAULT '[]'::jsonb,
  accuracy_issues jsonb DEFAULT '[]'::jsonb,
  accuracy_score numeric DEFAULT 100,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.monitoring_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their monitoring results"
  ON public.monitoring_results FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.companies WHERE id = monitoring_results.company_id AND user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.companies WHERE id = monitoring_results.company_id AND user_id = auth.uid()));

CREATE TABLE IF NOT EXISTS public.optimization_tips (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid REFERENCES public.companies(id) ON DELETE CASCADE NOT NULL,
  category text NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  priority text DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'done')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.optimization_tips ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their optimization tips"
  ON public.optimization_tips FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.companies WHERE id = optimization_tips.company_id AND user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.companies WHERE id = optimization_tips.company_id AND user_id = auth.uid()));