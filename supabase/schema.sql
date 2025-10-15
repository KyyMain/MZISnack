-- Enable required extensions
create extension if not exists "uuid-ossp";

-- Custom types
create type public.user_role as enum ('buyer', 'seller');
create type public.order_status as enum (
  'pending',
  'awaiting_payment',
  'paid',
  'processing',
  'shipped',
  'completed',
  'cancelled'
);

-- Profiles
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  name text,
  phone text,
  avatar_url text,
  role user_role not null default 'buyer',
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);

-- Categories
create table if not exists public.categories (
  id bigserial primary key,
  name text not null,
  slug text not null unique,
  description text,
  created_at timestamptz not null default now()
);

-- Products
create table if not exists public.products (
  id bigserial primary key,
  seller_id uuid not null references public.profiles (id) on delete cascade,
  category_id bigint references public.categories (id) on delete set null,
  name text not null,
  slug text not null unique,
  description text,
  price bigint not null check (price >= 0),
  stock int not null default 0 check (stock >= 0),
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists idx_products_seller on public.products (seller_id);
create index if not exists idx_products_category on public.products (category_id);
create index if not exists idx_products_is_active on public.products (is_active);

-- Product images
create table if not exists public.product_images (
  id bigserial primary key,
  product_id bigint not null references public.products (id) on delete cascade,
  url text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists idx_product_images_product on public.product_images (product_id);

-- Carts
create table if not exists public.carts (
  id bigserial primary key,
  user_id uuid not null unique references public.profiles (id) on delete cascade,
  updated_at timestamptz not null default now()
);

-- Cart items
create table if not exists public.cart_items (
  id bigserial primary key,
  cart_id bigint not null references public.carts (id) on delete cascade,
  product_id bigint not null references public.products (id),
  qty int not null check (qty > 0),
  price_snapshot bigint not null check (price_snapshot >= 0),
  created_at timestamptz not null default now()
);

create index if not exists idx_cart_items_cart on public.cart_items (cart_id);
create index if not exists idx_cart_items_product on public.cart_items (product_id);

-- Addresses
create table if not exists public.addresses (
  id bigserial primary key,
  user_id uuid not null references public.profiles (id) on delete cascade,
  label text not null,
  recipient_name text not null,
  phone text not null,
  address_line text not null,
  province text not null,
  city text not null,
  district text not null,
  postal_code text not null,
  is_default boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists idx_addresses_user on public.addresses (user_id);

-- Orders
create table if not exists public.orders (
  id uuid primary key default uuid_generate_v4(),
  code text not null unique,
  buyer_id uuid not null references public.profiles (id) on delete cascade,
  seller_id uuid not null references public.profiles (id) on delete cascade,
  total_amount bigint not null check (total_amount >= 0),
  shipping_cost bigint not null default 0 check (shipping_cost >= 0),
  status order_status not null default 'awaiting_payment',
  payment_driver text not null,
  payment_ref text,
  payment_meta jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_orders_buyer on public.orders (buyer_id);
create index if not exists idx_orders_seller on public.orders (seller_id);
create index if not exists idx_orders_status on public.orders (status);

-- Order items
create table if not exists public.order_items (
  id bigserial primary key,
  order_id uuid not null references public.orders (id) on delete cascade,
  product_id bigint not null references public.products (id),
  product_name_snapshot text not null,
  price bigint not null,
  qty int not null,
  subtotal bigint not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_order_items_order on public.order_items (order_id);

-- Storage bucket for product images
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do update set public = excluded.public;

-- Profile auto creation trigger
create or replace function public.handle_new_user()
returns trigger
security definer
set search_path = public
language plpgsql
as $$
begin
  insert into public.profiles (id, role)
  values (new.id, 'buyer')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

-- Row Level Security Policies
alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.carts enable row level security;
alter table public.cart_items enable row level security;
alter table public.addresses enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- Profiles policies
create policy "Profiles are viewable by owner" on public.profiles
  for select using (auth.uid() = id);

create policy "Profiles are editable by owner" on public.profiles
  for update using (auth.uid() = id);

-- Categories policies (readable by all, managed by service key/admin only)
create policy "Categories readable by all" on public.categories
  for select using (true);

-- Products policies
create policy "Products visible when active" on public.products
  for select using (is_active = true or auth.uid() = seller_id);

create policy "Sellers manage own products" on public.products
  for all using (auth.uid() = seller_id)
  with check (auth.uid() = seller_id);

-- Product images policy
create policy "Product images accessible" on public.product_images
  for select using (true);

create policy "Sellers manage own product images" on public.product_images
  for all using (
    exists (
      select 1 from public.products p
      where p.id = product_id and p.seller_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.products p
      where p.id = product_id and p.seller_id = auth.uid()
    )
  );

-- Carts policies
create policy "Carts readable by owner" on public.carts
  for select using (auth.uid() = user_id);

create policy "Carts insert/update by owner" on public.carts
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Cart items policies
create policy "Cart items readable by owner" on public.cart_items
  for select using (
    exists (
      select 1 from public.carts c
      where c.id = cart_id and c.user_id = auth.uid()
    )
  );

create policy "Cart items managed by owner" on public.cart_items
  for all using (
    exists (
      select 1 from public.carts c
      where c.id = cart_id and c.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.carts c
      where c.id = cart_id and c.user_id = auth.uid()
    )
  );

-- Addresses policies
create policy "Addresses readable by owner" on public.addresses
  for select using (auth.uid() = user_id);

create policy "Addresses managed by owner" on public.addresses
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Orders policies
create policy "Orders readable by owner or seller" on public.orders
  for select using (auth.uid() = buyer_id or auth.uid() = seller_id);

create policy "Orders insert by owner" on public.orders
  for insert with check (auth.uid() = buyer_id);

create policy "Orders update by owner" on public.orders
  for update using (auth.uid() = buyer_id or auth.uid() = seller_id);

-- Order items policies
create policy "Order items readable by owner" on public.order_items
  for select using (
    exists (
      select 1 from public.orders o
      where o.id = order_id and (o.buyer_id = auth.uid() or o.seller_id = auth.uid())
    )
  );
