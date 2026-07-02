import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import { useProperty } from '../hooks/useProperty';
import { PropertyGallery } from '../components/PropertyGallery';
import { PropertyOverview } from '../components/PropertyOverview';
import { PropertyAmenities } from '../components/PropertyAmenities';
import { PropertyLocation } from '../components/PropertyLocation';
import { SellerCard } from '../components/SellerCard';
import { EMIWidget } from '../components/EMIWidget';
import { SimilarProperties } from '../components/SimilarProperties';
import { StickyActionPanel } from '../components/StickyActionPanel';
import { PropertyHighlights } from '../components/PropertyHighlights';
import { ProjectDetails } from '../components/ProjectDetails';
import { LocationAdvantages } from '../components/LocationAdvantages';
import { ArrowLeft, Loader2, AlertCircle, Globe } from 'lucide-react';
import { Dynamic360Modal } from '@/components/Property360/Dynamic360Modal';

export function PropertyDetailsPage() {
  const { id } = useParams();
  const { data: property, loading, error } = useProperty(id);
  const [is360ModalOpen, setIs360ModalOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-pink-600 mb-4" size={48} />
        <p className="text-gray-500 font-medium text-lg animate-pulse">Loading property details...</p>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex flex-col items-center justify-center">
        <AlertCircle className="text-red-500 mb-4" size={64} />
        <h2 className="text-2xl font-bold font-['Poppins'] text-gray-900 mb-2">Oops! Something went wrong.</h2>
        <p className="text-gray-500 mb-8 max-w-md text-center">{error || "The property you're looking for doesn't exist or has been removed."}</p>
        <Link to="/" className="bg-[#1A1A1A] text-white px-6 py-3 rounded-xl font-bold hover:bg-gray-900 transition-colors">
          Return to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#f8f9fa] min-h-screen pb-24 lg:pb-0">
      <div className="pt-28 pb-6 px-6 md:px-10 max-w-[1440px] mx-auto">
        <Link to="/buy" className="text-gray-500 hover:text-pink-600 transition-colors flex items-center gap-2 mb-6 font-medium w-max">
          <ArrowLeft size={18} /> Back to Search
        </Link>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Left Column (70%) */}
          <div className="w-full lg:w-[68%] space-y-12">

            {/* Unified Media Gallery */}
            <PropertyGallery 
              images={property.images} 
              videos={property.videos} 
              virtualTours={property.virtualTours} 
            />
            
            {property.virtualTours && property.virtualTours.length > 0 && (
              <div className="bg-gradient-to-r from-accent to-[#1A1A1A] rounded-3xl p-6 md:p-10 shadow-lg text-white flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600 rounded-full blur-[100px] opacity-20 pointer-events-none"></div>
                <div className="relative z-10">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 rounded-full text-xs font-bold mb-3">
                    <Globe size={14} className="text-purple-600/60" /> Premium Virtual Tour Available
                  </div>
                  <h3 className="text-2xl font-bold font-['Poppins'] mb-2">Immersive 360° Experience</h3>
                  <p className="text-purple-600/20 text-sm max-w-md">Step inside and explore every corner of this property from the comfort of your home.</p>
                </div>
                <button 
                  onClick={() => setIs360ModalOpen(true)}
                  className="relative z-10 shrink-0 bg-white text-purple-600 px-8 py-3.5 rounded-xl font-bold hover:bg-gray-50 transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)] flex items-center gap-2 hover:scale-105"
                >
                  <Globe size={18} />
                  Open 360° Experience
                </button>
              </div>
            )}

            <div className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-gray-200">
              <PropertyOverview property={property} />
            </div>

            <PropertyHighlights highlights={property.highlights} />

            {property.amenities && property.amenities.length > 0 && (
              <div className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-gray-200">
                <PropertyAmenities amenities={property.amenities} />
              </div>
            )}

            <ProjectDetails project={property.projectDetails} />

            {property.locationDetails && property.locationDetails.advantages && (
              <LocationAdvantages advantages={property.locationDetails.advantages} />
            )}

            {property.locationDetails && (
              <div className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-gray-200">
                <PropertyLocation location={property.locationDetails} />
              </div>
            )}

            {property.locationDetails?.coordinates && (
              <div className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-gray-200">
                <h3 className="text-xl font-bold font-['Poppins'] text-gray-900 mb-6">Explore Neighborhood on Map</h3>
                <div className="w-full h-80 rounded-2xl overflow-hidden border border-gray-200">
                  <iframe 
                    width="100%" 
                    height="100%" 
                    style={{ border: 0 }}
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                    src={`https://www.google.com/maps?q=${property.locationDetails.coordinates.lat},${property.locationDetails.coordinates.lng}&z=15&output=embed`}
                  ></iframe>
                </div>
              </div>
            )}

            <EMIWidget propertyPrice={property.priceNum} maintenanceCharges={property.maintenanceCharges} />
          </div>

          {/* Right Column (30%) - Sticky Sidebar */}
          <div className="w-full lg:w-[32%]">
            {property.seller && <SellerCard seller={property.seller} />}
          </div>
        </div>

        <SimilarProperties currentLocality={property.locationDetails?.locality || 'Unknown'} />
      </div>

      <StickyActionPanel property={property} />

      {property.virtualTours && (
        <Dynamic360Modal
          isOpen={is360ModalOpen}
          onClose={() => setIs360ModalOpen(false)}
          tours={property.virtualTours}
          propertyName={property.title || 'Property Tour'}
          propertyId={property.id}
        />
      )}
    </div>
  );
}


