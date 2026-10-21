import { useEffect, useState } from 'react'
import {
  ArrowRight,
  ChevronDown,
  ExternalLink,
  LogIn,
  LogOut,
  Menu,
  Pencil,
  Plus,
  ShieldCheck,
  Sparkles,
  Trash2,
  X,
} from 'lucide-react'
import {
  createMenuItem,
  deleteMenuItem,
  fetchMenuItems,
  isSupabaseConfigured,
  signInAdmin,
  signOutAdmin,
  updateMenuItem,
} from './lib/supabase'
import type { MenuCategory, MenuItem } from './lib/types'
import './App.css'

const WHATSAPP_NUMBER = '61998882132'
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Olá! Quero conhecer o cardápio do Amor de Shake!')}`
const CURRENT_YEAR = new Date().getFullYear()

const categories: { id: MenuCategory; label: string }[] = [
  { id: 'shakes', label: 'Shakes' },
  { id: 'lanches', label: 'Lanches' },
  { id: 'refeicoes', label: 'Refeições' },
  { id: 'bebidas', label: 'Bebidas' },
]

const fallbackMenu: MenuItem[] = [
  {
    id: '1',
    name: 'Monte seu shake',
    description: 'Escolha seus ingredientes favoritos e crie o seu shake perfeito',
    price: 22.0,
    category: 'shakes',
    image_url: '/shake.png',
    is_available: true,
    sort_order: 1,
  },
  {
    id: '2',
    name: 'Shake de Morango',
    description: 'Cremoso, leve e cheio de sabor',
    price: 18.9,
    category: 'shakes',
    image_url: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=85',
    is_available: false,
    sort_order: 2,
  },
  {
    id: '3',
    name: 'Toast de Frango',
    description: 'Pão integral, frango e creme de ricota',
    price: 16.5,
    category: 'lanches',
    image_url: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=85',
    is_available: false,
    sort_order: 3,
  },
  {
    id: '4',
    name: 'Bowl de Frutas',
    description: 'Frutas da estação com crocante de castanhas',
    price: 15.9,
    category: 'refeicoes',
    image_url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=85',
    is_available: false,
    sort_order: 4,
  },
  {
    id: '5',
    name: 'Pink Lemonade',
    description: 'Refrescante, sem açúcar e super leve',
    price: 9.9,
    category: 'bebidas',
    image_url: '/pink_lemonade.png',
    is_available: true,
    sort_order: 1,
  },
  {
    id: '6',
    name: 'Água com gás',
    description: 'Refrescante e sem calorias',
    price: 4.0,
    category: 'bebidas',
    image_url: '/aguagas.png',
    is_available: true,
    sort_order: 2,
  },
  {
    id: '7',
    name: 'Água sem gás',
    description: 'Refrescante e sem calorias',
    price: 3.0,
    category: 'bebidas',
    image_url: '/agua.png',
    is_available: true,
    sort_order: 3,
  },
  {
    id: '8',
    name: 'Hype',
    description: 'O favorito da casa, feito com produtos Herbalife',
    price: 32.0,
    category: 'bebidas',
    image_url: '/hype.png',
    is_available: true,
    sort_order: 5,
  },
  {
    id: '9',
    name: 'Coxinha proteica',
    description: 'A clássica coxinha, mas com proteína extra para manter você saciado',
    price: 14.0,
    category: 'lanches',
    image_url: '/coxinha.png',
    is_available: true,
    sort_order: 1,
  },
  {
    id: '10',
    name: 'Monte seu waffle',
    description: 'Escolha seus ingredientes favoritos e crie o seu waffle perfeito',
    price: 10.0,
    category: 'lanches',
    image_url: '/waffle.png',
    is_available: true,
    sort_order: 2,
  },
  {
    id: '11',
    name: 'Chás',
    description: 'Aumenta a energia mental e física',
    price: 10.0,
    category: 'bebidas',
    image_url: '/chas.png',
    is_available: true,
    sort_order: 4,
  },
]

function App() {
  const [isAdmin] = useState(() => window.location.pathname === '/admin')

  return isAdmin ? <AdminPage /> : <LandingPage />
}

