"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { DEFAULT_LOCALE } from "@/lib/locales";

const BlogListRedirect = () => {
  const router = useRouter();
  const target = `/${DEFAULT_LOCALE}/blog/`;

  useEffect(() => {
    router.replace(target);
  }, [router, target]);

  return (
    <>
      <meta httpEquiv="refresh" content={`0; url=${target}`} />
      <p>
        Redirecting to <a href={target}>{target}</a>...
      </p>
    </>
  );
};

export default BlogListRedirect;
