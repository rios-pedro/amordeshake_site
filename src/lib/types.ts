export type MenuCategory = 'shakes' | 'lanches' | 'refeicoes' | 'bebidas'

export type MenuItem = {
  id: string
  name: string
  description: string
  price: number
  category: MenuCategory
  image_url: string
  is_available: boolean
  sort_order: number
}
