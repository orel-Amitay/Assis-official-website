const CDN = "https://tennisclubfinejewelry.com/cdn/shop/files";

export type Product = {
  title: string;
  handle: string;
  price: number;
  priceFrom?: boolean;
  image: string;
};

export const heroImage = `${CDN}/IMG_0125_1_copys.png?v=1774445839&width=2000`;
export const heroImageMobile = `${CDN}/88.jpg?v=1774446329&width=1200`;

export const lifestyle = {
  stack: `${CDN}/72_copya.jpg?v=1774446154&width=1600`,
  color: `${CDN}/72.jpg?v=1774445959&width=1600`,
  madeToOrder: `${CDN}/329.jpg?v=1774446203&width=1800`,
};

export const categories = [
  {
    label: "SHOP BRACELETS",
    href: "/collections/bracelets",
    image: `${CDN}/4.jpg?v=1774446041&width=900`,
  },
  {
    label: "SHOP NECKLACES",
    href: "/collections/necklaces",
    image: `${CDN}/61ACE8AC-5AF9-4E2E-BF9F-BE0C67D94CA7.jpg?v=1783440051&width=900`,
  },
  {
    label: "SHOP NEW ARRIVALS",
    href: "/collections/new-arrivals",
    image: `${CDN}/95F24067-0D4D-4773-B82B-BEFBBC4B145D.jpg?v=1783963563&width=900`,
  },
  {
    label: "SHOP THE SHAPE EDIT",
    href: "/collections/shape-edit",
    image: `${CDN}/03D09AD9-2E29-4587-84A7-EC4A1C57036F.jpg?v=1783963730&width=900`,
  },
] as const;

export const signatureProducts: Product[] = [
  {
    title: "Diamond Pave Loop Tennis Bracelet",
    handle: "diamond-pave-loop-tennis-bracelet",
    price: 5765,
    image: `${CDN}/95F24067-0D4D-4773-B82B-BEFBBC4B145D.jpg?v=1783963563&width=900`,
  },
  {
    title: "Diamond Graduating Tennis Necklace",
    handle: "diamond-graduating-tennis-necklace",
    price: 13995,
    image: `${CDN}/61ACE8AC-5AF9-4E2E-BF9F-BE0C67D94CA7.jpg?v=1783440051&width=900`,
  },
  {
    title: "Diamond Graduating Tennis Bracelet",
    handle: "diamond-graduating-tennis-bracelet",
    price: 11480,
    image: `${CDN}/67534906-CAA1-475C-8B14-E22EE90D7D14.jpg?v=1783440051&width=900`,
  },
  {
    title: "Honeycomb Diamond Tennis Bracelet",
    handle: "honeycomb-hexagon-diamond-tennis-bracelet",
    price: 7620,
    priceFrom: true,
    image: `${CDN}/41A8E9A0-E9B6-4374-8B9D-DCF904D85637.jpg?v=1783440051&width=900`,
  },
  {
    title: "Diamond Puzzle Dice Tennis Bracelet",
    handle: "diamond-puzzle-dice-tennis-bracelet",
    price: 12660,
    image: `${CDN}/2CFF650E-0A00-4B77-8FCC-D7708A1A42B3.jpg?v=1783963563&width=900`,
  },
  {
    title: "Double Diamond Tennis Bracelet",
    handle: "double-diamond-tennis-bracelet",
    price: 11480,
    image: `${CDN}/44ABC1A8-915F-47EF-B3A3-BD1FB7834780.jpg?v=1783963563&width=900`,
  },
  {
    title: "Alternating Diamond Pears Flexible Tennis Bracelet",
    handle: "alternating-pears-diamond-flexible-tennis-bracelet",
    price: 6400,
    image: `${CDN}/03D09AD9-2E29-4587-84A7-EC4A1C57036F.jpg?v=1783963730&width=900`,
  },
  {
    title: "Rainbow Sapphire Bezel Tennis Bracelet",
    handle: "rainbow-sapphire-bezel-tennis-bracelet",
    price: 4470,
    image: `${CDN}/CC35E03C-D5E5-4956-8F80-AF9157E9D31C.jpg?v=1783963563&width=900`,
  },
];

export const designedInColorProducts: Product[] = [
  signatureProducts[0],
  signatureProducts[2],
  signatureProducts[6],
  signatureProducts[7],
  {
    title: "Rainbow Sapphire and Diamond Tennis Bracelet",
    handle: "rainbow-sapphire-and-diamond-tennis-bracelet",
    price: 5500,
    image: `${CDN}/567F7A38-FE6C-4823-970D-6A881308F9F0.jpg?v=1783448221&width=900`,
  },
  signatureProducts[3],
  signatureProducts[4],
  signatureProducts[5],
];

export const navLinks = [
  {
    label: "NEW ARRIVALS",
    href: "#signature",
  },
  {
    label: "SHOP BY CATEGORY",
    href: "#categories",
    children: [
      { label: "BRACELETS", href: "#bracelets" },
      { label: "NECKLACES", href: "#necklaces" },
      { label: "SHOP ALL", href: "#signature" },
    ],
  },
  {
    label: "SHOP BY DESIGN",
    href: "#designed",
    children: [
      { label: "CLASSIC TENNIS", href: "#signature" },
      { label: "OMBRE", href: "#designed" },
      { label: "FANCY SHAPE", href: "#designed" },
      { label: "COLORED GEMSTONES", href: "#designed" },
      { label: "LAB DIAMOND", href: "#signature" },
    ],
  },
  {
    label: "SHOP BY STONE",
    href: "#designed",
    children: [
      { label: "EMERALD", href: "#designed" },
      { label: "RUBY", href: "#designed" },
      { label: "SAPPHIRE", href: "#designed" },
      { label: "TOURMALINE", href: "#designed" },
      { label: "TURQUOISE", href: "#designed" },
      { label: "LAB DIAMOND", href: "#signature" },
    ],
  },
  {
    label: "GEMOLOGY",
    href: "#made-to-order",
    children: [
      { label: "ABOUT GEMS", href: "#made-to-order" },
      { label: "EMERALD", href: "#made-to-order" },
      { label: "RUBY", href: "#made-to-order" },
      { label: "SAPPHIRE", href: "#made-to-order" },
      { label: "ALL GEM EDUCATION", href: "#made-to-order" },
    ],
  },
] as const;

export function formatUsd(price: number, from?: boolean) {
  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);
  return from ? `From ${formatted}` : formatted;
}
