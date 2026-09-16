/** Blog frontmatter dates are calendar dates. UTC prevents a previous-day shift west of UTC. */
export const formatBlogDate = (date: string, locale: string): string => {
  if (!date) return "";
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));
};
