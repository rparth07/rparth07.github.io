# Editing the 3D portfolio content

Edit **public/data/portfolio.json** in this project. Save valid JSON, then refresh http://127.0.0.1:5173/. Content is fetched once before the page and its animations start. Editing this file after deployment works without a JavaScript rebuild: upload the edited file to `data/portfolio.json` on the same host and refresh. Normal redeployment is also fine.

The website uses Parth Raiyani's supplied details. Placeholder About/services text can be replaced directly in JSON; required third-party notices are retained in license files. The locked Parth Coder Avatar v1.0 model is not controlled or changed by this file.

## Content map

| JSON field | What it changes |
| --- | --- |
| site | Page title, description, language, header/loading logo |
| navigation | Menu links; use existing #about, #work, #contact anchors or full external URLs |
| hero | Greeting, name lines, subtitle, and any number of rotating roles |
| about | Heading and paragraphs |
| services | Styled heading fragments, tools label, and service cards with their tools |
| career | Heading and experience timeline entries |
| work | Heading, control labels, and project carousel entries |
| techStack | Heading and technology sphere image entries |
| contact | Email, introduction, and contact labels |
| socialLinks | Both the footer social list and floating social icons |
| resume | Resume link and label |
| footer | Parth Raiyani credit and copyright year |
| loading | Loading/welcome labels and marquee roles |

## Add more entries

Append another object to an existing array, following **public/data/entry-examples.json**. Do not paste the examples file over the full portfolio file: its wrapper keys show where each example belongs. No component edit is needed for additional projects, jobs, service cards, technologies, social links, paragraphs, education entries, or role titles.

- Keep `id` values unique within each list.
- Keep every field shown in the example, including `url: ""` when a project has no external link.
- `tools` is an array of strings, not a comma-separated string.
- Put images in `public/images/`, then use `/images/filename.png` in JSON. JSON cannot generate images or a new logo texture for a technology sphere; supply the corresponding image.
- Social icon choices: `github`, `linkedin`, `google`, `twitter`, `facebook`, `link`.
- Use ordinary text, not HTML. The site safely renders text and accepts local paths, anchor links, and HTTP(S)/email URLs.
- At least one project, technology, name line, hero role, and loading role must remain.
- The existing layout is preserved with the original data. More than two services use the same card design in a scrollable panel so they cannot spill over the desk or following sections. Very long names/descriptions should be checked visually after editing.
- Adding a completely new kind of section (for example testimonials) still needs a component. Arbitrary new JSON keys do not create a new design automatically.

## Check your edit

Run `npm run validate:content`. It checks required fields, array types, icon names, and duplicate IDs. The adjacent JSON Schema also gives compatible editors inline help.

Run `npm run test:content` to verify that adding projects, experience, service cards, and roles renders correctly. Run `npm run build` before deployment.

If the fetched JSON is unavailable or invalid, the website logs the problem and uses the content bundled at its last build. Correct the JSON and refresh; the avatar and normal page remain available. To change this fallback content, rebuild after editing the JSON.


## Parth content migration — schema v2

Personal data is mapped from the supplied JSON. The source's 29 image files were copied into `public/assets/img/`. The 3D avatar stays locked at v1.0.

New editable fields:
- `about.photo`, `about.photoAlt`, and `about.highlights[]` for your photo and summary facts.
- `skills.groups[].items[]` for categorized skill names and images; `techStack.items[]` separately controls the animated spheres.
- `career.items[].highlights[]` and `career.items[].projects[]` for detailed work contributions. Each project has `id`, `name`, and `highlights`.
- `education.items[]` for qualification, institution, period, and score.
- `work.items[].description`, `imageAlt`, and `sourceUrl` alongside the existing demo `url`.
- `contact.lines[]` and `buttonLabel` for the contact invitation.
- `site.keywords` and `favicon` for metadata. Google social icons use `icon: "google"`.

The resume currently links to your GitHub profile, as requested. About paragraphs and both service descriptions are explicitly marked placeholders. Your original About summaries (including “2+ years” and “Senior Software Developer at Tark”) are preserved verbatim; the detailed experience retains the supplied “Software Developer” title.

Use the updated examples: v1 project/job objects need the new fields above before adding them to v2 JSON. The validator reports any missing fields. Name and role text sizes adapt to the supplied longer titles.


## About shortcuts and contact cleanup

About highlights now use `icon: "experience" | "opensource" | "mentor"` and `href` for their interactive shortcut. The dark bitmap icons are replaced by theme-colored vector icons. The contact footer no longer repeats education or renders the original-design credit; edit education in `education.items` only. The repository license files remain separate from visible page content.
