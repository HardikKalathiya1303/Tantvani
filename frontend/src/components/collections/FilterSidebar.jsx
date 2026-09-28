import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

const FABRICS = [
  { label: 'All fabrics', value: '' },
  { label: 'Silk', value: 'silk' },
  { label: 'Banarasi', value: 'banarasi' },
  { label: 'Kanjivaram', value: 'kanjivaram' },
  { label: 'Chanderi', value: 'chanderi' },
  { label: 'Cotton', value: 'cotton' },
  { label: 'Linen', value: 'linen' },
  { label: 'Georgette', value: 'georgette' },
  { label: 'Tussar', value: 'tussar' },
];

const COLORS = [
  { label: 'All colours', value: '', color: null },
  { label: 'Red', value: 'red', color: '#C85A6E' },
  { label: 'Maroon', value: 'maroon', color: '#6B2732' },
  { label: 'Blue', value: 'blue', color: '#2A4E78' },
  { label: 'Yellow', value: 'yellow', color: '#D9A336' },
  { label: 'Green', value: 'green', color: '#386B52' },
  { label: 'Pink', value: 'pink', color: '#E8A5B8' },
  { label: 'Gold', value: 'gold', color: '#D4AF37' },
];

const OCCASIONS = [
  { label: 'All occasions', value: '' },
  { label: 'Wedding', value: 'wedding' },
  { label: 'Festive', value: 'festive' },
  { label: 'Casual', value: 'casual' },
  { label: 'Party', value: 'party' },
  { label: 'Office', value: 'office' },
];

export default function FilterSidebar({ params, updateFilter }) {
  const [fabricOpen, setFabricOpen] = useState(true);
  const [colorOpen, setColorOpen] = useState(true);
  const [occasionOpen, setOccasionOpen] = useState(true);

  return (
    <aside className="w-full pr-4">
      {/* Header */}
      <h2 className="font-jost text-xs font-bold tracking-[0.2em] uppercase text-[#8C3342] mb-6 pb-2 border-b border-gray-200">
        FILTER BY
      </h2>

      <div className="space-y-6">
        {/* Fabric Filter */}
        <div className="border-b border-gray-150 pb-5">
          <button
            onClick={() => setFabricOpen(o => !o)}
            className="flex items-center justify-between w-full mb-3 text-left font-karla text-sm font-bold text-[#2B1810]"
          >
            <span>Fabric</span>
            {fabricOpen ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
          </button>

          {fabricOpen && (
            <div className="space-y-2 pl-0.5">
              {FABRICS.map(f => {
                const isSel = (params.fabric || '').toLowerCase() === f.value.toLowerCase();
                return (
                  <button
                    key={f.value}
                    onClick={() => updateFilter('fabric', isSel && f.value !== '' ? '' : f.value)}
                    className={`block w-full text-left font-karla text-sm transition-colors cursor-pointer ${
                      isSel && f.value !== ''
                        ? 'text-[#8C3342] font-semibold'
                        : 'text-gray-500 hover:text-[#2B1810]'
                    }`}
                  >
                    {f.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Colour Filter with Color Dots */}
        <div className="border-b border-gray-150 pb-5">
          <button
            onClick={() => setColorOpen(o => !o)}
            className="flex items-center justify-between w-full mb-3 text-left font-karla text-sm font-bold text-[#2B1810]"
          >
            <span>Colour</span>
            {colorOpen ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
          </button>

          {colorOpen && (
            <div className="space-y-2.5 pl-0.5">
              {COLORS.map(c => {
                const isSel = (params.color || '').toLowerCase() === c.value.toLowerCase();
                return (
                  <button
                    key={c.value}
                    onClick={() => updateFilter('color', isSel && c.value !== '' ? '' : c.value)}
                    className={`flex items-center gap-2.5 w-full text-left font-karla text-sm transition-colors cursor-pointer ${
                      isSel && c.value !== ''
                        ? 'text-[#8C3342] font-semibold'
                        : 'text-gray-500 hover:text-[#2B1810]'
                    }`}
                  >
                    {c.color ? (
                      <span
                        className={`w-3.5 h-3.5 rounded-full inline-block border border-black/10 shrink-0 ${
                          isSel ? 'ring-2 ring-offset-1 ring-[#8C3342]' : ''
                        }`}
                        style={{ backgroundColor: c.color }}
                      />
                    ) : (
                      <span className={`w-3.5 h-3.5 rounded-full border border-gray-300 inline-block shrink-0 ${isSel ? 'bg-gray-300' : ''}`} />
                    )}
                    <span>{c.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Occasion Filter */}
        <div className="border-b border-gray-150 pb-5">
          <button
            onClick={() => setOccasionOpen(o => !o)}
            className="flex items-center justify-between w-full mb-3 text-left font-karla text-sm font-bold text-[#2B1810]"
          >
            <span>Occasion</span>
            {occasionOpen ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
          </button>

          {occasionOpen && (
            <div className="space-y-2 pl-0.5">
              {OCCASIONS.map(o => {
                const isSel = (params.occasion || '').toLowerCase() === o.value.toLowerCase();
                return (
                  <button
                    key={o.value}
                    onClick={() => updateFilter('occasion', isSel && o.value !== '' ? '' : o.value)}
                    className={`block w-full text-left font-karla text-sm transition-colors cursor-pointer ${
                      isSel && o.value !== ''
                        ? 'text-[#8C3342] font-semibold'
                        : 'text-gray-500 hover:text-[#2B1810]'
                    }`}
                  >
                    {o.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
