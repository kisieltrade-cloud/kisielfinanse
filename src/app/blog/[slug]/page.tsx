/**
 * /blog/[slug] — legacy route.
 * Permanently redirects to the canonical /{category}/{slug} URL.
 * Keeps old links working (social shares, external backlinks, Google index).
 */
import { notFound, permanentRedirect } from 'next/navigation';
import { getAllPosts } from '@/lib/posts';
import { postUrl } from '@/lib/url';

// Odświeżaj co godzinę
export const revalidate = 3600;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export default async function BlogPostRedirect({ params }: Props) {
  const { slug } = await params;
  const posts = await getAllPosts();
  const post = posts.find((p) => p.slug === slug);

  if (!post) notFound();

  // 308 Permanent Redirect → /{category}/{slug}
  permanentRedirect(postUrl(post));
}
