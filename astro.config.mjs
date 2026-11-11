import { defineConfig } from 'astro/config';

// Everything behind /books lives in the top-level books/ folder (data, pages,
// components), so its routes are registered here instead of in src/pages.
const booksRoutes = {
  name: 'books-routes',
  hooks: {
    'astro:config:setup': ({ injectRoute }) => {
      injectRoute({ pattern: '/books', entrypoint: './books/pages/index.astro' });
      injectRoute({ pattern: '/books/[slug]', entrypoint: './books/pages/book.astro' });
      injectRoute({ pattern: '/books/series/[slug]', entrypoint: './books/pages/series.astro' });
      injectRoute({ pattern: '/books/universes/[slug]', entrypoint: './books/pages/universe.astro' });
    },
  },
};

export default defineConfig({
  site: 'https://manishsinha.me',
  integrations: [booksRoutes],
});
