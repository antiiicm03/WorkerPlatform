import { useState } from 'react';
import { ChevronDown, ChevronUp, X, SlidersHorizontal } from 'lucide-react';

// ─── Accordion Section ───────────────────────────────────────────────────────
const Section = ({ title, children, defaultOpen = true }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-700/60">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between py-4 text-left group"
      >
        <span className="text-sm font-semibold text-white group-hover:text-blue-400 transition-colors tracking-wide">
          {title}
        </span>
        {open
          ? <ChevronUp className="w-4 h-4 text-gray-400" />
          : <ChevronDown className="w-4 h-4 text-gray-400" />
        }
      </button>
      {open && <div className="pb-4">{children}</div>}
    </div>
  );
};

// ─── Checkbox Option ─────────────────────────────────────────────────────────
const CheckOption = ({ label, checked, onChange }) => (
  <label className="flex items-center gap-3 py-1.5 cursor-pointer group">
    <span className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-all
      ${checked
        ? 'bg-blue-600 border-blue-600'
        : 'border-gray-500 group-hover:border-blue-400 bg-transparent'
      }`}
    >
      {checked && (
        <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 10 10" fill="none">
          <path d="M1.5 5l2.5 2.5 4.5-4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </span>
    <span className={`text-sm transition-colors ${checked ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'}`}>
      {label}
    </span>
  </label>
);

// ─── Star Rating Selector ────────────────────────────────────────────────────
const StarSelector = ({ value, onChange }) => {
  const options = [0, 3, 3.5, 4, 4.5];
  const labels = ['Any', '3+', '3.5+', '4+', '4.5+'];
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt, i) => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all
            ${value === opt
              ? 'bg-blue-600 border-blue-600 text-white'
              : 'border-gray-600 text-gray-400 hover:border-blue-400 hover:text-white bg-gray-800'
            }`}
        >
          {labels[i]}
        </button>
      ))}
    </div>
  );
};

// ─── MAIN FILTER COMPONENT ───────────────────────────────────────────────────
const CraftsmenFilter = ({ filters, onChange, onReset, hasActiveFilters }) => {
  const [priceInputFrom, setPriceInputFrom] = useState(filters.maxPrice ? '0' : '');
  const [priceInputTo, setPriceInputTo]     = useState(filters.maxPrice || '');
  const [sliderMax, setSliderMax]           = useState(filters.maxPrice || 10000);

  const ABSOLUTE_MAX = 20000;

  const applyPrice = () => {
    const to = Number(priceInputTo);
    if (!isNaN(to) && to > 0) {
      setSliderMax(to);
      onChange({ ...filters, maxPrice: to.toString() });
    } else {
      onChange({ ...filters, maxPrice: '' });
    }
  };

  const handleSlider = (e) => {
    const val = Number(e.target.value);
    setSliderMax(val);
    setPriceInputTo(val.toString());
    onChange({ ...filters, maxPrice: val.toString() });
  };

  return (
    <div className="w-full bg-gray-800/60 backdrop-blur-sm rounded-2xl border border-gray-700 overflow-hidden mb-8">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-blue-400" />
          <span className="text-white font-bold text-sm tracking-wide">Filteri</span>
          {hasActiveFilters && (
            <span className="ml-1 px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full font-medium">
              Aktivni
            </span>
          )}
        </div>
        {hasActiveFilters && (
          <button
            onClick={() => {
              setPriceInputFrom('');
              setPriceInputTo('');
              setSliderMax(10000);
              onReset();
            }}
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-red-400 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
            Resetuj sve
          </button>
        )}
      </div>

      <div className="px-5">
        {/* ── LOKACIJA ── */}
        <Section title="Lokacija">
          <input
            type="text"
            placeholder="Unesite grad ili opštinu..."
            value={filters.location}
            onChange={e => onChange({ ...filters, location: e.target.value })}
            className="w-full bg-gray-900 border border-gray-600 text-white text-sm rounded-lg px-3 py-2.5
              placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </Section>

        {/* ── CENA ── */}
        <Section title="Cena (RSD/sat)">
          <div className="flex gap-3 mb-4">
            <div className="flex-1">
              <label className="text-xs text-gray-500 mb-1 block">Od (RSD)</label>
              <input
                type="number"
                placeholder="0"
                value={priceInputFrom}
                onChange={e => setPriceInputFrom(e.target.value)}
                className="w-full bg-gray-900 border border-gray-600 text-white text-sm rounded-lg px-3 py-2.5
                  focus:outline-none focus:ring-2 focus:ring-blue-500 transition [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>
            <div className="flex-1">
              <label className="text-xs text-gray-500 mb-1 block">Do (RSD)</label>
              <input
                type="number"
                placeholder="10000"
                value={priceInputTo}
                onChange={e => setPriceInputTo(e.target.value)}
                className="w-full bg-gray-900 border border-gray-600 text-white text-sm rounded-lg px-3 py-2.5
                  focus:outline-none focus:ring-2 focus:ring-blue-500 transition [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>
          </div>

          {/* Dual-handle style slider (single handle for max) */}
          <div className="relative mb-4 px-1">
            <input
              type="range"
              min="0"
              max={ABSOLUTE_MAX}
              step="100"
              value={sliderMax}
              onChange={handleSlider}
              className="w-full h-1.5 rounded-full appearance-none cursor-pointer
                bg-gray-700
                [&::-webkit-slider-thumb]:appearance-none
                [&::-webkit-slider-thumb]:w-5
                [&::-webkit-slider-thumb]:h-5
                [&::-webkit-slider-thumb]:rounded-full
                [&::-webkit-slider-thumb]:bg-white
                [&::-webkit-slider-thumb]:border-2
                [&::-webkit-slider-thumb]:border-gray-900
                [&::-webkit-slider-thumb]:shadow-md
                [&::-webkit-slider-thumb]:cursor-pointer
                [&::-moz-range-thumb]:w-5
                [&::-moz-range-thumb]:h-5
                [&::-moz-range-thumb]:rounded-full
                [&::-moz-range-thumb]:bg-white
                [&::-moz-range-thumb]:border-2
                [&::-moz-range-thumb]:border-gray-900
                [&::-moz-range-thumb]:cursor-pointer"
              style={{
                background: `linear-gradient(to right, #2563eb 0%, #2563eb ${(sliderMax / ABSOLUTE_MAX) * 100}%, #374151 ${(sliderMax / ABSOLUTE_MAX) * 100}%, #374151 100%)`
              }}
            />
          </div>

          <button
            onClick={applyPrice}
            className="w-full py-2.5 rounded-lg border border-gray-600 text-sm text-gray-300
              hover:bg-gray-700 hover:text-white hover:border-gray-500 transition font-medium"
          >
            Primeni cenu
          </button>
        </Section>

        {/* ── OCENA ── */}
        <Section title="Minimalna ocena">
          <StarSelector
            value={filters.minRating}
            onChange={val => onChange({ ...filters, minRating: val })}
          />
          {filters.minRating > 0 && (
            <p className="text-xs text-gray-500 mt-2">
              Prikazuju se majstori sa ocenom ≥ {filters.minRating} ⭐
            </p>
          )}
        </Section>

        {/* ── DOSTUPNOST ── */}
        <Section title="Dostupnost" defaultOpen={true}>
          <CheckOption
            label="Hitne intervencije (0-24h)"
            checked={filters.urgentOnly}
            onChange={() => onChange({ ...filters, urgentOnly: !filters.urgentOnly })}
          />
        </Section>
      </div>
    </div>
  );
};

export default CraftsmenFilter;