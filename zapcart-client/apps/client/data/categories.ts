export interface Category {
  id: string;
  name: string;
  image: string;
  itemCount: number;
  slug: string;
}

export const popularCategories: Category[] = [
  {
    id: "1",
    name: "Electronics",
    image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=500&q=80",
    itemCount: 245,
    slug: "electronics"
  },
  {
    id: "2",
    name: "Fashion",
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=500&q=80",
    itemCount: 532,
    slug: "fashion"
  },
  {
    id: "3",
    name: "Home & Living",
    image: "https://images.unsplash.com/photo-1556912173-46c336c7fd55?w=500&q=80",
    itemCount: 189,
    slug: "home-living"
  },
  {
    id: "4",
    name: "Sports & Outdoors",
    image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=500&q=80",
    itemCount: 156,
    slug: "sports-outdoors"
  },
  {
    id: "5",
    name: "Beauty & Health",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500&q=80",
    itemCount: 298,
    slug: "beauty-health"
  },
  {
    id: "6",
    name: "Books & Media",
    image: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=500&q=80",
    itemCount: 412,
    slug: "books-media"
  }
];
