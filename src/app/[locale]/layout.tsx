import LocaleSync from "./LocaleSync";

export default function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  return (
    <>
      <LocaleSync params={params} />
      {children}
    </>
  );
}
