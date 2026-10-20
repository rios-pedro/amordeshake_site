create type public.menu_category as enum ('shakes', 'lanches', 'refeicoes', 'bebidas');

create table public.menu_items (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null default '',
  price numeric(10, 2) not null check (price >= 0),
  category public.menu_category not null,
  image_url text not null,
  is_available boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index menu_items_category_order_idx on public.menu_items (category, sort_order);

alter table public.menu_items enable row level security;

create policy "Anyone can read available menu items"
  on public.menu_items for select
  using (is_available = true or auth.role() = 'authenticated');

create policy "Authenticated admins can insert menu items"
  on public.menu_items for insert
  to authenticated
  with check (true);

create policy "Authenticated admins can update menu items"
  on public.menu_items for update
  to authenticated
  using (true)
  with check (true);

create policy "Authenticated admins can delete menu items"
  on public.menu_items for delete
  to authenticated
  using (true);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger menu_items_updated_at
before update on public.menu_items
for each row execute function public.set_updated_at();

insert into public.menu_items (name, description, price, category, image_url, sort_order)
values
  ('Shake Tropical', 'Abacaxi, coco e um toque de hortelã', 18.90, 'shakes', 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=800&q=85', 1),
  ('Shake de Morango', 'Cremoso, leve e cheio de sabor', 18.90, 'shakes', 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=85', 2),
  ('Toast de Frango', 'Pão integral, frango e creme de ricota', 16.50, 'lanches', 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=85', 3),
  ('Bowl de Frutas', 'Frutas da estação com crocante de castanhas', 15.90, 'refeicoes', 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=85', 4),
  ('Chá de Ervas', 'Refrescante, sem açúcar e super leve', 9.90, 'bebidas', 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=800&q=85', 5);
