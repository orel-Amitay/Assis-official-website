import Image from "next/image";
import Link from "next/link";
import { formatMoney, type CatalogProduct } from "@/lib/catalog";

export default function ProductCard({ product }: { product: CatalogProduct }) {
  return (
    <Link href={`/products/${product.handle}`} className="group block">
      <div className="relative aspect-square overflow-hidden bg-stone">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.title}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover transition duration-700 group-hover:scale-[1.04]"
          />
        ) : null}
      </div>
      <h3 className="mt-3 text-[13px] font-medium leading-snug tracking-wide">
        {product.title}
      </h3>
      <p className="mt-1 text-[13px] text-muted">{formatMoney(product.price)}</p>
    </Link>
  );
}
