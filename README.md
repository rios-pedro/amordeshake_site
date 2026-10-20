# Amor de Shake

Landing page e painel de gestão do cardápio, construídos com React, TypeScript, Tailwind CSS e Supabase.

## Rodando localmente

```bash
npm install
cp .env.example .env.local
npm run dev
```

Preencha `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` no `.env.local` para ativar o cardápio persistido e a rota `/admin`. Sem essas variáveis, a landing page usa dados demonstrativos para continuar funcionando.

## Supabase

O frontend usa a tabela existente `products` com os campos `name`, `description`, `price`, `category`, `image_url` e `is_active`. A aplicação filtra somente as categorias `Shakes`, `Lanches`, `Refeições` e `Bebidas`; categorias auxiliares como `Adicionais`, `Kits` e `Sabores` não aparecem nas abas do cardápio.

O frontend adapta `is_active` para o estado interno de disponibilidade e trata descrições e imagens nulas como valores vazios.

Crie um usuário em **Authentication > Users** para acessar `/admin`. A autenticação usa `signInWithPassword`; qualquer usuário autenticado pode administrar o cardápio nesta versão inicial.

## Rotas

- `/` — landing page pública com CTA para WhatsApp e cardápio por abas.
- `/admin` — login e CRUD de itens do cardápio.

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is enabled on this template. See [this documentation](https://react.dev/learn/react-compiler) for more information.

Note: This will impact Vite dev & build performances.
You can also try [the experimental native React Compiler support in plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md#rust-react-compiler) by using `compiler: true` in the plugin options instead of using the Babel plugin.

## Expanding the Oxlint configuration

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.
