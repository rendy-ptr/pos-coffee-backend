export function getOptimizedImageUrl(
  url: string,
  {
    width = 200,
    quality = 80,
    format = 'auto',
    fit = 'crop',
  }: { width?: number; quality?: number; format?: string; fit?: string } = {}
): string {
  if (!url.includes('/upload/')) return url;

  return url.replace(
    '/upload/',
    `/upload/w_${width},q_${quality},f_${format},c_${fit}/`
  );
}
