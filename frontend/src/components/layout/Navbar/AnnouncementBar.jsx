export default function AnnouncementBar({ scrolled, transparent }) {
  return (
    <div
      className={`transition-all duration-300 overflow-hidden text-center text-[9px] sm:text-[10.5px] font-jost tracking-[0.16em] sm:tracking-[0.22em] uppercase px-3 truncate ${
        scrolled
          ? 'max-h-0 py-0 opacity-0 pointer-events-none'
          : 'max-h-12 py-2 sm:py-2.5 opacity-100 ' + (transparent ? 'bg-[#2A0D10]/85 text-[#FDFAF5]/90 border-b border-white/10 backdrop-blur-sm' : 'bg-wine text-cream-light')
      }`}
    >
      <span>FREE SHIPPING ON ORDERS ABOVE ₹2000</span>
      <span className="hidden sm:inline">&nbsp;·&nbsp; AUTHENTIC HANDLOOM &nbsp;·&nbsp; 15-DAY RETURNS</span>
    </div>
  );
}
