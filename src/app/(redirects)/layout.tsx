import DocumentLayout from "@/components/DocumentLayout";
import { DEFAULT_LOCALE } from "@/lib/locales";

export { metadata } from "@/components/DocumentLayout";

const RedirectLayout = ({ children }: { children: React.ReactNode }) => (
  <DocumentLayout locale={DEFAULT_LOCALE}>{children}</DocumentLayout>
);

export default RedirectLayout;
