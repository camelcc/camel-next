import { getPostData, getAllPostIds } from '@/lib/posts';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  const paths = getAllPostIds();
  return paths;
}

export default async function Post({ params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const postData = await getPostData(id);
    
    return (
      <article className="prose prose-lg max-w-none">
        <h1 className="text-4xl font-bold mb-4">{postData.title}</h1>
        <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
      </article>
    );
  } catch (error) {
    notFound();
  }
} 