import defaults from "../../public/data/portfolio.json";
import schema from "../../public/data/portfolio.schema.json";
export type Portfolio = typeof defaults;
export let portfolio: Portfolio = defaults;
export function validateContent(value: unknown, rule: any = schema, path = "portfolio"): string[] {
  const errors: string[] = [];
  if (rule.type === "object") {
    if (!value || typeof value !== "object" || Array.isArray(value)) return [`${path}: expected an object`];
    const obj = value as Record<string, unknown>;
    for (const key of rule.required || []) if (!(key in obj)) errors.push(`${path}.${key}: required`);
    for (const [key, item] of Object.entries(obj)) {
      if (rule.properties[key]) errors.push(...validateContent(item, rule.properties[key], `${path}.${key}`));
      else if (rule.additionalProperties === false) errors.push(`${path}.${key}: unknown field`);
    }
  } else if (rule.type === "array") {
    if (!Array.isArray(value)) return [`${path}: expected an array`];
    if (value.length < (rule.minItems || 0)) errors.push(`${path}: needs at least ${rule.minItems} item(s)`);
    value.forEach((item, index) => errors.push(...validateContent(item, rule.items, `${path}[${index}]`)));
    const ids = value.filter(item => item && typeof item === "object" && "id" in item).map(item => item.id);
    if (new Set(ids).size !== ids.length) errors.push(`${path}: duplicate ids`);
  } else if (rule.type === "string" && typeof value !== "string") errors.push(`${path}: expected text`);
  else if (rule.type === "integer" && !Number.isInteger(value)) errors.push(`${path}: expected an integer`);
  if (typeof value === "number" && rule.minimum !== undefined && value < rule.minimum) errors.push(`${path}: below minimum ${rule.minimum}`);
  if (rule.enum && !rule.enum.includes(value)) errors.push(`${path}: unsupported value`);
  return errors;
}
export function safeUrl(value: string): string {
  if (value.startsWith("#")) return value;
  if (value.startsWith("/") && !value.startsWith("//")) {
    // Content asset paths belong to this portfolio, not the classic site's root.
    return `${import.meta.env.BASE_URL}${value.slice(1)}`;
  }
  try { const url = new URL(value); if (["https:", "http:", "mailto:"].includes(url.protocol)) return value; } catch { /* invalid link */ }
  return "#";
}
export async function loadPortfolio() {
  try {
    const response = await fetch(`${import.meta.env.BASE_URL}data/portfolio.json`, { cache: "no-store", signal: AbortSignal.timeout(8000) });
    if (!response.ok) throw new Error(`Content request failed (${response.status})`);
    const content: unknown = await response.json();
    const errors = validateContent(content);
    if (errors.length) throw new Error(errors.join("\n"));
    portfolio = content as Portfolio;
  } catch (error) { console.error("Portfolio JSON invalid/unavailable; using bundled content.", error); }
  document.title = portfolio.site.title;
  document.documentElement.lang = portfolio.site.language;
  let description = document.querySelector<HTMLMetaElement>('meta[name="description"]');
  if (!description) { description = document.createElement("meta"); description.name = "description"; document.head.append(description); }
  description.content = portfolio.site.description;
  let keywords = document.querySelector<HTMLMetaElement>('meta[name="keywords"]');
  if (!keywords) { keywords = document.createElement("meta"); keywords.name = "keywords"; document.head.append(keywords); }
  keywords.content = portfolio.site.keywords;
  let favicon = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
  if (!favicon) { favicon = document.createElement("link"); favicon.rel = "icon"; document.head.append(favicon); }
  favicon.href = safeUrl(portfolio.site.favicon);
}
