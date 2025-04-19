'use client';

import Giscus from '@giscus/react';

export default function Comments() {
  return (
    <div className="mt-8">
      <Giscus
        id="comments"
        repo="camelcc/camel-next"
        repoId="R_kgDOOQDxsA"
        category="Announcements"
        categoryId="DIC_kwDOOQDxsM4CpQxC"
        mapping="pathname"
        term="Welcome to @giscus/react component!"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="top"
        theme="preferred_color_scheme"
        lang="en"
        loading="lazy"
      />
    </div>
  );
} 