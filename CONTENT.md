# Portfolio content

Edit `data/portfolio.json`, save, and refresh the website. No dependency installation,
HTML edits, or build step is required. Continue serving the folder over HTTP (for
example, `python -m http.server 8000 --bind 127.0.0.1`). Opening index.html directly
as a file cannot load JSON through fetch.

## What to edit

- `profile`: name, greeting, role prefix, animated roles, email, photo, social links.
- `metadata`: browser title, description, keywords, favicon.
- `navigation`: links to the existing section IDs; do not add a new section ID unless
  you also implement that section in HTML. Reorder or rename existing links freely.
- `headings`: existing section heading text.
- `about`: summary cards; each has `title`, `icon`, and a `lines` array.
- `skillGroups`: skill categories; each has `title` and an `items` array of `name`/`icon` objects.
- `experience`: roles with `role`, `company`, `period`, `highlights`, and `projects`.
  Each work project has `name` and a `highlights` array. Use empty arrays when unused.
- `education`: entries with `qualification`, `period`, `score`, and `institution`.
- `projects`: cards with `name`, `description`, `image`, `imageAlt`, `liveUrl`, `sourceUrl`.
- `contact`: heading, message `lines`, and button label. Both email links use `profile.email`.

Array order is display order. Add, remove, or reorder objects to update the page.
Copy an existing object in the relevant array as your starting point. Existing
containers and CSS format new entries automatically. New types of sections require
code; arbitrary new JSON keys do not create new sections.

## Add a project

Append this object inside `projects` (add a comma after the previous object):

```json
{
  "name": "My New Project",
  "description": "Built with React and .NET",
  "image": "assets/img/my-new-project.png",
  "imageAlt": "My New Project screenshot",
  "liveUrl": "https://example.com",
  "sourceUrl": "https://github.com/your-name/your-project"
}
```

Put the referenced screenshot in `assets/img/`. Image paths are relative to the
site root. Use `""` for an unavailable live URL or source URL; its button is omitted.
Skill and about icons may also be `""`. Use the existing Boxicons class names for
navigation/social icons (for example `bx-home` or `bxl-github`).

Text is plain text, not HTML. Use arrays of strings for line breaks and bullet
points. Use valid JSON: double quotes, no comments, no trailing commas. Keep all
top-level keys. A simple syntax check is:

```powershell
python -m json.tool data/portfolio.json > $null
```

## Loading and fallback

`assets/js/content.js` requests JSON on each page load with cache revalidation,
renders it into the existing page structure, then `assets/js/main.js` initializes
navigation, animation, gallery, and project layout. Screenshot loads trigger a
project layout refresh. Text is escaped and unsupported URL schemes are rejected.

The original HTML remains as a fallback for unavailable/invalid JSON or disabled
JavaScript. A load failure is reported in the browser console and shows that
original snapshot. JSON is the editing source for normal operation; fallback HTML
will not automatically update when the JSON changes. Public deployment requires
publishing the JSON and any new images along with the site. Changes appear after
refresh, rather than live-updating already-open pages.

## Copyable entries and editor validation

`data/entry-examples.json` contains templates for a summary card, skill group,
experience, education, and project. Copy the value for the section you want into
that section's array in `data/portfolio.json`; replace the example text with your
own information. The examples file itself is not displayed by the website.

The JSON file references `data/portfolio.schema.json` so compatible editors flag
missing fields and incorrect types as you edit. The website also checks nested
entries before rendering. If something is invalid, the browser console identifies
the field (for example `skillGroups[0].items`) and the original page remains visible.
Use empty strings for unused text/images/URLs and empty arrays for unused lists.

Example skill to append inside an existing skill group's `items` array:

```json
{
  "name": "Python",
  "icon": ""
}
```

Example experience to append inside `experience`:

```json
{
  "role": "Senior Software Developer",
  "company": "Company name",
  "period": "2026 - Present",
  "highlights": ["Describe your contribution."],
  "projects": []
}
```

Run the content-rendering checks with Node (no package installation required):

```powershell
node --test tests/content.test.cjs
```