function LandingPage() {
  const [activeCategory, setActiveCategory] = useState<MenuCategory>('shakes')
  const [menu, setMenu] = useState<MenuItem[]>(fallbackMenu)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [menuError, setMenuError] = useState(false)

  useEffect(() => {
    fetchMenuItems()
      .then((items) => items.length && setMenu(items))
      .catch(() => setMenuError(true))
      .finally(() => setLoading(false))
  }, [])

  const visibleItems = menu.filter(
    (item) => item.category === activeCategory && item.is_available,
  )

  return (
    <main className="min-h-screen overflow-hidden bg-[#fbfbf8] text-[#20352d]">
      <nav className="absolute inset-x-0 top-0 z-20 mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-10">
        <a href="#" className="flex items-center gap-2.5" aria-label="Amor de Shake">
          <img src="/logo-amor-de-shake.png" alt="Amor de Shake" className="h-12 w-auto max-w-[190px] object-contain object-left" />
        </a>
        <div className="hidden items-center gap-9 text-sm font-semibold text-[#64736c] md:flex">
          <a className="transition hover:text-[#20352d]" href="#cardapio">Cardápio</a>
          <a className="transition hover:text-[#20352d]" href="#sobre">Nossa essência</a>
          <a className="transition hover:text-[#20352d]" href="#contato">Contato</a>
        </div>
        <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="hidden items-center gap-2 rounded-full bg-[#20352d] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#354b42] sm:flex">
          Fale com a gente <ArrowRight size={16} />
        </a>
        <button className="rounded-full p-2 md:hidden" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Abrir menu">
          {mobileOpen ? <X /> : <Menu />}
        </button>
      </nav>
      {mobileOpen && <div className="absolute right-5 top-20 z-30 flex w-52 flex-col gap-4 rounded-2xl bg-white p-5 text-sm font-semibold shadow-xl md:hidden"><a href="#cardapio" onClick={() => setMobileOpen(false)}>Cardápio</a><a href="#sobre" onClick={() => setMobileOpen(false)}>Nossa essência</a><a href={WHATSAPP_URL} target="_blank" rel="noreferrer">WhatsApp</a></div>}

      <section className="relative mx-auto flex min-h-[700px] max-w-7xl items-center px-6 pb-20 pt-36 lg:min-h-[790px] lg:px-10 lg:pt-28">
        <div className="hero-blob absolute -right-40 -top-24 h-[630px] w-[630px] rounded-full bg-[#f8d44e] lg:h-[790px] lg:w-[790px]" />
        <div className="relative z-10 max-w-xl">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[#77847c] shadow-sm backdrop-blur">
            <Sparkles size={14} className="text-[#d8a900]" /> leve, gostoso e do seu jeito
          </div>
          <h1 className="max-w-xl text-5xl font-black leading-[0.98] tracking-[-0.07em] text-[#20352d] sm:text-7xl">
            Sua jornada de <span className="text-[#d1a400]">bem-estar</span> começa aqui.
          </h1>
          <p className="mt-7 max-w-md text-lg leading-relaxed text-[#66766d]">
            Nutrição prática, sabor de verdade e uma comunidade que torce por você. Venha viver essa energia.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="group inline-flex items-center gap-3 rounded-full bg-[#20352d] px-6 py-4 text-sm font-bold text-white shadow-lg shadow-[#20352d]/15 transition hover:-translate-y-0.5">
              Quero experimentar <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#f8d44e] text-[#20352d] transition group-hover:translate-x-1"><ArrowRight size={16} /></span>
            </a>
            <a href="#cardapio" className="inline-flex items-center gap-2 px-3 py-3 text-sm font-bold text-[#52625a] transition hover:text-[#20352d]">
              Ver cardápio <ChevronDown size={16} />
            </a>
          </div>
          <div className="mt-12 flex items-center gap-8 text-sm text-[#77847c]">
            <div><strong className="block text-2xl font-black text-[#20352d]">+1k</strong> histórias leves</div>
            <div className="h-9 w-px bg-[#d8ded6]" />
            <div><strong className="block text-2xl font-black text-[#20352d]">100%</strong> feito com carinho</div>
          </div>
        </div>
        <div className="hero-photo absolute right-[8%] top-[23%] z-10 hidden h-[430px] w-[330px] rotate-[4deg] overflow-hidden rounded-[10rem_10rem_2rem_2rem] border-[10px] border-white shadow-2xl shadow-[#7b6a20]/20 lg:block">
          <img src="/hype.png" alt="Hype" className="h-full w-full object-cover" />
          <div className="absolute bottom-5 left-5 right-5 rounded-2xl bg-white/90 p-4 backdrop-blur"><p className="text-xs font-bold uppercase tracking-widest text-[#77847c]">o favorito da casa</p><p className="mt-1 font-black">Hype <span className="float-right text-[#d1a400]">R$ 32,00</span></p></div>
        </div>
        <div className="absolute bottom-14 right-[3%] z-10 hidden rotate-[-8deg] rounded-2xl bg-white px-5 py-4 shadow-xl lg:block"><p className="text-xs text-[#77847c]">feito com</p><p className="font-black text-[#20352d]">produtos herbalife <span className="text-[#d1a400]">♥</span></p></div>
      </section>

      <section id="cardapio" className="scroll-mt-10 bg-white px-6 py-24 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div><p className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-[#d1a400]">para todos os momentos</p><h2 className="text-4xl font-black tracking-[-0.06em] sm:text-5xl">Escolha seu <span className="text-[#d1a400]">favorito.</span></h2></div>
            <p className="max-w-xs text-sm leading-relaxed text-[#829087]">Tudo preparado na hora para deixar seu dia mais gostoso e equilibrado.</p>
          </div>
          <div className="mt-12 flex gap-2 overflow-x-auto border-b border-[#e9eee9] pb-px">
            {categories.map((category) => <button key={category.id} onClick={() => setActiveCategory(category.id)} className={`whitespace-nowrap px-5 pb-4 text-sm font-bold transition ${activeCategory === category.id ? 'border-b-2 border-[#d1a400] text-[#20352d]' : 'text-[#9aa59e] hover:text-[#52625a]'}`}>{category.label}</button>)}
          </div>
          {loading ? <div className="grid gap-5 pt-8 sm:grid-cols-2 lg:grid-cols-4">{[1, 2, 3, 4].map((item) => <div key={item} className="h-72 animate-pulse rounded-3xl bg-[#f2f5f0]" />)}</div> : visibleItems.length ? <div className="grid gap-5 pt-8 sm:grid-cols-2 lg:grid-cols-4">{visibleItems.map((item) => <MenuCard item={item} key={item.id} />)}</div> : <div className="py-16 text-center text-[#829087]"><p>Novidades chegando em breve nesta categoria.</p>{menuError && <p className="mt-2 text-xs text-red-500">Não foi possível carregar o cardápio atualizado.</p>}</div>}
        </div>
      </section>

      <section id="sobre" className="mx-auto max-w-7xl px-6 py-24 lg:px-10"><div className="grid items-center gap-12 rounded-[2rem] bg-[#edf3e9] p-8 sm:p-14 lg:grid-cols-[0.8fr_1.2fr] lg:p-20"><div className="relative h-72 overflow-hidden rounded-[2rem] lg:h-96"><img src="/shake.png" alt="Shake de chocolate do Amor de Shake" className="h-full w-full object-cover" /><div className="absolute bottom-5 left-5 rounded-2xl bg-[#f8d44e] px-4 py-3 text-sm font-black">nutrir é um ato de amor</div></div><div><p className="mb-4 text-xs font-black uppercase tracking-[0.2em] text-[#d1a400]">nossa essência</p><h2 className="max-w-lg text-4xl font-black leading-tight tracking-[-0.06em] sm:text-5xl">Mais que um shake, um <span className="text-[#d1a400]">momento seu.</span></h2><p className="mt-6 max-w-lg leading-relaxed text-[#66766d]">O Amor de Shake nasceu para simplificar escolhas saudáveis sem abrir mão do prazer. Aqui você encontra acolhimento, sabor e aquela energia boa para seguir em frente.</p><a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="mt-8 inline-flex items-center gap-2 font-bold text-[#20352d] underline decoration-[#f8d44e] decoration-4 underline-offset-4">Conheça nosso espaço <ArrowRight size={17} /></a></div></div></section>

      <footer id="contato" className="bg-[#20352d] px-6 py-12 text-white lg:px-10"><div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 md:flex-row md:items-center"><div><img src="/logo-amor-de-shake.png" alt="Amor de Shake" className="h-16 w-auto max-w-[220px] object-contain object-left" /><p className="mt-3 text-sm text-white/55">Um brinde a uma vida mais leve.</p></div><a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="inline-flex items-center gap-3 self-start rounded-full bg-[#f8d44e] px-6 py-3 text-sm font-black text-[#20352d] transition hover:bg-[#ffe687]">Pedir pelo WhatsApp <ExternalLink size={16} /></a></div><div className="mx-auto mt-10 max-w-7xl border-t border-white/10 pt-5 text-xs text-white/35">© {CURRENT_YEAR} Amor de Shake · Feito para florescer</div></footer>
    </main>
  )
}

function MenuCard({ item }: { item: MenuItem }) {
  return <article className="group overflow-hidden rounded-3xl border border-[#edf0eb] bg-white transition hover:-translate-y-1 hover:shadow-xl hover:shadow-[#20352d]/8"><div className="relative h-52 overflow-hidden bg-[#edf3e9]"><img src={item.image_url} alt={item.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" /><span className="absolute right-4 top-4 rounded-full bg-white/90 px-3 py-1 text-sm font-black text-[#20352d]">R$ {item.price.toFixed(2).replace('.', ',')}</span></div><div className="p-5"><h3 className="font-black text-[#20352d]">{item.name}</h3><p className="mt-2 min-h-10 text-sm leading-relaxed text-[#829087]">{item.description}</p><a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#d1a400]">Pedir agora <ArrowRight size={14} /></a></div></article>
}

function AdminPage() {
  const [session, setSession] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [items, setItems] = useState<MenuItem[]>([])
  const [editing, setEditing] = useState<MenuItem | null>(null)
  const [error, setError] = useState('')

  const loadItems = () => fetchMenuItems(true).then(setItems).catch(() => setError('Não foi possível carregar o cardápio.'))
  useEffect(() => { if (session) loadItems() }, [session])

  if (!session) return <div className="flex min-h-screen items-center justify-center bg-[#f4f7f1] px-6"><form onSubmit={async (event) => { event.preventDefault(); setError(''); try { await signInAdmin(email, password); setSession(true) } catch { setError('E-mail ou senha inválidos.') } }} className="w-full max-w-md rounded-[2rem] bg-white p-8 shadow-xl shadow-[#20352d]/5"><div className="mb-8 flex items-center gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#f8d44e]"><ShieldCheck /></span><div><p className="text-xs font-black uppercase tracking-widest text-[#9aa59e]">painel seguro</p><h1 className="text-2xl font-black">Gestão do cardápio</h1></div></div><label className="mb-2 block text-sm font-bold">E-mail<input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required className="admin-input" /></label><label className="mb-2 block text-sm font-bold">Senha<input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required className="admin-input" /></label>{!isSupabaseConfigured && <p className="my-4 rounded-xl bg-[#fff8dc] p-3 text-xs text-[#8c6f00]">Configure VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY para ativar o login.</p>}{error && <p className="my-4 text-sm font-semibold text-red-600">{error}</p>}<button className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-[#20352d] py-3.5 font-bold text-white transition hover:bg-[#354b42]">Entrar <LogIn size={17} /></button><a href="/" className="mt-5 block text-center text-sm font-semibold text-[#829087]">Voltar para o site</a></form></div>

  return <div className="min-h-screen bg-[#f4f7f1]"><header className="border-b border-[#e1e8df] bg-white px-6 py-5"><div className="mx-auto flex max-w-7xl items-center justify-between"><a href="/" className="flex items-center gap-3 font-black"><img src="/logo-amor-de-shake.png" alt="Amor de Shake" className="h-11 w-auto max-w-[170px] object-contain object-left" /><span className="rounded-full bg-[#edf3e9] px-3 py-1 text-[10px] uppercase tracking-widest text-[#718077]">admin</span></a><button onClick={async () => { await signOutAdmin(); setSession(false) }} className="flex items-center gap-2 text-sm font-bold text-[#66766d]"><LogOut size={16} /> Sair</button></div></header><div className="mx-auto max-w-7xl px-6 py-12"><div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-xs font-black uppercase tracking-widest text-[#d1a400]">conteúdo do site</p><h1 className="mt-2 text-4xl font-black tracking-tight">Cardápio</h1></div><button onClick={() => setEditing({ id: '', name: '', description: '', price: 0, category: 'shakes', image_url: '', is_available: true, sort_order: items.length + 1 })} className="flex items-center justify-center gap-2 rounded-full bg-[#20352d] px-5 py-3 text-sm font-bold text-white"><Plus size={17} /> Novo item</button></div><div className="grid gap-4">{items.map((item) => <div key={item.id} className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm"><img src={item.image_url} alt="" className="h-16 w-16 rounded-xl object-cover" /><div className="min-w-0 flex-1"><h2 className="font-black">{item.name}</h2><p className="truncate text-sm text-[#829087]">{item.description}</p></div><span className="hidden rounded-full bg-[#edf3e9] px-3 py-1 text-xs font-bold capitalize text-[#607067] sm:block">{item.category}</span><span className="font-black">R$ {item.price.toFixed(2).replace('.', ',')}</span><button onClick={() => setEditing(item)} className="rounded-full p-2 text-[#829087] hover:bg-[#f4f7f1] hover:text-[#20352d]" aria-label={`Editar ${item.name}`}><Pencil size={17} /></button><button onClick={async () => { if (window.confirm('Remover este item?')) { await deleteMenuItem(item.id); loadItems() } }} className="rounded-full p-2 text-[#829087] hover:bg-red-50 hover:text-red-600" aria-label={`Remover ${item.name}`}><Trash2 size={17} /></button></div>)}</div></div>{editing && <MenuEditor item={editing} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); loadItems() }} />}</div>
}

function MenuEditor({ item, onClose, onSaved }: { item: MenuItem; onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState(item)
  const [saving, setSaving] = useState(false)
  const update = (key: keyof MenuItem, value: string | number | boolean) => setForm((current) => ({ ...current, [key]: value }))
  return <div className="fixed inset-0 z-40 flex items-end justify-center bg-[#20352d]/35 p-4 sm:items-center"><form onSubmit={async (event) => { event.preventDefault(); setSaving(true); if (item.id) await updateMenuItem(form); else await createMenuItem(form); setSaving(false); onSaved() }} className="w-full max-w-lg rounded-[2rem] bg-white p-7 shadow-2xl"><div className="mb-6 flex items-center justify-between"><h2 className="text-2xl font-black">{item.id ? 'Editar item' : 'Novo item'}</h2><button type="button" onClick={onClose} className="rounded-full p-2 hover:bg-[#f4f7f1]"><X /></button></div><div className="grid gap-4"><label className="text-sm font-bold">Nome<input className="admin-input" required value={form.name} onChange={(e) => update('name', e.target.value)} /></label><label className="text-sm font-bold">Descrição<textarea className="admin-input min-h-20" required value={form.description} onChange={(e) => update('description', e.target.value)} /></label><div className="grid grid-cols-2 gap-4"><label className="text-sm font-bold">Preço<input className="admin-input" type="number" step="0.01" required value={form.price} onChange={(e) => update('price', Number(e.target.value))} /></label><label className="text-sm font-bold">Categoria<select className="admin-input" value={form.category} onChange={(e) => update('category', e.target.value)}>{categories.map((category) => <option key={category.id} value={category.id}>{category.label}</option>)}</select></label></div><label className="text-sm font-bold">URL da imagem<input className="admin-input" type="url" required value={form.image_url} onChange={(e) => update('image_url', e.target.value)} /></label><label className="flex items-center gap-3 text-sm font-bold"><input type="checkbox" checked={form.is_available} onChange={(e) => update('is_available', e.target.checked)} className="h-4 w-4 accent-[#d1a400]" /> Disponível no cardápio</label></div><button disabled={saving} className="mt-7 w-full rounded-full bg-[#20352d] py-3.5 font-bold text-white disabled:opacity-60">{saving ? 'Salvando...' : 'Salvar item'}</button></form></div>
}

export default App
