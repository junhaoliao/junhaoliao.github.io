import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import rehypeStringify from "rehype-stringify";

// Reuse the configured processor across articles. It creates a fresh syntax tree
// and VFile for each call, while plugin setup is performed only once.
const processor = remark()
  .use(remarkGfm)
  .use(remarkRehype, { allowDangerousHtml: true })
  .use(rehypeHighlight)
  .use(rehypeSlug)
  .use(rehypeStringify, { allowDangerousHtml: true })
  .freeze();

export const renderMarkdown = async (content: string): Promise<string> => {
  return (await processor.process(content)).toString();
};
