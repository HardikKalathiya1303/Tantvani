export default function MarqueeStrip({ text = '✦ HANDCRAFTED IN INDIA · AUTHENTIC WEAVES · HERITAGE TEXTILES · LUXURY SAREES · ARTISAN CRAFTED · FREE SHIPPING ₹2000+ · ' }) {
  const repeated = text.repeat(4);
  return (
    <div className="bg-wine py-4 overflow-hidden">
      <div className="flex whitespace-nowrap animate-marquee">
        <span className="font-jost text-[10px] tracking-[0.3em] uppercase text-cream-light/80 pr-0">{repeated}</span>
        <span className="font-jost text-[10px] tracking-[0.3em] uppercase text-cream-light/80 pr-0" aria-hidden="true">{repeated}</span>
      </div>
    </div>
  );
}
