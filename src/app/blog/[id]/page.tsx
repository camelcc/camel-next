import { getPostData, getAllPostIds } from '@/lib/posts';
import { notFound } from 'next/navigation';
import Comments from '@/components/Comments';

export async function generateStaticParams() {
  const paths = getAllPostIds();
  return paths.map((path) => ({
    id: path,
  }));
}

export default async function Post({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  try {
    const postData = await getPostData(resolvedParams.id);

    return (
      <div>
        <article className="prose prose-lg max-w-none">
          <h1 className="text-2xl font-bold mb-4">{postData.title}</h1>
          <div className="flex items-center gap-2 border-b border-gray-200 pb-4">
            <p className="text-gray-400 text-sm">{new Date(postData.date).toLocaleDateString()}</p>
          </div>
          <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
        </article>
        <Comments />
      </div>
    );
  } catch (error) {
    console.error(error);
    notFound();
  }
} 