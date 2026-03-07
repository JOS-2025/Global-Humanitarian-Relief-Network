-- ═══════════════════════════════════════════════════════════
-- Portfolio & Blog — Full Database Migration
-- Run this in Supabase SQL Editor
-- ═══════════════════════════════════════════════════════════

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── PROFILES ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       TEXT NOT NULL,
  full_name   TEXT,
  avatar_url  TEXT,
  bio         TEXT,
  website     TEXT,
  role        TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();

-- ─── TAGS ─────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.tags (
  id    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name  TEXT NOT NULL UNIQUE,
  slug  TEXT NOT NULL UNIQUE
);

-- ─── POSTS ───────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.posts (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title        TEXT NOT NULL,
  slug         TEXT NOT NULL UNIQUE,
  excerpt      TEXT,
  content      TEXT NOT NULL DEFAULT '',
  cover_image  TEXT,
  published    BOOLEAN NOT NULL DEFAULT FALSE,
  featured     BOOLEAN NOT NULL DEFAULT FALSE,
  author_id    UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  published_at TIMESTAMPTZ,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER posts_updated_at
  BEFORE UPDATE ON public.posts
  FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();

-- Auto-set published_at when post is published
CREATE OR REPLACE FUNCTION public.handle_post_publish()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.published = TRUE AND OLD.published = FALSE THEN
    NEW.published_at = NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER posts_publish_at
  BEFORE UPDATE ON public.posts
  FOR EACH ROW EXECUTE PROCEDURE public.handle_post_publish();

-- ─── POST_TAGS (join table) ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.post_tags (
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
  tag_id  UUID REFERENCES public.tags(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, tag_id)
);

-- ─── PROJECTS ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.projects (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title        TEXT NOT NULL,
  slug         TEXT NOT NULL UNIQUE,
  description  TEXT NOT NULL DEFAULT '',
  content      TEXT,
  cover_image  TEXT,
  demo_url     TEXT,
  github_url   TEXT,
  tech_stack   TEXT[] NOT NULL DEFAULT '{}',
  featured     BOOLEAN NOT NULL DEFAULT FALSE,
  sort_order   INTEGER NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();

-- ─── PRODUCTS ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.products (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name             TEXT NOT NULL,
  description      TEXT,
  price_cents      INTEGER NOT NULL CHECK (price_cents >= 0),
  currency         TEXT NOT NULL DEFAULT 'usd',
  stripe_price_id  TEXT NOT NULL UNIQUE,
  active           BOOLEAN NOT NULL DEFAULT TRUE,
  image_url        TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── ORDERS ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.orders (
  id                      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id                 UUID NOT NULL REFERENCES public.profiles(id) ON DELETE SET NULL,
  product_id              UUID NOT NULL REFERENCES public.products(id),
  stripe_session_id       TEXT NOT NULL UNIQUE,
  stripe_payment_intent   TEXT,
  status                  TEXT NOT NULL DEFAULT 'pending'
                            CHECK (status IN ('pending', 'paid', 'failed', 'refunded')),
  amount_cents            INTEGER NOT NULL,
  currency                TEXT NOT NULL DEFAULT 'usd',
  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── CONTACT MESSAGES ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL,
  email       TEXT NOT NULL,
  subject     TEXT,
  message     TEXT NOT NULL,
  read        BOOLEAN NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY
-- ═══════════════════════════════════════════════════════════

ALTER TABLE public.profiles         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_tags        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Helper: is the current user an admin?
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ── Profiles ──
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles FOR SELECT USING (TRUE);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- ── Posts ──
CREATE POLICY "Published posts are viewable by everyone"
  ON public.posts FOR SELECT USING (published = TRUE OR auth.uid() = author_id OR public.is_admin());

CREATE POLICY "Admins can insert posts"
  ON public.posts FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update posts"
  ON public.posts FOR UPDATE USING (public.is_admin());

CREATE POLICY "Admins can delete posts"
  ON public.posts FOR DELETE USING (public.is_admin());

-- ── Tags ──
CREATE POLICY "Tags are viewable by everyone"
  ON public.tags FOR SELECT USING (TRUE);

CREATE POLICY "Admins can manage tags"
  ON public.tags FOR ALL USING (public.is_admin());

-- ── Post tags ──
CREATE POLICY "Post tags are viewable by everyone"
  ON public.post_tags FOR SELECT USING (TRUE);

CREATE POLICY "Admins can manage post tags"
  ON public.post_tags FOR ALL USING (public.is_admin());

-- ── Projects ──
CREATE POLICY "Projects are viewable by everyone"
  ON public.projects FOR SELECT USING (TRUE);

CREATE POLICY "Admins can manage projects"
  ON public.projects FOR ALL USING (public.is_admin());

-- ── Products ──
CREATE POLICY "Active products are viewable by everyone"
  ON public.products FOR SELECT USING (active = TRUE OR public.is_admin());

CREATE POLICY "Admins can manage products"
  ON public.products FOR ALL USING (public.is_admin());

-- ── Orders ──
CREATE POLICY "Users can view their own orders"
  ON public.orders FOR SELECT USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Service role can insert orders"
  ON public.orders FOR INSERT WITH CHECK (TRUE);  -- Handled by Edge Function (service role)

-- ── Contact messages ──
CREATE POLICY "Anyone can submit contact messages"
  ON public.contact_messages FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "Admins can view contact messages"
  ON public.contact_messages FOR SELECT USING (public.is_admin());

CREATE POLICY "Admins can update contact messages"
  ON public.contact_messages FOR UPDATE USING (public.is_admin());

-- ═══════════════════════════════════════════════════════════
-- INDEXES
-- ═══════════════════════════════════════════════════════════
CREATE INDEX IF NOT EXISTS posts_slug_idx        ON public.posts(slug);
CREATE INDEX IF NOT EXISTS posts_published_idx   ON public.posts(published, published_at DESC);
CREATE INDEX IF NOT EXISTS posts_author_idx      ON public.posts(author_id);
CREATE INDEX IF NOT EXISTS projects_slug_idx     ON public.projects(slug);
CREATE INDEX IF NOT EXISTS projects_featured_idx ON public.projects(featured, sort_order);
CREATE INDEX IF NOT EXISTS orders_user_idx       ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS orders_status_idx     ON public.orders(status);

-- ═══════════════════════════════════════════════════════════
-- SEED — set your user as admin (replace with your user ID)
-- ═══════════════════════════════════════════════════════════
-- UPDATE public.profiles SET role = 'admin' WHERE email = 'your@email.com';
