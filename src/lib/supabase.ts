import { createClient } from '@supabase/supabase-js'
import type { MenuCategory, MenuItem } from './types'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)
export const supabase = isSupabaseConfigured ? createClient(supabaseUrl, supabaseAnonKey) : null

const categoryAliases: Record<string, MenuCategory> = {
  shakes: 'shakes',
  shake: 'shakes',
  lanches: 'lanches',
  lanche: 'lanches',
  refeicoes: 'refeicoes',
  'refeições': 'refeicoes',
  refeicao: 'refeicoes',
  'refeição': 'refeicoes',
  bebidas: 'bebidas',
  bebida: 'bebidas',
}

function normalizeCategory(value: unknown): MenuCategory {
  const normalized = String(value ?? '').trim().toLowerCase()
  return categoryAliases[normalized] ?? 'shakes'
}

export async function fetchMenuItems(includeInactive = false): Promise<MenuItem[]> {
  if (!supabase) return []
  let query = supabase
    .from('products')
    .select('id,name,description,price,category,image_url,is_active')
    .in('category', ['Shakes', 'Lanches', 'Refeições', 'Bebidas'])
    .order('category')
    .order('name')
  if (!includeInactive) query = query.eq('is_active', true)
  const { data, error } = await query
  if (error) throw error
  return (data ?? []).map((item, index) => ({
    ...item,
    category: normalizeCategory(item.category),
    price: Number(item.price),
    description: item.description ?? '',
    image_url: item.image_url ?? '',
    is_available: item.is_active,
    sort_order: index,
  })) as MenuItem[]
}

export async function signInAdmin(email: string, password: string) {
  if (!supabase) throw new Error('Supabase não configurado')
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
}

export async function signOutAdmin() {
  await supabase?.auth.signOut()
}

export async function createMenuItem(item: Omit<MenuItem, 'id'> | MenuItem) {
  if (!supabase) throw new Error('Supabase não configurado')
  const { error } = await supabase.from('products').insert({
    name: item.name,
    description: item.description,
    price: item.price,
    category: categoryLabel(item.category),
    image_url: item.image_url,
    is_active: item.is_available,
  })
  if (error) throw error
}

export async function updateMenuItem(item: MenuItem) {
  if (!supabase) throw new Error('Supabase não configurado')
  const { error } = await supabase
    .from('products')
    .update({
      name: item.name,
      description: item.description,
      price: item.price,
      category: categoryLabel(item.category),
      image_url: item.image_url,
      is_active: item.is_available,
    })
    .eq('id', item.id)
  if (error) throw error
}

export async function deleteMenuItem(id: string) {
  if (!supabase) throw new Error('Supabase não configurado')
  const { error } = await supabase.from('products').delete().eq('id', id)
  if (error) throw error
}

function categoryLabel(category: MenuCategory) {
  return {
    shakes: 'Shakes',
    lanches: 'Lanches',
    refeicoes: 'Refeições',
    bebidas: 'Bebidas',
  }[category]
}
