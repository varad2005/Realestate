import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
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
import { VirtualTourButton, Dynamic360Modal } from '@/components/Property360';
import { ArrowLeft, Loader2, AlertCircle } from 'lucide-react';

export function PropertyDetailsPage() {
  const { id } = useParams();
  const { data: property, loading, error } = useProperty(id);
  const [showTourModal, setShowTourModal] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-[#FF3F6C] mb-4" size={48} />
        <p className="text-gray-500 font-medium text-lg animate-pulse">Loading property details...</p>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex flex-col items-center justify-center">
        <AlertCircle className="text-red-500 mb-4" size={64} />
        <h2 className="text-2xl font-bold font-['Poppins'] text-[#1A1A1A] mb-2">Oops! Something went wrong.</h2>
        <p className="text-gray-500 mb-8 max-w-md text-center">{error || "The property you're looking for doesn't exist or has been removed."}</p>
        <Link to="/" className="bg-[#1A1A1A] text-white px-6 py-3 rounded-xl font-bold hover:bg-gray-800 transition-colors">
          Return to Home
        </Link>
      </div>
    );
  }

  const hasTours = (property.virtualTours?.length ?? 0) > 0;

  return (
    <div className="bg-[#f8f9fa] min-h-screen pb-24 lg:pb-0">
      <div className="pt-28 pb-6 px-6 md:px-10 max-w-[1440px] mx-auto">
        <Link to="/buy" className="text-gray-500 hover:text-[#FF3F6C] transition-colors flex items-center gap-2 mb-6 font-medium w-max">
          <ArrowLeft size={18} /> Back to Search
        </Link>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Left Column (70%) */}
          <div className="w-full lg:w-[68%] space-y-12">

            {/* Gallery + 360° Tour Button overlay */}
            <div className="relative">
              <PropertyGallery images={property.images} videos={property.videos} />

              {hasTours && (
                <div className="absolute bottom-16 left-4 z-20">
                  <VirtualTourButton
                    onClick={() => setShowTourModal(true)}
                    sceneCount={property.virtualTours!.length}
                  />
                </div>
              )}
            </div>
            
            <div className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-gray-100">
              <PropertyOverview property={property} />
            </div>

            <PropertyHighlights highlights={property.highlights} />

            {property.amenities && property.amenities.length > 0 && (
              <div className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-gray-100">
                <PropertyAmenities amenities={property.amenities} />
              </div>
            )}

            <ProjectDetails project={property.projectDetails} />

            {property.locationDetails && property.locationDetails.advantages && (
              <LocationAdvantages advantages={property.locationDetails.advantages} />
            )}

            {property.locationDetails && (
              <div className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-gray-100">
                <PropertyLocation location={property.locationDetails} />
              </div>
            )}

            {property.locationDetails?.coordinates && (
              <div className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-gray-100">
                <h3 className="text-xl font-bold font-['Poppins'] text-[#1A1A1A] mb-6">Explore Neighborhood on Map</h3>
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

      {/* 360° Virtual Tour Modal */}
      {hasTours && (
        <Dynamic360Modal
          isOpen={showTourModal}
          onClose={() => setShowTourModal(false)}
          tours={property.virtualTours!}
          propertyName={property.title}
          propertyId={property.id}
        />
      )}
    </div>
  );
}


