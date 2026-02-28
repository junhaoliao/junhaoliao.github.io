"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function BlogRedirect({ slug }: { slug: string }) {
  const router = useRouter();
  const target = `/en/blog/${slug}/`;

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
}
