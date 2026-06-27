import { useState, useEffect } from "react";
import {
  Search, MapPin,
  Building, ChevronLeft, ChevronRight
} from "lucide-react";
import { bannerService, HeroBanner } from '@/services/bannerService';
import { CategoryTabs } from "@/components/common/CategoryTabs";
import { FeaturedProjects } from "@/components/common/FeaturedProjects";
import { ExploreCities } from "@/components/common/ExploreCities";
import { PropertyCard } from "@/components/common/PropertyCard";
import { SectionHeader as SH } from "@/components/common/SectionHeader";
import { useAllProperties } from "@/features/property/hooks/useAllProperties";
import { UIProperty } from "@/services/propertyService";
import { useOutletContext, useNavigate } from 'react-router-dom';
import { getPropertyImage } from '@/utils/propertyImages';


const LIFESTYLE = [
  { label: "Luxury Living", sub: "₹3 Cr+", img: "1600596542815-ffad4c1539a9", color: "#6C63FF" },
  { label: "Budget Homes", sub: "Under ₹50 L", img: "1567767292278-a4f21aa2d36e", color: "#00C853" },
  { label: "IT Hub", sub: "Near Tech Parks", img: "1486325212027-8081e485255e", color: "#FF3F6C" },
  { label: "Student Zone", sub: "Near Universities", img: "1555854877-bab0e564b8d5", color: "#FF9800" },
];




// ─── Hero ─────────────────────────────────────────────────────────────────────

