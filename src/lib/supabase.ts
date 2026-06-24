import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    'Missing Supabase environment variables. Ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are defined in your .env file.'
  );
}

export const supabase = createClient(
  supabaseUrl ?? 'http://localhost:54321',
  supabaseAnonKey ?? 'public-anon-key'
);

export type Therapy = {
  id: string;
  name: string;
  slug: string;
  description: string;
  duration_minutes: number;
  price: number | null;
  icon: string;
  image_url: string;
  is_active: boolean;
  order_index: number;
};

export type Testimonial = {
  id: string;
  name: string;
  text: string;
  rating: number;
  therapy: string;
  is_visible: boolean;
};

export type Therapist = {
  id: string;
  name: string;
  title: string;
  specialty: string;
  bio: string;
  image_url: string;
  is_active: boolean;
  order_index: number;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  is_available: boolean;
  order_index: number;
  mercadolibre_url: string | null;
};

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image_url: string;
  author: string;
  published_at: string;
  is_published: boolean;
};

export async function getTherapies() {
  const { data, error } = await supabase
    .from('therapies')
    .select('*')
    .eq('is_active', true)
    .order('order_index');
  if (error) return [];
  return data as Therapy[];
}

export async function getTestimonials() {
  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .eq('is_visible', true)
    .order('created_at', { ascending: false })
    .limit(6);
  if (error) return [];
  return data as Testimonial[];
}

export async function getTherapists() {
  const { data, error } = await supabase
    .from('therapists')
    .select('*')
    .eq('is_active', true)
    .order('order_index');
  if (error) return [];
  return data as Therapist[];
}

export async function getProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('order_index');
  if (error) return [];
  return data as Product[];
}

export async function getBlogPosts() {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('is_published', true)
    .order('published_at', { ascending: false });
  if (error) return [];
  return data as BlogPost[];
}
