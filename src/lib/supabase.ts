import { createClient } from '@supabase/supabase-js'
import type { MenuItem } from './types'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)
export const supabase = isSupabaseConfigured ? createClient(supabaseUrl, supabaseAnonKey) : null

export async function fetchMenuItems(): Promise<MenuItem[]> {
  if (!supabase) return []
  const { data, error } = await supabase.from('menu_items').select('*').order('sort_order')
  if (error) throw error
  return data as MenuItem[]
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
  const { error } = await supabase.from('menu_items').insert({
    name: item.name,
    description: item.description,
    price: item.price,
    category: item.category,
    image_url: item.image_url,
    is_available: item.is_available,
    sort_order: item.sort_order,
  })
  if (error) throw error
}

export async function updateMenuItem(item: MenuItem) {
  if (!supabase) throw new Error('Supabase não configurado')
  const { error } = await supabase.from('menu_items').update(item).eq('id', item.id)
  if (error) throw error
}

export async function deleteMenuItem(id: string) {
  if (!supabase) throw new Error('Supabase não configurado')
  const { error } = await supabase.from('menu_items').delete().eq('id', id)
  if (error) throw error
}