function Hero({ onSearch }: { onSearch: (query: string, category: string) => void }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchCategory, setSearchCategory] = useState("Buy");
  const [banners, setBanners] = useState<HeroBanner[]>([]);
  const [isHovered, setIsHovered] = useState(false);
  const [touchStart, setTouchStart] = useState(0);

  const defaultBanners: HeroBanner[] = [{
    id: 'default-1',
    title: 'Find Your Perfect Home',
    subtitle: '1,20,000+ Verified Listings',
    description: 'Discover homes across India\'s top cities — verified, trusted, effortless.',
    image_url: getPropertyImage("1600596542815-ffad4c1539a9"),
    overlay_opacity: 0.3,
    text_alignment: 'center',
    text_color: '#FFFFFF',
    display_order: 0,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }];

  useEffect(() => {
    const loadBanners = async () => {
      try {
        const activeBanners = await bannerService.getActiveBanners();
        if (activeBanners && activeBanners.length > 0) {
          setBanners(activeBanners);
        } else {
          setBanners(defaultBanners);
        }
      } catch (error) {
        console.error("Failed to load banners:", error);
        setBanners(defaultBanners);
      }
    };
    loadBanners();
  }, []);

  useEffect(() => {
    if (banners.length <= 1 || isHovered) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 4000); // 4 sec auto-slide
    return () => clearInterval(interval);
  }, [banners.length, isHovered]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [banners.length]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEnd = e.changedTouches[0].clientX;
    if (touchStart - touchEnd > 50) handleNext();
    if (touchStart - touchEnd < -50) handlePrev();
  };

  const handleSearchSubmit = () => {
    onSearch(searchQuery, searchCategory);
  };

  const activeBanner = banners[currentIndex] || defaultBanners[0];

  return (
    <section 
      className="relative h-[90vh] flex items-center justify-center pt-24 overflow-hidden group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="absolute inset-0">
        {banners.map((banner, index) => (
          <div
            key={banner.id}
            className={`absolute inset-0 bg-cover bg-center brightness-90 contrast-110 transition-opacity duration-1000 ${
              index === currentIndex ? "opacity-100 scale-100 animate-[zoom_6s_linear]" : "opacity-0 pointer-events-none"
            }`}
            style={{ 
              backgroundImage: `url(${window.innerWidth < 768 && banner.mobile_image_url ? banner.mobile_image_url : banner.image_url})` 
            }}
          />
        ))}
      </div>
      <div 
        className="absolute inset-0 transition-opacity duration-1000" 
        style={{ backgroundColor: `rgba(0,0,0,${activeBanner.overlay_opacity || 0.3})` }} 
      />

      <div className={`relative z-10 max-w-[1440px] mx-auto px-10 w-full flex flex-col items-${activeBanner.text_alignment === 'left' ? 'start' : activeBanner.text_alignment === 'right' ? 'end' : 'center'} text-${activeBanner.text_alignment || 'center'}`}>
        {activeBanner.badge_text ? (
          <p className="text-[#FF3F6C] text-sm font-bold uppercase tracking-widest mb-3 drop-shadow-md">
            {activeBanner.badge_text}
          </p>
        ) : activeBanner.subtitle ? (
          <p className="text-[#FF3F6C] text-sm font-bold uppercase tracking-widest mb-3 drop-shadow-md">
            {activeBanner.subtitle}
          </p>
        ) : null}
        
        <h1 
          className="text-5xl font-extrabold font-['Poppins'] leading-tight mb-2 drop-shadow-lg mt-6"
          style={{ color: activeBanner.text_color || '#FFFFFF' }}
        >
          {activeBanner.title}
        </h1>
        
        {activeBanner.description && (
          <p 
            className="text-base mb-8 drop-shadow-md max-w-2xl"
            style={{ color: `${activeBanner.text_color || '#FFFFFF'}E6` }} // 90% opacity
          >
            {activeBanner.description}
          </p>
        )}

        {activeBanner.button_text && activeBanner.button_link && (
          <a
            href={activeBanner.button_link}
            className="mb-8 bg-[#FF3F6C] text-white px-8 py-3 rounded-full font-bold hover:bg-[#e62e5c] transition-colors shadow-lg"
          >
            {activeBanner.button_text}
          </a>
        )}

        <CategoryTabs value={searchCategory} onChange={setSearchCategory} />

        {/* Search box */}
        <div className="bg-white rounded-full p-2 flex items-center gap-2 w-full max-w-2xl shadow-lg border-0">
          <div className="flex-1 flex items-center gap-3 px-5">
            <Search size={18} className="text-gray-400 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearchSubmit()}
              placeholder="Search by locality, city, or project"
              className="flex-1 text-base outline-none py-2 text-[#1A1A1A] placeholder:text-gray-400 bg-transparent border-none"
            />
          </div>
          <button
            onClick={handleSearchSubmit}
            className="bg-[#FF3F6C] text-white w-12 h-12 rounded-full font-bold text-sm hover:bg-[#e62e5c] transition-colors flex items-center justify-center shadow-md shrink-0"
          >
            <Search size={18} />
          </button>
        </div>

        <div className={`flex gap-2 mt-5 flex-wrap justify-${activeBanner.text_alignment === 'left' ? 'start' : activeBanner.text_alignment === 'right' ? 'end' : 'center'}`}>
          {["Whitefield", "Koramangala", "Indiranagar", "Sarjapur", "Electronic City"].map((l) => (
            <button
              key={l}
              onClick={() => {
                setSearchQuery(l);
                onSearch(l, searchCategory);
              }}
              className="text-xs text-white/90 hover:text-white bg-black/20 hover:bg-black/40 px-3 py-1.5 rounded-full transition-colors backdrop-blur-sm border border-white/10"
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      {banners.length > 1 && (
        <>
          <button 
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/30 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all z-20"
          >
            <ChevronLeft size={24} />
          </button>
          <button 
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/30 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all z-20"
          >
            <ChevronRight size={24} />
          </button>
        </>
      )}

      {/* Dot Indicators */}
      {banners.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {banners.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2 rounded-full transition-all ${
                idx === currentIndex ? 'w-8 bg-[#FF3F6C]' : 'w-2 bg-white/50 hover:bg-white'
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}


// ─── Lifestyle Card ───────────────────────────────────────────────────────────

function LifestyleCard({
  cat,
  onClick,
}: {
  cat: (typeof LIFESTYLE)[0];
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="relative rounded-2xl overflow-hidden h-52 group text-left w-full"
    >
      <img
        src={getPropertyImage(cat.img)}
        alt={cat.label}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
      <div
        className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full ring-2 ring-white/40"
        style={{ background: cat.color }}
      />
      <div className="absolute bottom-4 left-4">
        <p className="text-white font-bold font-['Poppins'] text-lg leading-tight">
          {cat.label}
        </p>
        <span className="text-xs text-white/70 mt-0.5 block">{cat.sub}</span>
      </div>
    </button>
  );
}

// ─── Featured Project Card ────────────────────────────────────────────────────

function FeaturedCard({
  proj,
  onClick,
}: {
  proj: { name: string; builder: string; location: string; units: string; price: string; img: string; tag: string; };
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer group flex"
    >
      <div className="relative w-52 shrink-0 overflow-hidden bg-gray-100">
        <img
          src={getPropertyImage(proj.img)}
          alt={proj.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <span className="absolute top-3 left-3 text-[10px] font-bold bg-[#6C63FF] text-white px-2 py-0.5 rounded-sm uppercase tracking-wider">
          {proj.tag}
        </span>
      </div>
      <div className="p-5 flex flex-col justify-between flex-1">
        <div>
          <p className="text-base font-bold font-['Poppins'] text-[#1A1A1A] leading-snug">
            {proj.name}
          </p>
          <p className="text-xs font-bold text-[#6C63FF] mt-0.5">{proj.builder}</p>
          <div className="flex items-center gap-1 mt-2 text-[#6B7280] text-xs">
            <MapPin size={11} />
            <span>{proj.location}</span>
          </div>
        </div>
        <div>
          <p className="text-xs text-[#6B7280] mt-4">{proj.units}</p>
          <p className="text-lg font-extrabold text-[#FF3F6C] mt-0.5 font-['Poppins']">
            {proj.price}
          </p>
          <button className="mt-3 text-xs font-bold text-[#FF3F6C] border border-[#FF3F6C]/40 px-3 py-1.5 rounded-lg hover:bg-[#FF3F6C] hover:text-white hover:border-[#FF3F6C] transition-all">
            View Project →
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

export function Footer({ onLogoClick }: { onLogoClick: () => void }) {
  return (
    <footer className="bg-[#0F0F1E] text-gray-400 mt-16">
      <div className="max-w-[1440px] mx-auto px-10 py-12 grid grid-cols-4 gap-10">
        <div>
          <button
            onClick={onLogoClick}
            className="flex items-center gap-2 mb-4"
          >
            <div className="w-8 h-8 bg-[#FF3F6C] rounded-xl flex items-center justify-center">
              <Building size={16} className="text-white" />
            </div>
            <span className="text-lg font-bold font-['Poppins'] text-white">
              Nestify
            </span>
          </button>
          <p className="text-xs leading-relaxed text-gray-500">
            India's most trusted real estate platform. Find your perfect home
            with verified listings and zero brokerage.
          </p>
        </div>
        {[
          {
            heading: "Explore",
            links: ["Buy Property", "Rent Property", "PG / Hostel", "Commercial", "New Projects"],
          },
          {
            heading: "Company",
            links: ["About Us", "Careers", "Blog", "Press", "Contact"],
          },
          {
            heading: "Support",
            links: ["Help Center", "Post Property", "Advertise", "Privacy Policy", "Terms"],
          },
        ].map((col) => (
          <div key={col.heading}>
            <p className="text-[10px] font-bold text-white uppercase tracking-widest mb-4">
              {col.heading}
            </p>
            <ul className="space-y-2">
              {col.links.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-xs text-gray-500 hover:text-white transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-white/5 py-4">
        <p className="text-center text-xs text-gray-600">
          © 2025 Nestify Technologies Pvt. Ltd. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

// ─── Home Page ────────────────────────────────────────────────────────────────

function HomePage({
  properties,
  wishlist,
  toggleWishlist,
  onSelectProperty,
  onSearch,
}: {
  properties: UIProperty[];
  wishlist: string[];
  toggleWishlist: (id: string) => void;
  onSelectProperty: (p: UIProperty) => void;
  onSearch: (query: string, category: string) => void;
}) {
  return (
    <div className="bg-[#F5F5F6] min-h-screen">
      <Hero onSearch={onSearch} />

      <FeaturedProjects />

      <div className="max-w-[1440px] mx-auto px-10 py-12 space-y-16">
        {/* Trending */}
        <section>
          <SH
            title="Trending Properties"
            sub="Most viewed listings this week"
            action="View All"
            onAction={() => onSearch("", "Buy")}
          />
          <div className="grid grid-cols-4 gap-5">
            {properties.slice(0, 4).map((p) => (
              <PropertyCard
                key={p.id}
                property={p}
                onSelect={() => onSelectProperty(p)}
                wishlisted={wishlist.includes(p.id)}
                onWishlist={() => toggleWishlist(p.id)}
              />
            ))}
          </div>
        </section>

        {/* Lifestyle */}
        <section>
          <SH
            title="Explore by Lifestyle"
            sub="Find a home that fits your life"
          />
          <div className="grid grid-cols-4 gap-5">
            {LIFESTYLE.map((cat) => (
              <LifestyleCard key={cat.label} cat={cat} onClick={() => onSearch(cat.label, "Buy")} />
            ))}
          </div>
        </section>

        {/* Featured */}
        <section>
          <SH
            title="Featured Projects"
            sub="Top builders, curated for you"
            action="See All Projects"
            onAction={() => onSearch("", "Buy")}
          />
          <div className="grid grid-cols-3 gap-5">
            {properties.slice(0, 3).map((p) => (
              <FeaturedCard 
                key={p.id} 
                proj={{
                  name: p.title || 'Featured Property',
                  builder: 'Verified Builder',
                  location: p.city || 'Location',
                  units: p.bhk ? `${p.bhk} BHK` : 'Various Units',
                  price: `₹${p.price}`,
                  img: (p as any).images?.[0]?.url || getPropertyImage(p.id),
                  tag: 'Hot Selling'
                }} 
                onClick={() => onSelectProperty(p)} 
              />
            ))}
          </div>
        </section>

        {/* Recently Viewed */}
        <section>
          <SH
            title="Recently Viewed"
            sub="Pick up where you left off"
          />
          <div className="grid grid-cols-4 gap-5">
            {properties.slice(4, 8).map((p) => (
              <PropertyCard
                key={p.id}
                property={p}
                onSelect={() => onSelectProperty(p)}
                wishlisted={wishlist.includes(p.id)}
                onWishlist={() => toggleWishlist(p.id)}
              />
            ))}
          </div>
        </section>
      </div>

      <ExploreCities properties={properties} />
    </div>
  );
}



export function HomeWrapper() {
  const { wishlist, toggleWishlist } = useOutletContext<{
    wishlist: string[];
    toggleWishlist: (id: string) => void;
  }>();
  const navigate = useNavigate();
  const { properties, loading, error } = useAllProperties();

  if (loading) return <div className="flex h-screen items-center justify-center">Loading properties...</div>;
  if (error) return <div className="flex h-screen items-center justify-center text-red-500">{error}</div>;

  return (
    <HomePage
      properties={properties}
      wishlist={wishlist}
      toggleWishlist={toggleWishlist}
      onSelectProperty={(p) => navigate(`/property/${p.id}`)}
      onSearch={(query, category) => {
        const path = category === "Rent" ? "/rent" : "/buy";
        navigate(query ? `${path}?q=${encodeURIComponent(query)}` : path);
      }}
    />
  );
}
