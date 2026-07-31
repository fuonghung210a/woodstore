'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

const WOOD_SPECIES = [
  { value: '', label: 'Tất cả loại gỗ' },
  { value: 'HUONG', label: 'Gỗ hương' },
  { value: 'TRAC', label: 'Gỗ trắc' },
  { value: 'MUN', label: 'Gỗ mun' },
  { value: 'GO_DO', label: 'Gỗ gõ đỏ' },
  { value: 'CAM_LAI', label: 'Gỗ cẩm lai' },
  { value: 'SON_TA', label: 'Gỗ sơn ta' },
  { value: 'THONG', label: 'Gỗ thông' },
  { value: 'SUAN', label: 'Gỗ xoan' },
  { value: 'KHAC', label: 'Loại khác' },
];

const PRICE_RANGES = [
  { label: 'Tất cả giá', min: '', max: '' },
  { label: 'Dưới 1 triệu', min: '0', max: '1000000' },
  { label: '1 - 3 triệu', min: '1000000', max: '3000000' },
  { label: '3 - 5 triệu', min: '3000000', max: '5000000' },
  { label: '5 - 10 triệu', min: '5000000', max: '10000000' },
  { label: 'Trên 10 triệu', min: '10000000', max: '' },
];

export function ProductFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get('search') ?? '');
  const [woodSpecies, setWoodSpecies] = useState(
    searchParams.get('woodSpecies') ?? '',
  );
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') ?? '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') ?? '');

  function applyFilters() {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (woodSpecies) params.set('woodSpecies', woodSpecies);
    if (minPrice) params.set('minPrice', minPrice);
    if (maxPrice) params.set('maxPrice', maxPrice);
    router.push(`/products?${params.toString()}`);
  }

  function selectPriceRange(min: string, max: string) {
    setMinPrice(min);
    setMaxPrice(max);
    const params = new URLSearchParams(searchParams.toString());
    if (min) params.set('minPrice', min);
    else params.delete('minPrice');
    if (max) params.set('maxPrice', max);
    else params.delete('maxPrice');
    router.push(`/products?${params.toString()}`);
  }

  return (
    <div className="bg-rice-dim/60 border border-walnut/10 rounded p-6 space-y-6">
      <p className="section-label !after:hidden">Bộ lọc</p>

      {/* Search */}
      <div>
        <label className="block text-label-sm text-ink-soft uppercase tracking-wider mb-1">
          Tìm kiếm
        </label>
        <div className="flex items-end gap-2">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
            placeholder="Tên sản phẩm, tag..."
            className="input-underline"
          />
          <button
            onClick={applyFilters}
            className="btn-gold !px-4 !py-2 shrink-0"
          >
            Tìm
          </button>
        </div>
      </div>

      {/* Wood species */}
      <div>
        <label className="block text-label-sm text-ink-soft uppercase tracking-wider mb-1">
          Loại gỗ
        </label>
        <select
          value={woodSpecies}
          onChange={(e) => {
            setWoodSpecies(e.target.value);
            const params = new URLSearchParams(searchParams.toString());
            if (e.target.value) params.set('woodSpecies', e.target.value);
            else params.delete('woodSpecies');
            router.push(`/products?${params.toString()}`);
          }}
          className="input-underline cursor-pointer"
        >
          {WOOD_SPECIES.map((ws) => (
            <option key={ws.value} value={ws.value}>
              {ws.label}
            </option>
          ))}
        </select>
      </div>

      {/* Price range */}
      <div>
        <label className="block text-label-sm text-ink-soft uppercase tracking-wider mb-1">
          Khoảng giá
        </label>
        <select
          value={`${minPrice}-${maxPrice}`}
          onChange={(e) => {
            const [min, max] = e.target.value.split('-');
            selectPriceRange(min, max);
          }}
          className="input-underline cursor-pointer"
        >
          {PRICE_RANGES.map((range) => (
            <option key={range.label} value={`${range.min}-${range.max}`}>
              {range.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
