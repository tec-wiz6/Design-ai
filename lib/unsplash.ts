export async function getUnsplashImageUrls(
  keywords: string[] = [],
  max = 3
): Promise<string[]> {
  const key = process.env.UNSPLASH_ACCESS_KEY;
  if (!key) return [];
  const q = keywords.length > 0 ? keywords.join(" ") : "modern dark SaaS UI abstract";
  try {
    const res = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(q)}&orientation=landscape&per_page=${max}`,
      { headers: { Authorization: `Client-ID ${key}` }, next: { revalidate: 3600 } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return (data.results ?? []).map((p: { urls: { regular: string } }) => p.urls.regular);
  } catch {
    return [];
  }
}
