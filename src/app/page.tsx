import { getSortedPostsData } from '@/lib/posts';
import Link from 'next/link';

export default function Home() {
  const allPostsData = getSortedPostsData();
  return (
      <div className="blog-posts">
        {allPostsData.map(({ id, title, date, excerpt, category }) => (
          <article key={id} className="my-8 border-b border-gray-200 pb-6">
            <h2 className="font-article-title font-bold text-2xl tracking-wide">
              <Link href={`/blog/${id}`} className="hover:underline">
                { title }
              </Link>
            </h2>
            <p className="text-gray-400 text-sm">{new Date(date).toLocaleDateString()}</p>
          </article>
        ))}
      </div>
  );
}
