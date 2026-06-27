const PROPERTY_IMAGES = [
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750",
  "https://images.unsplash.com/photo-1564013799919-ab600027ffc6",
  "https://images.unsplash.com/photo-1570129477492-45c003edd2be",
  "https://images.unsplash.com/photo-1484154218962-a197022b5858",
  "https://images.unsplash.com/photo-1510627489930-0c1b0bfb6785",
  "https://images.unsplash.com/photo-1513694203232-719a280e022f",
  "https://images.unsplash.com/photo-1568605114967-8130f3a36994",
  "https://images.unsplash.com/photo-1560518883-ce09059eeffa"
];

export function getPropertyImage(seed?: string | number): string {
  // If the seed already looks like an Unsplash ID (e.g. 1587478640470-89d28fb9fa24)
  // or a full URL, return it properly formatted
  if (typeof seed === 'string') {
    if (seed.startsWith('http')) return seed;
    if (seed.match(/^\d{10,}-\w{8,}$/)) {
      return `https://images.unsplash.com/photo-${seed}?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80`;
    }
  }

  // Otherwise pick consistently from our curated list based on hash
  const str = String(seed || Math.random());
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % PROPERTY_IMAGES.length;
  const baseUrl = PROPERTY_IMAGES[index];
  return `${baseUrl}?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80`;
}
