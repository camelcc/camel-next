import { getSortedPostsData } from '@/lib/posts';
import Link from 'next/link';

export default function BlogPage() {
  const allPostsData = getSortedPostsData();
  
  return (
    <div className="space-y-8">
        {allPostsData.map(({ id, title, date, excerpt, category }) => (
          <article key={id}>
            <div>
              <Link href={`/blog/${id}`}>
                { title }
              </Link>
            </div>
          </article>
        ))}
    </div>
  );
} 