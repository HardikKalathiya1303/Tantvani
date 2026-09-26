import { MdPayments, MdWorkspacePremium, MdLocalShipping, MdPublishedWithChanges } from 'react-icons/md';

export default function HeroFeatureBar() {
  const features = [
    {
      title: 'COD Available',
      subtitle: 'Pay easily at your doorstep',
      icon: <MdPayments className="w-6 h-6 text-[#B44332] group-hover:text-gold transition-colors" />,
    },
    {
      title: 'Artisan Made',
      subtitle: '100% Authentic Handloom',
      icon: <MdWorkspacePremium className="w-6 h-6 text-[#B44332] group-hover:text-gold transition-colors" />,
    },
    {
      title: 'Free Shipping',
      subtitle: 'On orders above ₹2000',
      icon: <MdLocalShipping className="w-6 h-6 text-[#B44332] group-hover:text-gold transition-colors" />,
    },
    {
      title: '100% Money Back',
      subtitle: 'Hassle-free 15-day return',
      icon: <MdPublishedWithChanges className="w-6 h-6 text-[#B44332] group-hover:text-gold transition-colors" />,
    },
  ];

  return (
    <section className="bg-[#FDF9F3] relative z-20 py-6 sm:py-9 border-t border-[#EDE0D0]/80">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-6 gap-x-4">
          {features.map((item, idx) => (
            <div
              key={idx}
              className="group flex flex-col items-center text-center px-3 py-2 relative md:border-r md:last:border-r-0 border-[#E8D9C8]/80 transition-all duration-300"
            >
              <div className="mb-3 flex items-center justify-center w-12 h-12 rounded-full bg-[#B44332]/10 border border-[#B44332]/30 shadow-xs group-hover:bg-[#5A242A] group-hover:border-[#5A242A] transition-all duration-300">
                {item.icon}
              </div>
              <span className="font-karla text-sm sm:text-base font-semibold text-[#5A242A] tracking-wide mb-0.5">
                {item.title}
              </span>
              <span className="font-jost text-[11px] sm:text-xs text-[#5A242A]/75 font-normal">
                {item.subtitle}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Decorative ornate line with centered circular motif */}
      <div className="relative border-b border-[#E7D7C5] mt-6 sm:mt-9">
        <div className="absolute left-1/2 -translate-x-1/2 -bottom-4 w-8 h-8 rounded-full bg-[#FDF9F3] border border-[#DCC7B3] flex items-center justify-center shadow-xs">
          <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#B44332]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
            <circle cx="12" cy="12" r="8" />
            <circle cx="12" cy="12" r="5" />
            <circle cx="12" cy="12" r="2" fill="currentColor" />
          </svg>
        </div>
      </div>
    </section>
  );
}
