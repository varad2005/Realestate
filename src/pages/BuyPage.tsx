import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { PropertyCard } from '@/components/common/PropertyCard';
import { useAllProperties } from '@/features/property/hooks/useAllProperties';
import { Search, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';

import { AdvancedFilters } from '@/components/search/AdvancedFilters';
import { SmartSearchBar } from '@/components/search/SmartSearchBar';
import { PropertyFilters } from '@/services/propertyService';

export function BuyPage() {
  const { city: cityParam } = useParams();
  const [searchParams] = useSearchParams();
  
  const [filters, setFilters] = useState<PropertyFilters>({
    query: cityParam ? cityParam.replace('-', ' ') : "",
    minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
    maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
    propertyType: searchParams.get('propertyType') ? [searchParams.get('propertyType')!] : undefined,
    furnishing: searchParams.get('furnishing') ? [searchParams.get('furnishing')!] : undefined,
    sortBy: 'new',
  });

  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      query: cityParam ? cityParam.replace('-', ' ') : ""
    }));
    setPage(1);
  }, [cityParam]);
  const [page, setPage] = useState(1);
  const limit = 9;

  const [wishlist, setWishlist] = useState<string[]>([]);

  const { properties, loading, error } = useAllProperties(filters, page, limit);

  const handleClearFilters = () => {
    setFilters({});
    setPage(1);
  };

  const handleFilterChange = (newFilters: PropertyFilters) => {
    setFilters(newFilters);
    setPage(1);
  };

  const toggleWishlist = (id: string) => {
    setWishlist(prev => prev.includes(id) ? prev.filter(w => w !== id) : [...prev, id]);
  };

  const handleNextPage = () => {
    if (properties.length === limit) setPage(p => p + 1);
  };

  const handlePrevPage = () => {
    if (page > 1) setPage(p => p - 1);
  };

  return (
    <PageWrapper>
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-['Poppins'] text-gray-900">
          Properties for Sale {filters.query ? `for "${filters.query}"` : ''}
        </h1>
        <p className="mt-2 text-gray-500-foreground">Showing verified listings</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <div className="w-full lg:w-[280px] shrink-0">
          <AdvancedFilters 
            filters={filters}
            setFilters={handleFilterChange}
            onClear={handleClearFilters}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="mb-6 flex flex-col gap-4">
            <SmartSearchBar 
              initialQuery={filters.query} 
              onSearch={(q) => handleFilterChange({ ...filters, query: q })} 
            />
            
            <div className="flex flex-wrap items-center justify-between gap-4">
              {/* Quick Filter Chips */}
              <div className="flex flex-wrap gap-2">
                {['Ready to Move', 'Verified', 'Owner', 'Luxury'].map(chip => (
                  <button 
                    key={chip}
                    onClick={() => {
                      if (chip === 'Ready to Move') handleFilterChange({ ...filters, possessionStatus: ['Ready to Move'] });
                      if (chip === 'Verified') handleFilterChange({ ...filters, postedByRole: ['owner', 'dealer', 'builder'] }); // Pseudo filter
                      if (chip === 'Owner') handleFilterChange({ ...filters, postedByRole: ['owner'] });
                      if (chip === 'Luxury') handleFilterChange({ ...filters, minPrice: 50000000 });
                    }}
                    className="bg-white border border-gray-200 text-xs font-bold text-gray-500 px-3 py-1.5 rounded-full hover:border-pink-600 hover:text-pink-600 transition-colors shadow-sm"
                  >
                    {chip}
                  </button>
                ))}
              </div>

              {/* Sorting */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-gray-500 uppercase">Sort By:</span>
                <select 
                  value={filters.sortBy || 'new'}
                  onChange={(e) => handleFilterChange({ ...filters, sortBy: e.target.value })}
                  className="bg-white border border-gray-200 text-sm font-medium text-gray-900 px-3 py-1.5 rounded-lg outline-none focus:border-pink-600 shadow-sm"
                >
                  <option value="new">Newest First</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="area_desc">Area: High to Low</option>
                </select>
              </div>
            </div>
          </div>

          {loading ? (
             <div className="flex justify-center py-20 text-gray-500">Loading properties...</div>
          ) : error ? (
             <div className="flex justify-center py-20 text-red-500">{error}</div>
          ) : properties.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {properties.map((prop) => (
                  <PropertyCard 
                    key={prop.id} 
                    property={prop} 
                    wishlisted={wishlist.includes(prop.id)}
                    onWishlist={() => toggleWishlist(prop.id)}
                  />
                ))}
              </div>
              
              {/* Pagination Controls */}
              <div className="flex items-center justify-center gap-4 mt-12">
                <button 
                  onClick={handlePrevPage}
                  disabled={page === 1}
                  className={`flex items-center gap-1 px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${page === 1 ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : 'bg-white border border-gray-200 text-gray-900 hover:border-pink-600 hover:text-pink-600'}`}
                >
                  <ChevronLeft size={16} /> Prev
                </button>
                <span className="text-sm font-bold text-gray-900">Page {page}</span>
                <button 
                  onClick={handleNextPage}
                  disabled={properties.length < limit}
                  className={`flex items-center gap-1 px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${properties.length < limit ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : 'bg-white border border-gray-200 text-gray-900 hover:border-pink-600 hover:text-pink-600'}`}
                >
                  Next <ChevronRight size={16} />
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-20 bg-white rounded-2xl border border-gray-200 shadow-sm">
              <MapPin className="mx-auto h-12 w-12 text-gray-500/50 mb-4" />
              <h3 className="text-lg font-bold text-gray-900 font-['Poppins']">No properties found</h3>
              <p className="mt-2 text-gray-500">Try adjusting your filters or search criteria.</p>
              <button onClick={handleClearFilters} className="mt-6 text-pink-600 font-semibold hover:underline">
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>
    </PageWrapper>
  );
}
