# manishsinha.me

Personal site: a bio page at `/` and a book catalogue at `/books`.
Built with [Astro](https://astro.build) and published to GitHub Pages by
`.github/workflows/deploy.yml` on every push to `gh-pages`.

## Adding a book

Add one JSON file to `data/books/` and open a pull request. The file name is
the book's URL: `data/books/the-martian.json` becomes `/books/the-martian/`.

```json
{
  "title": "The Martian",
  "author": "Andy Weir",
  "year": 2011,
  "cover": "https://covers.openlibrary.org/b/id/11447888-L.jpg",
  "genres": ["sci-fi", "survival"],
  "length": "medium",
  "fiction": true,
  "themes": ["survival", "problem solving"],
  "goodreads": "https://www.goodreads.com/...",
  "amazon": "https://www.amazon.com/...",
  "publisherDescription": "",
  "description": "My own description of the book.",
  "reasons": ["want hard sci-fi that is actually funny"],
  "dislikes": ["The jokes all have the same voice"],
  "series": "some-series",
  "seriesOrder": 1,
  "universe": "some-universe"
}
```

- `title`, `author`, `genres`, `length`, `fiction`, `themes` and `reasons` are required.
- `reasons` each finish the sentence "You should read this if you…". They are what the search box matches.
- `genres`, `themes` and `length` are free-form tags. A new tag shows up as a filter automatically.
- `cover` is optional. Without it, or if the image fails to load, a generated cover is shown.
- `series` and `universe` are optional and refer to file names in `data/series/` and `data/universes/`.

## Series and universes

A series is an ordered set of books: `data/series/<slug>.json` with `name`,
and optionally `author`, `description` and `universe`. Books join it with
`"series": "<slug>"` and `"seriesOrder"`.

A universe groups series that share a world: `data/universes/<slug>.json`
with `name`, and optionally `author` and `description`. A series joins it with
`"universe": "<slug>"`; a standalone book can join one directly the same way.

The build fails with a message naming the file if a required field is missing
or a series or universe reference points at nothing.

## Running locally

```bash
npm install
npm run dev
```
