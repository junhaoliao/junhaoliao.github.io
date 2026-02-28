"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function BlogListRedirect() {
  const router = useRouter();
  const target = "/en/blog/";

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
