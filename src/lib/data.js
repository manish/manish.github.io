// Loads every JSON file under /data and checks it, so a bad pull request
// fails the build instead of publishing a broken page.

const slugOf = (path) => path.split('/').pop().replace(/\.json$/, '');

function load(modules) {
  return Object.entries(modules).map(([path, mod]) => ({ slug: slugOf(path), ...mod.default }));
}

const books = load(import.meta.glob('../../data/books/*.json', { eager: true }));
const series = load(import.meta.glob('../../data/series/*.json', { eager: true }));
const universes = load(import.meta.glob('../../data/universes/*.json', { eager: true }));

const errors = [];
const isList = (v) => Array.isArray(v) && v.every((x) => typeof x === 'string' && x.trim());
const seriesSlugs = new Set(series.map((s) => s.slug));
const universeSlugs = new Set(universes.map((u) => u.slug));

for (const b of books) {
  const at = `data/books/${b.slug}.json`;
  for (const key of ['title', 'author', 'length']) {
    if (typeof b[key] !== 'string' || !b[key].trim()) errors.push(`${at}: "${key}" is required`);
  }
  if (typeof b.fiction !== 'boolean') errors.push(`${at}: "fiction" must be true or false`);
  for (const key of ['genres', 'themes', 'reasons']) {
    if (!isList(b[key]) || b[key].length === 0) errors.push(`${at}: "${key}" must be a non-empty list of text`);
  }
  if (b.dislikes !== undefined && !isList(b.dislikes)) errors.push(`${at}: "dislikes" must be a list of text`);
  if (b.series && !seriesSlugs.has(b.series)) errors.push(`${at}: series "${b.series}" has no file in data/series`);
  if (b.universe && !universeSlugs.has(b.universe)) errors.push(`${at}: universe "${b.universe}" has no file in data/universes`);
}
for (const s of series) {
  const at = `data/series/${s.slug}.json`;
  if (!s.name) errors.push(`${at}: "name" is required`);
  if (s.universe && !universeSlugs.has(s.universe)) errors.push(`${at}: universe "${s.universe}" has no file in data/universes`);
}
for (const u of universes) {
  if (!u.name) errors.push(`data/universes/${u.slug}.json: "name" is required`);
}
if (errors.length) throw new Error(`Invalid catalogue data:\n- ${errors.join('\n- ')}`);

books.sort((a, b) => a.title.replace(/^(the|a|an) /i, '').localeCompare(b.title.replace(/^(the|a|an) /i, '')));

const bySeriesOrder = (a, b) => (a.seriesOrder ?? 999) - (b.seriesOrder ?? 999) || (a.year ?? 0) - (b.year ?? 0);

export const getBooks = () => books;
export const getSeries = () => series;
export const getUniverses = () => universes;
export const findSeries = (slug) => series.find((s) => s.slug === slug);
export const findUniverse = (slug) => universes.find((u) => u.slug === slug);
export const booksInSeries = (slug) => books.filter((b) => b.series === slug).sort(bySeriesOrder);
export const seriesInUniverse = (slug) => series.filter((s) => s.universe === slug);
// Books attached to a universe directly, without going through a series.
export const looseBooksInUniverse = (slug) => books.filter((b) => b.universe === slug && !b.series);

// The universe a book belongs to, directly or through its series.
export function universeOf(book) {
  const slug = book.universe ?? findSeries(book.series)?.universe;
  return slug ? findUniverse(slug) : undefined;
}
