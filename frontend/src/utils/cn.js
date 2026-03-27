// cn utility — merges class names (simplified without clsx/tailwind-merge)
export function cn(...classes) {
  return classes
    .filter(Boolean)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
}
