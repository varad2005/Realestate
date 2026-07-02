import { useState } from "react";
import { Check, Star, Phone, MapPin, AlertCircle, MessageCircle, Smartphone, Lightbulb, Globe, Upload, X as XIcon, Trash2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { propertyService } from "@/services/propertyService";
import { virtualTourService } from "@/services/virtualTourService";
import { getPropertyImage } from "@/utils/propertyImages";
import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { AddonService, addonService } from "@/services/addonService";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

function LocationPickerMap({ lat, lng, onLocationSelect }: { lat: number, lng: number, onLocationSelect: (lat: number, lng: number) => void }) {
  const customIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41]
  });

  function MapEvents() {
    const map = useMap();
    useMapEvents({
      click(e) {
        onLocationSelect(e.latlng.lat, e.latlng.lng);
      },
    });
    // Optional: center map if coordinates change drastically from outside
    return null;
  }

  return (
    <MapContainer center={[lat, lng]} zoom={13} scrollWheelZoom={true} className="w-full h-full z-0">
      <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
      <Marker position={[lat, lng]} icon={customIcon} />
      <MapEvents />
    </MapContainer>
  );
}

export function PostPropertyPage() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const editId = searchParams.get('edit');
  
  // Edit mode tracking state
  const [existingImages, setExistingImages] = useState<any[]>([]);
  const [existingVideos, setExistingVideos] = useState<any[]>([]);
  const [existingTours, setExistingTours] = useState<any[]>([]);
  const [deletedImageIds, setDeletedImageIds] = useState<string[]>([]);
  const [deletedVideoIds, setDeletedVideoIds] = useState<string[]>([]);
  const [deletedTourIds, setDeletedTourIds] = useState<string[]>([]);
  const [isLoadingEdit, setIsLoadingEdit] = useState(!!editId);

  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submittedProperty, setSubmittedProperty] = useState<any>(null);

  const [lookingTo, setLookingTo] = useState("Sell");
  const [category, setCategory] = useState("Residential");
  const [propType, setPropType] = useState("Flat/Apartment");
  const [phone] = useState("");

  // New form fields
  const [city, setCity] = useState("");
  const [locality, setLocality] = useState("");
  const [expectedPrice, setExpectedPrice] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [videos, setVideos] = useState<File[]>([]);
  const [videoUrls, setVideoUrls] = useState<string[]>([]);
  const [primaryVideoIndex] = useState<number>(0);
  // Structured details
  const [bhk, setBhk] = useState("");
  const [bathrooms, setBathrooms] = useState("");
  const [balconies, setBalconies] = useState("");
  const [areaSqft, setAreaSqft] = useState("");
  const [carpetArea, setCarpetArea] = useState("");
  const [builtUpArea, setBuiltUpArea] = useState("");
  const [superBuiltUpArea, setSuperBuiltUpArea] = useState("");
  const [furnishing, setFurnishing] = useState("Unfurnished");
  const [ownershipType, setOwnershipType] = useState("Freehold");
  const [projectName, setProjectName] = useState("");
  const [maintenanceCharges, setMaintenanceCharges] = useState("");
  const [marketingTagline, setMarketingTagline] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [floorNumber, setFloorNumber] = useState("");
  const [totalFloors, setTotalFloors] = useState("");
  const [propertyAge, setPropertyAge] = useState("");
  const [possessionStatus, setPossessionStatus] = useState("Ready to Move");

  // Step 5 Dynamic States
  const [dbAmenities, setDbAmenities] = useState<any[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  // const [selectedOtherRooms, setSelectedOtherRooms] = useState<string[]>([]);
  // const [parkingCovered, setParkingCovered] = useState(0);
  // const [parkingOpen, setParkingOpen] = useState(0);
  const [selectedFeatures] = useState<string[]>([]);
  const [selectedHighlights, setSelectedHighlights] = useState<string[]>([]);
  // const [selectedOverlooking, setSelectedOverlooking] = useState<string[]>([]);
  // const [selectedPowerBackup, setSelectedPowerBackup] = useState("");
  const [selectedFacing, setSelectedFacing] = useState("");
  // const [flooringType, setFlooringType] = useState("");
  // const [roadWidth, setRoadWidth] = useState("");
  // const [roadWidthUnit, setRoadWidthUnit] = useState("Feet");
  const [selectedLocationAdvantages, setSelectedLocationAdvantages] = useState<string[]>([]);
  
  // Addons State
  const [availableAddons, setAvailableAddons] = useState<AddonService[]>([]);
  const [selectedAddonIds, setSelectedAddonIds] = useState<string[]>([]);

  // 360° Virtual Tour Upload State
  interface TourScene { file: File; previewUrl: string; title: string; isDefault: boolean; uploadProgress: number; }
  const [tourScenes, setTourScenes] = useState<TourScene[]>([]);
  const [tourUploading, setTourUploading] = useState(false);


  useEffect(() => {
    if (editId) {
      propertyService.getPropertyById(editId).then((data: any) => {
        if (!data) return;
        setCity(data.city || "");
        setLocality(data.location ? data.location.split(',')[0] : "");
        setExpectedPrice(data.priceNum?.toString() || "");
        setDescription(data.description || "");
        setBhk(data.bhk?.toString() || "");
        setBathrooms(data.bathrooms?.toString() || "");
        setBalconies(data.balconies?.toString() || "");
        setAreaSqft(data.area ? data.area.replace(/[^0-9]/g, '') : "");
        setCarpetArea(data.carpetArea?.toString() || "");
        setBuiltUpArea(data.builtUpArea?.toString() || "");
        setSuperBuiltUpArea(data.superBuiltUpArea?.toString() || "");
        setFurnishing(data.furnishing || "Unfurnished");
        setOwnershipType(data.ownershipType || "Freehold");
        setProjectName(data.projectName || data.builder || "");
        setFloorNumber(data.floor || "");
        setTotalFloors(data.totalFloors?.toString() || "");
        setPropertyAge(data.propertyAge || "");
        setPossessionStatus(data.possession || "Ready to Move");
        // @ts-ignore
        setFacing(data.facing || "");
        setCategory(data.type === 'commercial' ? 'Commercial' : 'Residential');
        setPropType(data.type || "Flat/Apartment");
        
        // Media Hydration
        if (data.images) {
           // filter out the auto-generated ones from getPropertyImage
           const realImages = data.images.filter((img:any) => !img.id.startsWith('default-img-'));
           setExistingImages(realImages);
        }
        if (data.videos) setExistingVideos(data.videos);
        if (data.virtualTours) setExistingTours(data.virtualTours);
        
        if (data.amenities) setSelectedAmenities(data.amenities.map((a:any) => a.name));
        
        setIsLoadingEdit(false);
        setStarted(true);
        setStep(1); // Ensure they start at step 1 for editing
      }).catch(err => {
        console.error("Failed to load property for editing:", err);
        setIsLoadingEdit(false);
      });
    }
  }, [editId]);

  useEffect(() => {
    supabase.from('amenities').select('*').then(({data}) => {
      if (data) setDbAmenities(data);
    });
    addonService.getActiveServices().then(data => {
      if (data) setAvailableAddons(data);
    }).catch(console.error);
  }, []);

  const handleTourUpload = (file: File, isReplace = false) => {
    const img = new window.Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      const ratio = img.width / img.height;
      if (ratio < 1.9 || ratio > 2.1) {
        alert("Please upload a valid equirectangular panorama with a 2:1 aspect ratio (e.g., 4000x2000 pixels).");
        URL.revokeObjectURL(img.src);
        return;
      }
      const newScene = {
        file,
        previewUrl: img.src,
        title: file.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' '),
        isDefault: true,
        uploadProgress: 0,
      };
      setTourScenes([newScene]);
    };
    img.onerror = () => {
      alert("Invalid image file.");
    };
  };

  const toggleArray = (setter: any, array: string[], value: string) => {
    if (array.includes(value)) setter(array.filter((v: string) => v !== value));
    else setter([...array, value]);
  };

  const handleSubmit = async () => {
    if (!user) {
      setSubmitError("You must be logged in to post a property.");
      return;
    }
    if (!city || !locality || !expectedPrice || !propType) {
      setSubmitError("City, Locality, Property Type, and Expected Price are all required.");
      return;
    }
    if (!areaSqft && !builtUpArea && !carpetArea && !superBuiltUpArea) {
      setSubmitError("At least one Area measurement (e.g., Total Area) is required.");
      return;
    }
    const isResidential = category === "Residential";
    const needsRooms = isResidential && propType !== "Plot / Land";
    if (needsRooms && (!bhk || !bathrooms)) {
      setSubmitError("BHK and Bathrooms are required for residential properties.");
      return;
    }
    
    setIsSubmitting(true);
    setSubmitError("");
    
    try {
      const priceNum = Number(expectedPrice.replace(/[^0-9]/g, ''));
      const amenity_ids = selectedAmenities
        .map(name => dbAmenities.find(a => a.name === name)?.id)
        .filter(Boolean);

      // Upload images first
      let finalImages: any[] = [];
      for (const file of images) {
        const { url } = await propertyService.uploadPropertyImage(file, user.id);
        if (url) finalImages.push({ url });
      }

      // Upload videos
      let finalVideos: any[] = [];
      for (const file of videos) {
        const { url } = await propertyService.uploadPropertyVideo(file, user.id);
        if (url) finalVideos.push({ url, title: file.name, size: file.size });
      }

      const isDealer = user.role === 'dealer' || user.role === 'builder';

      const payload = {
        owner_id: user.id,
        title: `${lookingTo} ${propType} in ${locality || city}`,
        city: city,
        locality: locality,
        price: priceNum,
        price_num: priceNum,
        price_display: `₹${(priceNum/100000).toFixed(1)} Lacs`,
        description: description || undefined,
        status: 'pending', // Explicitly pending per requirements
        property_type: propType,
        bhk: bhk ? Number(bhk) : null,
        bathrooms: bathrooms ? Number(bathrooms) : null,
        area_sqft: areaSqft ? Number(areaSqft) : null,
        carpet_area: carpetArea ? Number(carpetArea) : null,
        built_up_area: builtUpArea ? Number(builtUpArea) : null,
        super_built_up_area: superBuiltUpArea ? Number(superBuiltUpArea) : null,
        furnishing,
        ownership_type: ownershipType,
        posted_by_role: user.role || 'owner',
        floor_number: floorNumber ? Number(floorNumber) : null,
        total_floors: totalFloors ? Number(totalFloors) : null,
        facing: selectedFacing || null,
        possession_status: possessionStatus || 'Ready to Move',
        property_age: propertyAge || null,
        balconies: balconies ? Number(balconies) : null,
        maintenance_charges: maintenanceCharges ? Number(maintenanceCharges) : null,
        state: state || undefined,
        pincode: pincode || undefined,
        address: locality || city,
        lat: lat ? Number(lat) : null,
        lng: lng ? Number(lng) : null,
        images: finalImages.length > 0 ? finalImages : undefined,
        videos: finalVideos.length > 0 ? finalVideos : undefined,
        primaryVideoIndex: primaryVideoIndex,
        amenity_ids: isDealer ? amenity_ids : undefined,
        project_details: (isDealer && projectName) ? {
          project_name: projectName,
          builder_name: 'Unknown Builder',
          launch_year: null,
          possession_date: null,
          total_units: null,
          project_area: null,
          rera_number: null,
          marketing_tagline: marketingTagline || null,
          description: null
        } : undefined,
        location_advantages: isDealer ? selectedLocationAdvantages.map(name => ({
          name, distance: "1", type: "Landmark"
        })) : undefined,
        highlights: selectedHighlights.map(title => ({
          title, value: "Yes"
        }))
      };

      const { data: newProp, error } = await propertyService.createProperty(payload);
      if (error) throw error;
      
      if (selectedAddonIds.length > 0) {
        for (const addonId of selectedAddonIds) {
          const addon = availableAddons.find(a => a.id === addonId);
          if (addon) {
            const price = addon.base_price + (addon.base_price * addon.tax_percentage / 100);
            await supabase.from('property_addon_orders').insert({
              property_id: newProp.id,
              addon_service_id: addon.id,
              quantity: 1,
              price_at_purchase: price,
              total_amount: price,
              payment_status: 'Pending',
              order_status: 'Pending'
            });
          }
        }
      }
      
      setSubmittedProperty({
        id: newProp.id,
        title: newProp.title,
        priceDisplay: newProp.price_display,
        address: [locality, city, state].filter(Boolean).join(", "),
        bhk: newProp.bhk,
        propType: newProp.property_type,
        imageUrl: finalImages.length > 0 ? finalImages[0].url : getPropertyImage(newProp.id),
        shortId: newProp.id.substring(0, 8).toUpperCase()
      });

      // Upload 360° tour scenes (after property creation)
      if (tourScenes.length > 0) {
        setTourUploading(true);
        try {
          for (let i = 0; i < tourScenes.length; i++) {
            const scene = tourScenes[i];
            const { url } = await virtualTourService.uploadPanorama(scene.file, user.id, newProp.id);
            if (url) {
              await virtualTourService.saveTourScene({
                propertyId: newProp.id,
                panoramaUrl: url,
                title: scene.title || `Scene ${i + 1}`,
                sortOrder: i,
                isDefault: scene.isDefault || i === 0,
              });
            }
          }
        } catch (tourErr) {
          console.warn('Tour upload failed (non-critical):', tourErr);
        } finally {
          setTourUploading(false);
        }
      }
      
      setStep(isDealer ? 11 : 8); // Adjust success step based on role
    } catch (err: any) {
      console.error("Failed to post property:", err);
      setSubmitError(err.message || "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const lookingToOptions = ["Sell", "Rent / Lease", "PG"];
  const resOptions = [
    "Flat/Apartment",
    "Independent House / Villa",
    "Builder Floor",
    "Plot / Land",
    "1 RK/ Studio Apartment",
    "Serviced Apartment",
    "Farmhouse",
    "Other",
  ];
  const comOptions = [
    "Office Space",
    "Shop",
    "Showroom",
    "Warehouse",
    "Industrial Building",
    "Coworking Space",
    "Other",
  ];

  const currentOptions = category === "Residential" ? resOptions : comOptions;

  const isDealerUser = user?.role === 'dealer' || user?.role === 'builder';
  const isSuccessStep = isDealerUser ? step === 11 : step === 8;

  if (started && isSuccessStep) {
    return (
      <div className="bg-white min-h-screen pt-28 pb-20">
        <div className="max-w-[1000px] mx-auto px-6 flex flex-col md:flex-row gap-8 items-start">
          
          {/* LEFT: Success Confirmation */}
          <div className="w-full md:w-[350px] bg-white rounded-2xl shadow-sm p-8 text-center border border-gray-200 shrink-0">
            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check size={32} className="stroke-[3]" />
            </div>
            <h2 className="text-2xl font-extrabold text-gray-900 font-['Poppins'] leading-tight mb-8">
              Your free listing <br/> will be live soon
            </h2>
            
            <div className="bg-gray-50 rounded-xl overflow-hidden text-left mb-6 border border-gray-200">
              <div className="h-32 bg-gray-50/80">
                <img src={submittedProperty?.imageUrl || getPropertyImage('788053')} alt="Preview" className="w-full h-full object-cover" />
              </div>
              <div className="p-4">
                <p className="text-[10px] font-bold text-gray-500 mb-1">PROPERTY ID: {submittedProperty?.shortId || 'N89137005'}</p>
                <p className="font-bold text-gray-900 text-sm leading-snug">{submittedProperty?.title || 'Sell 2 BHK Flat/Apartment'}</p>
                <p className="text-xs text-gray-500 mt-1 truncate">{submittedProperty?.address || 'Anup Apartment, Mulund East, Mumbai'}</p>
                <p className="font-extrabold text-gray-900 mt-3">{submittedProperty?.priceDisplay || '₹1.65 Crore'}</p>
              </div>
            </div>
            
            <button 
              onClick={() => window.location.href = `/property/${submittedProperty?.id}`}
              disabled={!submittedProperty?.id}
              className="w-full border border-gray-200 text-gray-900 font-bold py-2.5 rounded-xl text-sm hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Edit / Preview
            </button>
          </div>

          {/* RIGHT: Upgrade Upsell */}
          <div className="flex-1">
            <p className="text-sm font-semibold text-pink-600 mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-pink-600 animate-pulse"></span>
              12,45,437+ listings currently live on Nestify
            </p>
            <h2 className="text-3xl font-extrabold text-gray-900 font-['Poppins'] mb-8">
              Free listings get lower visibility due to competition
            </h2>

            <p className="font-bold text-gray-900 mb-4">Upgrade & get more attention from buyers</p>
            
            <div className="bg-white rounded-2xl shadow-lg border border-pink-600/20 overflow-hidden relative">
              <div className="absolute top-0 left-0 bg-pink-600/10 text-pink-600 text-xs font-bold px-4 py-1.5 rounded-br-xl flex items-center gap-1.5">
                <Star size={12} className="fill-[#FF3F6C]" /> Advanced
              </div>
              
              <div className="flex flex-col md:flex-row">
                <div className="p-8 pt-12 flex-1 space-y-4">
                  <div className="flex gap-3">
                    <Check size={18} className="text-pink-600 shrink-0" />
                    <p className="text-sm"><span className="font-bold text-gray-900">5x more responses</span> from buyers</p>
                  </div>
                  <div className="flex gap-3">
                    <Check size={18} className="text-pink-600 shrink-0" />
                    <p className="text-sm"><span className="font-bold text-gray-900">Stand out to buyers</span> with Premium listing</p>
                  </div>
                  <div className="flex gap-3">
                    <Check size={18} className="text-pink-600 shrink-0" />
                    <p className="text-sm"><span className="font-bold text-gray-900">Free Verification & Photoshoot</span> of your property*</p>
                  </div>
                </div>
                
                <div className="bg-emerald-500/10 p-8 md:w-[220px] flex flex-col justify-center shrink-0 border-l border-success/20">
                  <p className="text-xs text-gray-500 font-medium mb-1">2 months</p>
                  <p className="text-3xl font-extrabold text-gray-900 font-['Poppins'] mb-1">₹4091</p>
                  <p className="text-[10px] text-gray-500 mb-4">all inclusive</p>
                  <button className="w-full bg-emerald-500 text-white font-bold py-3 rounded-xl shadow-md shadow-emerald-200 hover:bg-emerald-500 transition-colors">
                    Buy Now
                  </button>
                </div>
              </div>
              
              <div className="bg-indigo-600/10 py-3 px-6 border-t border-secondary/20">
                <p className="text-xs text-indigo-600 font-medium flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full"></span>
                  400+ owners chose upgrade in last 48hrs
                </p>
              </div>
            </div>

            <p className="text-xs text-gray-500 mt-6 flex items-center gap-2">
              <Phone size={14} /> Need help? Call us on - <span className="font-bold text-gray-900">1800 41 99099</span> (Toll Free IND)
            </p>
          </div>

        </div>
      </div>
    );
  }

  if (started) {
    return (
      <div className="bg-white min-h-screen pt-24 pb-20">
        <div className="max-w-[1200px] mx-auto px-6 flex gap-6 items-start">
          
          {/* SIDEBAR: Stepper */}
          <div className="w-[300px] shrink-0 flex flex-col gap-6">
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200">
              <div className="space-y-6 relative before:absolute before:inset-0 before:ml-3 before:-translate-x-px before:w-0.5 before:bg-gray-50/80 before:z-0">
                {(isDealerUser ? [
                  { num: 1, title: "Basic Details", desc: propType ? `${propType} for ${lookingTo}` : "Step 1" },
                  { num: 2, title: "Location Details", desc: locality ? locality : (city || "Step 2") },
                  { num: 3, title: "Property Profile", desc: expectedPrice ? `₹${expectedPrice}` : (bhk ? `${bhk} BHK` : "Step 3") },
                  { num: 4, title: "Media", desc: images.length > 0 ? `${images.length} Photos` : "Step 4" },
                  { num: 5, title: "360° Virtual Tour", desc: tourScenes.length > 0 ? `${tourScenes.length} Scene${tourScenes.length > 1 ? 's' : ''}` : "Optional" },
                  { num: 6, title: "Project Info", desc: projectName ? projectName : "Step 6" },
                  { num: 7, title: "Amenities", desc: selectedAmenities.length > 0 ? `${selectedAmenities.length} Amenities` : "Step 7" },
                  { num: 8, title: "Location Advantages", desc: selectedLocationAdvantages.length > 0 ? `${selectedLocationAdvantages.length} Landmarks` : "Step 8" },
                  { num: 9, title: "Highlights", desc: selectedHighlights.length > 0 ? `${selectedHighlights.length} Selected` : "Step 9" },
                  { num: 10, title: "Add-on Services", desc: selectedAddonIds.length > 0 ? `${selectedAddonIds.length} Added` : "Step 10" }
                ] : [
                  { num: 1, title: "Basic Details", desc: propType ? `${propType} for ${lookingTo}` : "Step 1" },
                  { num: 2, title: "Location Details", desc: locality ? locality : (city || "Step 2") },
                  { num: 3, title: "Property Profile", desc: expectedPrice ? `₹${expectedPrice}` : (bhk ? `${bhk} BHK` : "Step 3") },
                  { num: 4, title: "Media", desc: images.length > 0 ? `${images.length} Photos` : "Step 4" },
                  { num: 5, title: "360° Virtual Tour", desc: tourScenes.length > 0 ? `${tourScenes.length} Scene${tourScenes.length > 1 ? 's' : ''}` : "Optional" },
                  { num: 6, title: "Highlights", desc: selectedHighlights.length > 0 ? `${selectedHighlights.length} Selected` : "Step 6" },
                  { num: 7, title: "Add-on Services", desc: selectedAddonIds.length > 0 ? `${selectedAddonIds.length} Added` : "Step 7" }
                ]).map((s) => {
                  const isActive = step === s.num;
                  const isPast = step > s.num;
                  return (
                    <div key={s.num} className="relative z-10 flex gap-4">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border-2 bg-white ${
                        isActive ? "border-pink-600" : isPast ? "border-success bg-emerald-500" : "border-gray-200"
                      }`}>
                        {isActive && <div className="w-2.5 h-2.5 bg-pink-600 rounded-full" />}
                        {isPast && <Check size={12} className="text-white" />}
                      </div>
                      <div>
                        <p className={`text-sm font-bold ${isActive ? "text-gray-900" : "text-gray-500"}`}>
                          {s.title}
                        </p>
                        <p className={`text-xs mt-0.5 ${isActive ? "text-pink-600" : "text-gray-500"}`}>
                          {s.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200 flex items-center gap-4">
              <div className="relative w-16 h-16 flex items-center justify-center rounded-full border-4 border-gray-200">
                {(() => {
                  let filled = 0;
                  if (lookingTo) filled++;
                  if (propType) filled++;
                  if (phone) filled++;
                  if (city) filled++;
                  if (locality) filled++;
                  if (bhk) filled++;
                  if (areaSqft) filled++;
                  if (expectedPrice) filled++;
                  if (furnishing) filled++;
                  if (ownershipType) filled++;
                  if (images.length > 0) filled++;
                  if (selectedAmenities.length > 0 || selectedFeatures.length > 0 || selectedLocationAdvantages.length > 0) filled++;
                  
                  const profileCompletion = Math.round((filled / 12) * 100);
                  const dashOffset = 175 - (175 * profileCompletion) / 100;
                  
                  return (
                    <>
                      <svg className="absolute inset-0 w-full h-full -rotate-90">
                        <circle cx="28" cy="28" r="28" fill="transparent" stroke="#E5E7EB" strokeWidth="4" />
                        <circle cx="28" cy="28" r="28" fill="transparent" stroke="#10B981" strokeWidth="4" strokeDasharray="175" strokeDashoffset={dashOffset} strokeLinecap="round" className="transition-all duration-1000 ease-out" />
                      </svg>
                      <span className="relative z-10 text-sm font-bold text-gray-900">
                        {profileCompletion}%
                      </span>
                    </>
                  );
                })()}
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900">Profile Completion</h3>
                <p className="text-xs text-gray-500">Complete profile to get more buyers</p>
              </div>
            </div>
          </div>

          {/* MAIN CONTENT */}
          <div className="flex-1 bg-white rounded-2xl shadow-sm p-10 border border-gray-200 min-h-[600px]">
            {step === 1 && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-2xl font-bold text-gray-900 font-['Poppins'] mb-1">
                  Welcome back,
                </h2>
                <h3 className="text-xl font-medium text-gray-500 mb-8">
                  Fill out basic details
                </h3>

                {/* Looking to... */}
                <div className="mb-8">
                  <p className="text-base font-semibold text-gray-900 mb-4">I'm looking to</p>
                  <div className="flex flex-wrap gap-4">
                    {lookingToOptions.map(opt => (
                      <button
                        key={opt}
                        onClick={() => setLookingTo(opt)}
                        className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all ${
                          lookingTo === opt 
                            ? "bg-pink-600/10 text-pink-600 border border-pink-600" 
                            : "bg-white text-gray-500 border border-gray-200 hover:border-gray-200"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Property Kind */}
                <div className="mb-8">
                  <p className="text-base font-semibold text-gray-900 mb-4">What kind of property do you have?</p>
                  <div className="flex gap-8 mb-5">
                    {["Residential", "Commercial"].map(cat => (
                      <label key={cat} className="flex items-center gap-2 cursor-pointer group">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                          category === cat ? "border-pink-600" : "border-gray-200 group-hover:border-gray-300"
                        }`}>
                          {category === cat && <div className="w-2.5 h-2.5 bg-pink-600 rounded-full" />}
                        </div>
                        <span className="text-sm text-gray-900 font-medium">{cat}</span>
                        <input 
                          type="radio" 
                          name="category_wizard" 
                          value={cat} 
                          checked={category === cat}
                          onChange={() => { setCategory(cat); setPropType(""); }}
                          className="hidden" 
                        />
                      </label>
                    ))}
                  </div>

                  {/* Property Type Pills */}
                  <div className="flex flex-wrap gap-3">
                    {currentOptions.map(opt => (
                      <button
                        key={opt}
                        onClick={() => setPropType(opt)}
                        className={`px-5 py-2 rounded-full text-sm transition-all border ${
                          propType === opt 
                            ? "bg-gray-50 text-gray-900 border-gray-300 font-semibold" 
                            : "bg-white text-gray-500 border-gray-200 hover:border-gray-200"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                <button 
                  onClick={() => setStep(2)}
                  className="bg-pink-600 text-white px-10 py-3 rounded-xl font-bold text-base shadow-md hover:bg-pink-600/90 transition-all hover:-translate-y-0.5 mt-4"
                >
                  Continue
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="flex gap-10">
                  <div className="flex-1">
                    <button onClick={() => setStep(1)} className="text-gray-500 hover:text-gray-900 font-semibold text-sm mb-6 flex items-center gap-1 transition-colors">
                      ← Back
                    </button>
                    
                    <h2 className="text-2xl font-bold text-gray-900 font-['Poppins'] mb-1">
                      Where is your property located?
                    </h2>
                    <p className="text-sm text-gray-500 mb-6">An accurate location helps you connect with the right buyers</p>

                    <div className="bg-red-500/10 text-red-500 px-4 py-3 rounded-lg text-sm font-medium flex items-center justify-between mb-8">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 bg-red-500/40 rounded-full flex items-center justify-center text-xs">i</div>
                        Nestify needs location permission to pick your location
                      </div>
                      <button className="text-red-500/80 hover:text-red-500">×</button>
                    </div>

                    <div className="space-y-5 mb-8">
                      <div>
                        <input type="text" placeholder="City" value={city} onChange={e => setCity(e.target.value)} className="w-full border border-gray-200 rounded-xl p-3.5 outline-none focus:border-pink-600 focus:ring-1 focus:ring-[#FF3F6C] transition-all text-sm font-medium" />
                      </div>
                      <div className="flex gap-4">
                        <input type="text" placeholder="State" value={state} onChange={e => setState(e.target.value)} className="flex-1 border border-gray-200 rounded-xl p-3.5 outline-none focus:border-pink-600 focus:ring-1 focus:ring-[#FF3F6C] transition-all text-sm font-medium" />
                        <input type="text" placeholder="Pincode" value={pincode} onChange={e => setPincode(e.target.value)} className="flex-1 border border-gray-200 rounded-xl p-3.5 outline-none focus:border-pink-600 focus:ring-1 focus:ring-[#FF3F6C] transition-all text-sm font-medium" />
                      </div>
                      <div>
                        <input type="text" placeholder="Locality" value={locality} onChange={e => setLocality(e.target.value)} className="w-full border border-gray-200 rounded-xl p-3.5 outline-none focus:border-pink-600 focus:ring-1 focus:ring-[#FF3F6C] transition-all text-sm font-medium" />
                      </div>
                      <div>
                        <input type="text" placeholder="Sub Locality (Optional)" className="w-full border border-gray-200 rounded-xl p-3.5 outline-none focus:border-pink-600 focus:ring-1 focus:ring-[#FF3F6C] transition-all text-sm" />
                      </div>
                      <div>
                        <input type="text" placeholder="Apartment / Society" className="w-full border border-gray-200 rounded-xl p-3.5 outline-none focus:border-pink-600 focus:ring-1 focus:ring-[#FF3F6C] transition-all text-sm font-medium" />
                      </div>
                      <div>
                        <input type="text" placeholder="House No. (Optional)" className="w-full border border-gray-200 rounded-xl p-3.5 outline-none focus:border-pink-600 focus:ring-1 focus:ring-[#FF3F6C] transition-all text-sm" />
                      </div>
                    </div>

                    <div className="mb-8">
                      <h3 className="text-base font-semibold text-gray-900 mb-3">Map Coordinates</h3>
                      <div className="w-full h-48 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-200 mb-3 relative overflow-hidden">
                         <LocationPickerMap 
                           lat={parseFloat(lat) || 18.5204} 
                           lng={parseFloat(lng) || 73.8567} 
                           onLocationSelect={(l, ln) => { setLat(l.toFixed(6)); setLng(ln.toFixed(6)); }} 
                         />
                      </div>
                      <div className="flex gap-4">
                        <input type="text" placeholder="Latitude (e.g. 18.5204)" value={lat} onChange={e => setLat(e.target.value)} className="flex-1 border border-gray-200 rounded-xl p-3 outline-none focus:border-pink-600 focus:ring-1 focus:ring-[#FF3F6C] transition-all text-sm" />
                        <input type="text" placeholder="Longitude (e.g. 73.8567)" value={lng} onChange={e => setLng(e.target.value)} className="flex-1 border border-gray-200 rounded-xl p-3 outline-none focus:border-pink-600 focus:ring-1 focus:ring-[#FF3F6C] transition-all text-sm" />
                      </div>
                    </div>

                    <button 
                      onClick={() => setStep(3)}
                      className="bg-pink-600 text-white px-10 py-3 rounded-xl font-bold text-base shadow-md hover:bg-pink-600/90 transition-all hover:-translate-y-0.5"
                    >
                      Continue
                    </button>
                  </div>
                  
                  {/* Right Info Panel */}
                  <div className="w-[280px] hidden md:block shrink-0 pt-16">
                    <div className="bg-indigo-600/10/50 rounded-2xl p-6 text-center">
                       <div className="w-20 h-20 bg-indigo-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                         <MapPin size={32} className="text-indigo-600" />
                       </div>
                       <h4 className="font-bold text-gray-900 mb-2">Why we need an accurate location?</h4>
                       <p className="text-xs text-gray-500 leading-relaxed">Location is the most important for Buyers. By capturing a detailed location we ensure we get you genuine enquiries.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                <button onClick={() => setStep(2)} className="text-gray-500 hover:text-gray-900 font-semibold text-sm mb-6 flex items-center gap-1 transition-colors">
                  ← Back
                </button>
                
                <h2 className="text-2xl font-bold text-gray-900 font-['Poppins'] mb-8">
                  Tell us about your property
                </h2>

                <div className="space-y-10">
                  {/* Area Details */}
                  <div>
                    <h3 className="text-base font-semibold text-gray-900 mb-1 flex items-center gap-1">Add Area Details <span className="text-gray-500 text-xs font-normal">?</span></h3>
                    <p className="text-xs text-gray-500 mb-4">Atleast one area type is mandatory</p>
                    <div className="flex flex-col gap-3 mb-3">
                      <div className="flex gap-4">
                        <input type="text" value={areaSqft} onChange={e => setAreaSqft(e.target.value)} placeholder="Built-up Area / Total Area" className="flex-1 border border-gray-200 rounded-xl p-3 outline-none focus:border-pink-600 focus:ring-1 focus:ring-[#FF3F6C] transition-all text-sm font-medium" />
                        <select className="w-28 border border-gray-200 rounded-xl p-3 outline-none focus:border-pink-600 focus:ring-1 focus:ring-[#FF3F6C] transition-all text-sm bg-white">
                          <option>sq.ft.</option>
                          <option>sq.m.</option>
                        </select>
                      </div>
                      <div className="flex gap-4">
                        <input type="text" value={carpetArea} onChange={e => setCarpetArea(e.target.value)} placeholder="Carpet Area" className="flex-1 border border-gray-200 rounded-xl p-3 outline-none focus:border-pink-600 focus:ring-1 focus:ring-[#FF3F6C] transition-all text-sm" />
                        <input type="text" value={builtUpArea} onChange={e => setBuiltUpArea(e.target.value)} placeholder="Built Up Area" className="flex-1 border border-gray-200 rounded-xl p-3 outline-none focus:border-pink-600 focus:ring-1 focus:ring-[#FF3F6C] transition-all text-sm" />
                        <input type="text" value={superBuiltUpArea} onChange={e => setSuperBuiltUpArea(e.target.value)} placeholder="Super Built Up Area" className="flex-1 border border-gray-200 rounded-xl p-3 outline-none focus:border-pink-600 focus:ring-1 focus:ring-[#FF3F6C] transition-all text-sm" />
                      </div>
                    </div>
                  </div>

                  {/* Room Details */}
                  <div>
                    <h3 className="text-base font-semibold text-gray-900 mb-4">Add Room Details</h3>
                    <div className="space-y-6">
                      <div>
                        <p className="text-sm text-gray-900 font-medium mb-3">No. of Bedrooms</p>
                        <div className="flex flex-wrap gap-3">
                          {[1,2,3,4].map(n => (
                            <button key={n} onClick={() => setBhk(String(n))} className={`w-10 h-10 rounded-full border text-sm font-medium transition-all ${bhk === String(n) ? 'border-pink-600 text-pink-600 bg-pink-600/5' : 'border-gray-200 text-gray-900 hover:border-pink-600 hover:text-pink-600'}`}>{n}</button>
                          ))}
                          <button className="px-4 py-2 rounded-full border border-gray-200 text-sm font-medium text-indigo-600 hover:border-secondary transition-all">+ Add other</button>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-900 font-medium mb-3">No. of Bathrooms</p>
                        <div className="flex flex-wrap gap-3">
                          {[1,2,3,4].map(n => (
                            <button key={n} onClick={() => setBathrooms(String(n))} className={`w-10 h-10 rounded-full border text-sm font-medium transition-all ${bathrooms === String(n) ? 'border-pink-600 text-pink-600 bg-pink-600/5' : 'border-gray-200 text-gray-900 hover:border-pink-600 hover:text-pink-600'}`}>{n}</button>
                          ))}
                          <button className="px-4 py-2 rounded-full border border-gray-200 text-sm font-medium text-indigo-600 hover:border-secondary transition-all">+ Add other</button>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-900 font-medium mb-3">Balconies</p>
                        <div className="flex flex-wrap gap-3">
                          {[0,1,2,3].map(n => (
                            <button key={n} onClick={() => setBalconies(String(n))} className={`w-10 h-10 rounded-full border text-sm font-medium transition-all ${balconies === String(n) ? 'border-pink-600 text-pink-600 bg-pink-600/5' : 'border-gray-200 text-gray-900 hover:border-pink-600 hover:text-pink-600'}`}>{n}</button>
                          ))}
                          <button className="px-4 py-2 rounded-full border border-gray-200 text-sm font-medium text-gray-900 hover:border-pink-600 hover:text-pink-600 transition-all">More than 3</button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Floor Details */}
                  <div>
                    <h3 className="text-base font-semibold text-gray-900 mb-1">Floor Details</h3>
                    <p className="text-xs text-gray-500 mb-4">Total no of floors and your floor details</p>
                    <div className="flex gap-4">
                      <input type="number" placeholder="Total Floors" value={totalFloors} onChange={e => setTotalFloors(e.target.value)} className="flex-1 border border-gray-200 rounded-xl p-3 outline-none focus:border-pink-600 focus:ring-1 focus:ring-[#FF3F6C] transition-all text-sm" />
                      <input type="number" placeholder="Property on Floor" value={floorNumber} onChange={e => setFloorNumber(e.target.value)} className="flex-1 border border-gray-200 rounded-xl p-3 outline-none focus:border-pink-600 focus:ring-1 focus:ring-[#FF3F6C] transition-all text-sm" />
                    </div>
                  </div>

                  {/* Availability */}
                  <div>
                    <h3 className="text-base font-semibold text-gray-900 mb-3">Availability Status</h3>
                    <div className="flex flex-wrap gap-3">
                      {["Ready to Move", "Under Construction", "In 6 Months", "In 1 Year"].map(opt => (
                         <button key={opt} onClick={() => setPossessionStatus(opt)} className={`px-5 py-2 rounded-full border text-sm font-medium transition-all ${possessionStatus === opt ? 'border-pink-600 text-pink-600 bg-pink-600/5' : 'border-gray-200 text-gray-900 hover:border-gray-300 hover:bg-gray-50'}`}>{opt}</button>
                      ))}
                    </div>
                  </div>

                  {/* Property Age */}
                  <div>
                    <h3 className="text-base font-semibold text-gray-900 mb-3">Age of Property</h3>
                    <div className="flex flex-wrap gap-3">
                      {["New Construction", "Less than 5 years", "5-10 years", "10+ Years"].map(opt => (
                         <button key={opt} onClick={() => setPropertyAge(opt)} className={`px-5 py-2 rounded-full border text-sm font-medium transition-all ${propertyAge === opt ? 'border-pink-600 text-pink-600 bg-pink-600/5' : 'border-gray-200 text-gray-900 hover:border-gray-300 hover:bg-gray-50'}`}>{opt}</button>
                      ))}
                    </div>
                  </div>

                  {/* Facing */}
                  <div>
                    <h3 className="text-base font-semibold text-gray-900 mb-3">Property Facing</h3>
                    <div className="flex flex-wrap gap-3">
                      {["North", "South", "East", "West", "North-East", "North-West", "South-East", "South-West"].map(opt => (
                         <button key={opt} onClick={() => setSelectedFacing(opt)} className={`px-5 py-2 rounded-full border text-sm font-medium transition-all ${selectedFacing === opt ? 'border-pink-600 text-pink-600 bg-pink-600/5' : 'border-gray-200 text-gray-900 hover:border-gray-300 hover:bg-gray-50'}`}>{opt}</button>
                      ))}
                    </div>
                  </div>

                  {/* Furnishing */}
                  <div>
                    <h3 className="text-base font-semibold text-gray-900 mb-3">Furnishing Status</h3>
                    <div className="flex flex-wrap gap-3">
                      {["Furnished", "Semi-Furnished", "Unfurnished"].map(opt => (
                         <button key={opt} onClick={() => setFurnishing(opt)} className={`px-5 py-2 rounded-full border text-sm font-medium transition-all ${furnishing === opt ? 'border-pink-600 text-pink-600 bg-pink-600/5' : 'border-gray-200 text-gray-900 hover:border-gray-300 hover:bg-gray-50'}`}>{opt}</button>
                      ))}
                    </div>
                  </div>

                  {/* Ownership */}
                  <div>
                    <h3 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-1">Ownership <span className="text-gray-500 text-xs font-normal">?</span></h3>
                    <div className="flex flex-wrap gap-3">
                      {["Freehold", "Leasehold", "Co-operative society", "Power of Attorney"].map(opt => (
                         <button key={opt} onClick={() => setOwnershipType(opt)} className={`px-5 py-2 rounded-full border text-sm font-medium transition-all ${ownershipType === opt ? 'border-pink-600 text-pink-600 bg-pink-600/5' : 'border-gray-200 text-gray-900 hover:border-gray-300 hover:bg-gray-50'}`}>{opt}</button>
                      ))}
                    </div>
                  </div>

                  {/* Price Details */}
                  <div>
                    <h3 className="text-base font-semibold text-gray-900 mb-4">Price Details</h3>
                    <div className="flex gap-4 mb-4">
                      <div className="relative flex-1">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">₹</span>
                        <input type="text" placeholder="Expected Price" value={expectedPrice} onChange={e => setExpectedPrice(e.target.value)} className="w-full border border-gray-200 rounded-xl p-3 pl-8 outline-none focus:border-pink-600 focus:ring-1 focus:ring-[#FF3F6C] transition-all text-sm font-medium" />
                      </div>
                      <div className="relative flex-1">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">₹</span>
                        <input type="text" placeholder="Maintenance Charges (Optional)" value={maintenanceCharges} onChange={e => setMaintenanceCharges(e.target.value)} className="w-full border border-gray-200 rounded-xl p-3 pl-8 outline-none focus:border-pink-600 focus:ring-1 focus:ring-[#FF3F6C] transition-all text-sm" />
                      </div>
                    </div>
                    
                    <div className="space-y-3 mb-4">
                       <label className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" className="w-4 h-4 rounded border-gray-200 text-pink-600 focus:ring-[#FF3F6C]" />
                          <span className="text-sm text-gray-900">All inclusive price <span className="text-gray-500 text-xs">?</span></span>
                       </label>
                       <label className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" className="w-4 h-4 rounded border-gray-200 text-pink-600 focus:ring-[#FF3F6C]" />
                          <span className="text-sm text-gray-900">Tax and Govt. charges excluded</span>
                       </label>
                       <label className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" className="w-4 h-4 rounded border-gray-200 text-pink-600 focus:ring-[#FF3F6C]" />
                          <span className="text-sm text-gray-900">Price Negotiable</span>
                       </label>
                    </div>

                    <button className="text-indigo-600 font-semibold text-sm hover:underline">+ Add more pricing details</button>
                  </div>

                  <button 
                    onClick={() => setStep(4)}
                    className="bg-pink-600 text-white px-10 py-3 rounded-xl font-bold text-base shadow-md hover:bg-pink-600/90 transition-all hover:-translate-y-0.5 mt-4"
                  >
                    Post & continue
                  </button>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="flex gap-10">
                  <div className="flex-1">
                    <button onClick={() => setStep(3)} className="text-gray-500 hover:text-gray-900 font-semibold text-sm mb-6 flex items-center gap-1 transition-colors">
                      ← Back
                    </button>
                    <h2 className="text-2xl font-bold text-gray-900 font-['Poppins'] mb-6">
                      Add one video of property
                    </h2>
                    
                    <p className="text-sm text-gray-500 mb-4">A video is worth a thousand pictures. Properties with videos get higher page views</p>
                    <p className="text-sm text-gray-500 mb-6">Make sure it follows the <span className="text-indigo-600 font-semibold cursor-pointer">Video Guidelines</span></p>

                    {/* Video Upload */}
                    <div className="mb-6">
                      <div className="border border-secondary/40 rounded-xl overflow-hidden bg-indigo-600/10/30">
                        <div className="border-b border-secondary/40 py-3 flex justify-center items-center gap-2 bg-white">
                          <span className="bg-pink-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded uppercase">NEW</span>
                          <span className="text-gray-900 font-bold text-sm flex items-center gap-2">↑ Upload Video</span>
                        </div>
                        <div className="p-8 text-center cursor-pointer hover:bg-indigo-600/10 transition-colors">
                           <div className="w-12 h-12 bg-indigo-600/20 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                             <div className="w-6 h-4 bg-indigo-600 rounded relative">
                               <div className="absolute -right-2 top-1 w-0 h-0 border-t-4 border-b-4 border-l-[6px] border-transparent border-l-blue-500"></div>
                             </div>
                           </div>
                           <p className="text-xs text-gray-500 mb-1">Drag your videos here or <span className="text-indigo-600 font-semibold">Upload</span></p>
                           <p className="text-[10px] text-gray-500">Upload video of max size 80 MB in format .mov, .mp4, .H264. Video duration should be less than 10 mins.</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-yellow-500/10 text-yellow-500 px-4 py-3 rounded-lg text-sm font-medium flex items-center gap-3 mb-10 border border-warning/20">
                      <AlertCircle size={16} className="text-yellow-500" />
                      Don't have a Video! We can help you create one with our Paid Plans, Contact to Upgrade
                    </div>

                    {/* Photo Upload */}
                    <div className="mb-6">
                      <h2 className="text-2xl font-bold text-gray-900 font-['Poppins'] mb-2">
                        Add photos of your property <span className="text-gray-500 font-normal text-sm">(Optional)</span>
                      </h2>
                      <p className="text-sm text-gray-500 mb-6">A picture is worth a thousand words. 87% of buyers look at photos before buying</p>

                      <p className="text-sm font-bold text-gray-900 mb-3">Upload images</p>
                      
                      <div className="border border-secondary/40 border-dashed rounded-xl p-8 text-center bg-indigo-600/10/30 hover:bg-indigo-600/10 transition-colors cursor-pointer mb-4">
                         <div className="flex justify-center mb-3">
                           <div className="w-12 h-10 bg-indigo-600/20 rounded flex items-center justify-center -rotate-6 shadow-sm border border-white"></div>
                           <div className="w-12 h-10 bg-white rounded flex items-center justify-center rotate-6 shadow-md border border-gray-200 -ml-8">
                             <div className="w-8 h-6 bg-indigo-600/80/20 rounded-sm"></div>
                           </div>
                         </div>
                         <p className="text-indigo-600 font-semibold text-sm mb-2">+ Add atleast 5 photos</p>
                         <p className="text-xs text-gray-500 mb-1">Drag and drop your photos here</p>
                         <p className="text-[10px] text-gray-500 mb-4">Upto 50 photos • Max. size 10 MB • Formats: png, jpg, jpeg, gif, webp, heic, heif.</p>
                         <input 
                           type="file" 
                           multiple 
                           accept="image/*" 
                           className="hidden" 
                           id="photo-upload"
                           onChange={(e) => {
                             if (e.target.files) {
                               setImages(prev => [...prev, ...Array.from(e.target.files!)]);
                               setImageUrls(prev => [...prev, ...Array.from(e.target.files!).map(f => URL.createObjectURL(f))]);
                             }
                           }}
                         />
                         <label htmlFor="photo-upload" className={`border font-semibold px-6 py-2 rounded-lg text-sm transition-colors cursor-pointer inline-block ${images.length > 0 ? 'border-success text-emerald-500 bg-emerald-500/10' : 'border-secondary text-indigo-600 bg-white hover:bg-indigo-600/10'}`}>
                           {images.length > 0 ? `${images.length} Photos Selected (Click to add more)` : "Upload Photos Now"}
                         </label>
                         
                         {imageUrls.length > 0 && (
                           <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                             {imageUrls.map((url, idx) => (
                               <div key={idx} className="relative w-20 h-20 shrink-0 rounded-lg overflow-hidden border border-gray-200">
                                 <img src={url} alt="Preview" className="w-full h-full object-cover" />
                                 {idx === 0 && <span className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[10px] text-center py-0.5">Cover</span>}
                               </div>
                             ))}
                           </div>
                         )}
                      </div>

                      {/* Tooltip & Phone upload */}
                      <div className="relative mb-6">
                        <div className="bg-[#1e1e2d] text-white text-xs p-3 rounded-lg flex items-start gap-2 w-max mb-4 shadow-lg relative z-10">
                          <Lightbulb size={14} className="text-yellow-500 shrink-0 mt-0.5" />
                          <p>Add <span className="font-bold">4+ property photos</span> & increase<br/>responses upto 21%</p>
                          <div className="absolute -bottom-1.5 left-6 w-3 h-3 bg-[#1e1e2d] rotate-45"></div>
                        </div>

                        <div className="border border-gray-200 rounded-xl p-4 flex items-center gap-4 bg-white">
                          <div className="w-10 h-10 bg-indigo-600/10 rounded-lg flex items-center justify-center text-indigo-600">
                            <Smartphone size={24} />
                          </div>
                          <p className="font-bold text-gray-900 text-sm">Now you can also upload photos directly<br/>from your phone</p>
                        </div>
                      </div>

                      <p className="text-xs text-gray-500 mb-3">With your registered number +91-9223444064</p>
                      
                      <div className="space-y-3 mb-6">
                        <label className="flex items-center gap-3 border border-gray-200 rounded-xl p-4 cursor-pointer hover:bg-gray-50 w-max pr-12">
                          <input type="radio" name="phoneUpload" className="w-4 h-4 text-pink-600 focus:ring-[#FF3F6C]" />
                          <span className="text-sm text-gray-900 flex items-center gap-2">Send photos over <MessageCircle size={16} className="text-emerald-500 fill-success" /> WhatsApp</span>
                        </label>
                        <label className="flex items-center gap-3 border border-gray-200 rounded-xl p-4 cursor-pointer hover:bg-gray-50 w-max pr-12">
                          <input type="radio" name="phoneUpload" className="w-4 h-4 text-pink-600 focus:ring-[#FF3F6C]" />
                          <span className="text-sm text-gray-900">Get photo upload link over SMS</span>
                        </label>
                      </div>

                      <div className="bg-yellow-500/10/50 text-gray-900 px-4 py-3 rounded-lg text-sm font-medium flex items-center gap-3 mb-10 w-max">
                        <div className="w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold">i</div>
                        Without photos your ad will be ignored by buyers
                      </div>
                    </div>

                    {/* Video Upload */}
                    <div className="mb-6">
                      <h2 className="text-2xl font-bold text-gray-900 font-['Poppins'] mb-2">
                        Add videos of your property <span className="text-gray-500 font-normal text-sm">(Optional)</span>
                      </h2>
                      <p className="text-sm text-gray-500 mb-6">Properties with video get 40% more engagement from serious buyers</p>

                      <div className="border border-secondary/40 border-dashed rounded-xl p-8 text-center bg-indigo-600/10/30 hover:bg-indigo-600/10 transition-colors cursor-pointer mb-4">
                         <p className="text-indigo-600 font-semibold text-sm mb-2">
                           + Add 1 property video
                         </p>
                         <p className="text-xs text-gray-500 mb-1">Drag and drop your video here</p>
                         <p className="text-[10px] text-gray-500 mb-4">
                           Max size {user?.role === 'owner' ? '100' : '250'} MB • Formats: mp4, mov, webm.
                         </p>
                         <input 
                           type="file" 
                           accept="video/mp4,video/quicktime,video/webm" 
                           className="hidden" 
                           id="video-upload"
                           onChange={(e) => {
                             if (e.target.files) {
                               const maxAllowed = 1;
                               const maxSize = user?.role === 'owner' ? 100 * 1024 * 1024 : 250 * 1024 * 1024;
                               const newFiles = Array.from(e.target.files).filter(f => f.size <= maxSize);
                               
                               if (newFiles.length < e.target.files.length) {
                                 alert(`Some files were skipped because they exceed the size limit.`);
                               }
                               
                               setVideos(prev => {
                                 const combined = [...prev, ...newFiles];
                                 return combined.slice(0, maxAllowed);
                               });
                               
                               setVideoUrls(prev => {
                                 const combined = [...prev, ...newFiles.map(f => URL.createObjectURL(f))];
                                 return combined.slice(0, maxAllowed);
                               });
                             }
                           }}
                         />
                         <label htmlFor="video-upload" className={`border font-semibold px-6 py-2 rounded-lg text-sm transition-colors cursor-pointer inline-block ${videos.length > 0 ? 'border-success text-emerald-500 bg-emerald-500/10' : 'border-secondary text-indigo-600 bg-white hover:bg-indigo-600/10'}`}>
                           {videos.length > 0 ? `Video Selected` : "Upload Video Now"}
                         </label>
                         
                         {videoUrls.length > 0 && (
                           <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                             {videoUrls.map((url, idx) => (
                               <div key={idx} className="relative w-32 h-20 shrink-0 rounded-lg overflow-hidden border border-gray-200 group">
                                 <video src={url} className="w-full h-full object-cover" />
                                 <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => {
                                      setVideos(v => v.filter((_, i) => i !== idx));
                                      setVideoUrls(u => u.filter((_, i) => i !== idx));
                                    }} className="text-white text-xs bg-red-500 px-2 py-1 rounded">Remove</button>
                                 </div>
                               </div>
                             ))}
                           </div>
                         )}
                      </div>
                    </div>

                    {/* Description */}
                    <div className="mb-10">
                      <h2 className="text-xl font-bold text-gray-900 font-['Poppins'] mb-1">What makes your property unique</h2>
                      <p className="text-sm text-gray-500 mb-3">Adding description will increase your listing visibility</p>
                      <p className="text-gray-500 mb-6">Describe the property highlighting its key features (Optional)</p>
            
            <textarea
              rows={5}
              className="w-full max-w-2xl bg-white border border-gray-200 rounded-xl p-4 outline-none focus:border-pink-600 focus:ring-1 focus:ring-[#FF3F6C] transition-all font-medium resize-none"
              placeholder="A beautiful 2 BHK in the heart of the city..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <p className="text-xs text-gray-500 mt-2">If left blank, a professional description will be auto-generated based on the property details provided.</p>
                      <div className="flex justify-between items-center text-[10px] text-gray-500 mb-4 px-1">
                        <span>Minimum 30 characters required</span>
                        <span>0/5000</span>
                      </div>
                      <p className="text-sm text-indigo-600 font-medium flex items-center gap-1.5 cursor-pointer">
                        <Lightbulb size={16} className="text-indigo-600" />
                        'Need help in writing ?' <span className="font-bold hover:underline">'Yes, Write for me'</span>
                      </p>
                    </div>

                    {/* Email */}
                    <div className="mb-10">
                      <h3 className="text-base font-bold text-gray-900 mb-3">Add Email <span className="text-gray-500 font-normal text-sm italic">(Optional)</span></h3>
                      <input 
                        type="email" 
                        placeholder="Email"
                        className="w-full md:w-[300px] border border-gray-200 rounded-xl p-3 outline-none focus:border-pink-600 focus:ring-1 focus:ring-[#FF3F6C] transition-all text-sm"
                      />
                    </div>

                    {/* ===== 360° Virtual Tour (ALL ROLES) ===== */}
                    <div className="mb-10">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-xl bg-purple-600/20 flex items-center justify-center">
                          <Globe size={20} className="text-purple-600" />
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold text-gray-900 font-['Poppins']">360° Virtual Tour</h2>
                          <p className="text-xs text-purple-600 font-semibold">Optional — but highly recommended</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 mb-6">Upload equirectangular 360° panorama images. Properties with virtual tours get <span className="font-bold text-gray-900">3x more engagement</span> from serious buyers.</p>

                      {tourScenes.length === 0 ? (
                        <div
                          className="border-2 border-dashed border-accent/60 rounded-2xl p-8 text-center bg-purple-600/10/30 hover:bg-purple-600/10 transition-colors cursor-pointer mb-6"
                          onClick={() => document.getElementById('tour-upload-input')?.click()}
                          onDragOver={(e) => { e.preventDefault(); }}
                          onDrop={(e) => {
                            e.preventDefault();
                            if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                              const file = e.dataTransfer.files[0];
                              if (file.type.startsWith('image/')) {
                                handleTourUpload(file);
                              }
                            }
                          }}
                        >
                          <div className="w-16 h-16 bg-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Globe size={28} className="text-purple-600" />
                          </div>
                          <p className="text-purple-600 font-bold text-sm mb-1">Drag & drop 360° panorama image here</p>
                          <p className="text-xs text-gray-500 mb-4">or click to browse • JPG, JPEG, PNG, WebP • Max 50 MB</p>
                          <button className="border border-accent text-purple-600 font-bold px-6 py-2 rounded-xl text-sm bg-white hover:bg-purple-600/10 transition-colors">
                            <Upload size={14} className="inline mr-1.5 mb-0.5" />
                            Browse Panorama
                          </button>
                          <input
                            id="tour-upload-input"
                            type="file"
                            accept="image/jpeg,image/jpg,image/png,image/webp"
                            className="hidden"
                            onChange={(e) => {
                              if (e.target.files && e.target.files.length > 0) {
                                handleTourUpload(e.target.files[0]);
                              }
                              e.target.value = '';
                            }}
                          />
                        </div>
                      ) : (
                        <div className="space-y-3 mb-6">
                          <p className="text-sm font-bold text-gray-900 mb-3">Selected Panorama</p>
                          <div className="flex gap-4 items-center bg-white border border-accent/60 bg-purple-600/10/30 rounded-xl p-4">
                            <img src={tourScenes[0].previewUrl} alt="preview" className="w-24 h-16 object-cover rounded-lg shrink-0 border border-gray-200" />
                            <div className="flex-1 min-w-0">
                              <input
                                type="text"
                                value={tourScenes[0].title}
                                onChange={(e) => {
                                  const updated = [...tourScenes];
                                  updated[0].title = e.target.value;
                                  setTourScenes(updated);
                                }}
                                placeholder="Virtual Tour Title"
                                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-accent font-medium"
                              />
                              <p className="text-xs text-gray-500 mt-2">1 scene • {(tourScenes[0].file.size / (1024 * 1024)).toFixed(1)} MB</p>
                            </div>
                            <div className="flex flex-col gap-2 shrink-0">
                              <button
                                onClick={() => document.getElementById('tour-replace-input')?.click()}
                                className="px-3 py-1.5 bg-white border border-gray-200 text-gray-500 hover:bg-gray-50 rounded-lg text-xs font-bold transition-colors"
                              >
                                Replace
                              </button>
                              <button
                                onClick={() => setTourScenes([])}
                                className="px-3 py-1.5 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-lg text-xs font-bold transition-colors"
                              >
                                Remove
                              </button>
                              <input
                                id="tour-replace-input"
                                type="file"
                                accept="image/jpeg,image/jpg,image/png,image/webp"
                                className="hidden"
                                onChange={(e) => {
                                  if (e.target.files && e.target.files.length > 0) {
                                    handleTourUpload(e.target.files[0], true);
                                  }
                                  e.target.value = '';
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-4 border-t border-gray-200 pt-6">
                      <button 
                        onClick={() => setStep(6)}
                        className="bg-pink-600 text-white px-8 py-3 rounded-xl font-bold text-sm shadow-md hover:bg-pink-600/90 transition-all hover:-translate-y-0.5"
                      >
                        Save &amp; Continue
                      </button>
                      <button 
                        onClick={() => setStep(6)}
                        className="text-gray-500 font-semibold text-sm hover:text-gray-900 transition-colors"
                      >
                        Continue without Media
                      </button>
                    </div>
                  </div>

                  {/* Right Panel */}
                  <div className="w-[300px] hidden md:block shrink-0">
                    <div className="bg-gray-50 rounded-2xl p-8 text-center border border-gray-200">
                      <img src={getPropertyImage('tips-1')} alt="Tips" className="rounded-xl border-4 border-white shadow-sm mx-auto mb-6" />
                      <h4 className="font-bold text-gray-900 mb-6">Make your picture perfect!</h4>
                      <ul className="text-sm text-gray-500 text-left space-y-4">
                        <li className="flex gap-2"><span className="w-1.5 h-1.5 bg-gray-100 rounded-full shrink-0 mt-1.5"></span> Capture photos in landscape mode.</li>
                        <li className="flex gap-2"><span className="w-1.5 h-1.5 bg-gray-100 rounded-full shrink-0 mt-1.5"></span> Try clicking photos during the day. Avoid using flash.</li>
                        <li className="flex gap-2"><span className="w-1.5 h-1.5 bg-gray-100 rounded-full shrink-0 mt-1.5"></span> Tidy up for better impact.</li>
                        <li className="flex gap-2"><span className="w-1.5 h-1.5 bg-gray-100 rounded-full shrink-0 mt-1.5"></span> Edit with Nestify filters for finish</li>
                        <li className="flex gap-2"><span className="w-1.5 h-1.5 bg-gray-100 rounded-full shrink-0 mt-1.5"></span> To learn more <span className="text-indigo-600 cursor-pointer hover:underline">click here</span></li>
                      </ul>
                    </div>
                  </div>

                </div>
              </div>
            )}


            {step === 6 && user?.role !== 'dealer' && user?.role !== 'builder' && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="flex gap-10">
                  <div className="flex-1 space-y-10">
                    <div>
                      <button onClick={() => setStep(4)} className="text-gray-500 hover:text-gray-900 font-semibold text-sm mb-6 flex items-center gap-1 transition-colors">
                        ← Back
                      </button>
                      <h2 className="text-2xl font-bold text-gray-900 font-['Poppins'] mb-1">
                        Property Highlights
                      </h2>
                      <p className="text-sm text-gray-500 mb-6">Select key highlights of your property (Optional)</p>
                      
                      <div className="flex flex-wrap gap-3">
                        {["Corner Property", "Recently Renovated", "East Facing", "Vaastu Compliant", "Lift Available", "Security Guard", "Roof Rights", "Reserved Parking"].map(opt => (
                          <button key={opt} onClick={() => toggleArray(setSelectedHighlights, selectedHighlights, opt)} className={`px-5 py-2 rounded-full border text-sm font-medium transition-all ${selectedHighlights.includes(opt) ? 'border-pink-600 text-pink-600 bg-pink-600/5' : 'border-gray-200 text-gray-500 hover:border-pink-600 hover:text-pink-600 bg-white'}`}>+ {opt}</button>
                        ))}
                      </div>

                      {submitError && (
                        <div className="mb-4 mt-6 text-red-500 text-sm font-semibold">{submitError}</div>
                      )}
                      <button 
                        onClick={() => setStep(7)}
                        className={`px-10 py-3 rounded-xl font-bold text-base shadow-md transition-all mt-8 bg-pink-600 text-white hover:bg-pink-600/90 hover:-translate-y-0.5`}
                      >
                        Continue
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 6 && (user?.role === 'dealer' || user?.role === 'builder') && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="flex gap-10">
                  <div className="flex-1 space-y-8">
                    <button onClick={() => setStep(4)} className="text-gray-500 hover:text-gray-900 font-semibold text-sm mb-6 flex items-center gap-1 transition-colors">
                      ← Back
                    </button>
                    <h2 className="text-2xl font-bold text-gray-900 font-['Poppins'] mb-1">
                      Project Information
                    </h2>
                    <p className="text-sm text-gray-500 mb-6">Provide details about the overarching project.</p>
                    
                    <div className="space-y-4 mb-6">
                      <input type="text" placeholder="Project Name *" value={projectName} onChange={e => setProjectName(e.target.value)} className="w-full border border-gray-200 rounded-xl p-3.5 outline-none focus:border-pink-600 focus:ring-1 focus:ring-[#FF3F6C]" />
                      <input type="text" placeholder="Marketing Tagline (Optional)" value={marketingTagline} onChange={e => setMarketingTagline(e.target.value)} className="w-full border border-gray-200 rounded-xl p-3.5 outline-none focus:border-pink-600 focus:ring-1 focus:ring-[#FF3F6C]" />
                    </div>
                    <button 
                        onClick={() => {
                          if(!projectName) setSubmitError("Project Name is required");
                          else { setSubmitError(""); setStep(7); }
                        }}
                        className="bg-pink-600 text-white px-8 py-3 rounded-xl font-bold text-sm shadow-md hover:bg-pink-600/90"
                      >
                        Save & Continue
                      </button>
                      {submitError && <div className="text-red-500 text-sm">{submitError}</div>}
                    </div>
                  </div>
                </div>
            )}

            {step === 7 && (user?.role === 'dealer' || user?.role === 'builder') && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="flex gap-10">
                  <div className="flex-1 space-y-8">
                    <button onClick={() => setStep(6)} className="text-gray-500 hover:text-gray-900 font-semibold text-sm mb-6 flex items-center gap-1 transition-colors">
                      ← Back
                    </button>
                    <h2 className="text-2xl font-bold text-gray-900 font-['Poppins'] mb-1">
                      Amenities
                    </h2>
                    <p className="text-sm text-gray-500 mb-6">Select available project amenities.</p>
                    
                    <div className="flex flex-wrap gap-3">
                      {dbAmenities.map(a => (
                        <button key={a.name} onClick={() => toggleArray(setSelectedAmenities, selectedAmenities, a.name)} className={`px-5 py-2 rounded-full border text-sm font-medium transition-all ${selectedAmenities.includes(a.name) ? 'border-pink-600 text-pink-600 bg-pink-600/5' : 'border-gray-200 text-gray-500 hover:border-pink-600 hover:text-pink-600 bg-white'}`}>+ {a.name}</button>
                      ))}
                      {dbAmenities.length === 0 && <p className="text-sm text-gray-500">Loading amenities from database...</p>}
                    </div>

                    <button 
                      onClick={() => setStep(8)}
                      className="bg-pink-600 text-white px-8 py-3 rounded-xl font-bold text-sm shadow-md hover:bg-pink-600/90"
                    >
                      Save &amp; Continue
                    </button>
                  </div>
                </div>
              </div>
            )}

            {step === 8 && (user?.role === 'dealer' || user?.role === 'builder') && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="flex gap-10">
                  <div className="flex-1 space-y-8">
                    <button onClick={() => setStep(7)} className="text-gray-500 hover:text-gray-900 font-semibold text-sm mb-6 flex items-center gap-1 transition-colors">
                      ← Back
                    </button>
                    <h2 className="text-2xl font-bold text-gray-900 font-['Poppins'] mb-1">
                      Location Advantages
                    </h2>
                    <p className="text-sm text-gray-500 mb-6">Highlight nearby landmarks.</p>
                    
                    <div className="flex flex-wrap gap-3">
                      {["City Hospital", "Metro Station", "International School", "Shopping Mall", "Highway Access"].map(opt => (
                        <button key={opt} onClick={() => toggleArray(setSelectedLocationAdvantages, selectedLocationAdvantages, opt)} className={`px-5 py-2 rounded-full border text-sm font-medium transition-all ${selectedLocationAdvantages.includes(opt) ? 'border-pink-600 text-pink-600 bg-pink-600/5' : 'border-gray-200 text-gray-500 hover:border-pink-600 hover:text-pink-600 bg-white'}`}>+ {opt}</button>
                      ))}
                    </div>

                    <button 
                      onClick={() => setStep(9)}
                      className="bg-pink-600 text-white px-8 py-3 rounded-xl font-bold text-sm shadow-md hover:bg-pink-600/90"
                    >
                      Save &amp; Continue
                    </button>
                  </div>
                </div>
              </div>
            )}

            {step === 9 && (user?.role === 'dealer' || user?.role === 'builder') && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="flex gap-10">
                  <div className="flex-1 space-y-8">
                    <button onClick={() => setStep(8)} className="text-gray-500 hover:text-gray-900 font-semibold text-sm mb-6 flex items-center gap-1 transition-colors">
                      ← Back
                    </button>
                    <h2 className="text-2xl font-bold text-gray-900 font-['Poppins'] mb-1">
                      Marketing Highlights
                    </h2>
                    <p className="text-sm text-gray-500 mb-6">Key selling points.</p>
                    
                    <div className="flex flex-wrap gap-3">
                      {["Premium Construction", "Green Building Certified", "Luxury Specifications", "Smart Home Ready", "Panoramic Views"].map(opt => (
                        <button key={opt} onClick={() => toggleArray(setSelectedHighlights, selectedHighlights, opt)} className={`px-5 py-2 rounded-full border text-sm font-medium transition-all ${selectedHighlights.includes(opt) ? 'border-pink-600 text-pink-600 bg-pink-600/5' : 'border-gray-200 text-gray-500 hover:border-pink-600 hover:text-pink-600 bg-white'}`}>+ {opt}</button>
                      ))}
                    </div>

                    {submitError && (
                      <div className="mb-4 text-red-500 text-sm font-semibold">{submitError}</div>
                    )}
                    <button 
                      onClick={() => setStep(10)}
                      className={`px-10 py-3 rounded-xl font-bold text-base shadow-md transition-all mt-8 bg-pink-600 text-white hover:bg-pink-600/90 hover:-translate-y-0.5`}
                    >
                      Continue
                    </button>
                  </div>

                  {/* Right Panel */}
                  <div className="w-[300px] hidden md:block shrink-0">
                    <div className="bg-gray-50 rounded-2xl p-8 text-center border border-gray-200 mb-6">
                      <div className="w-24 h-24 bg-yellow-500/20/50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <img src={getPropertyImage('clipboard-1')} alt="Clipboard" className="rounded-full object-cover w-16 h-16" />
                      </div>
                      <p className="text-sm text-gray-500 mb-4 leading-relaxed">
                        These are the features that buyers look for. Highlighting them attracts more responses.
                      </p>
                      <div className="text-left bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                        <p className="text-xs text-gray-500 font-medium flex items-center gap-1.5 mb-2"><Phone size={12} className="text-gray-500" /> Need help?</p>
                        <p className="text-[10px] text-gray-500 leading-relaxed">
                          You can email us at <span className="text-indigo-600">services@nestify.com</span><br/>or call us at <span className="text-indigo-600 font-bold">1800 41 99099</span> (IND Toll-Free).
                        </p>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-2xl p-6 text-left border border-gray-200">
                      <p className="text-sm font-bold text-gray-500 mb-2">Privacy note for listing</p>
                      <p className="text-[10px] text-gray-500 leading-relaxed">
                        For maximum reach, listings become visible to all users, including unregistered visitors to our platform on posting here
                      </p>
                    </div>
                  </div>

                </div>
              </div>
            )}

            {((!isDealerUser && step === 7) || (isDealerUser && step === 10)) && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="flex gap-10">
                  <div className="flex-1 space-y-8">
                    <button onClick={() => setStep(isDealerUser ? 9 : 6)} className="text-gray-500 hover:text-gray-900 font-semibold text-sm mb-6 flex items-center gap-1 transition-colors">
                      ← Back
                    </button>
                    <h2 className="text-2xl font-bold text-gray-900 font-['Poppins'] mb-1">
                      Boost Your Listing with Premium Services
                    </h2>
                    <p className="text-sm text-gray-500 mb-6">Select optional add-on services to get up to 5x more visibility and faster responses.</p>
                    
                    <div className="space-y-4">
                      {availableAddons.length === 0 ? (
                        <div className="text-center p-8 bg-gray-50 rounded-xl border border-gray-200">
                          <p className="text-gray-500 text-sm">No premium services available at the moment.</p>
                        </div>
                      ) : (
                        availableAddons.map(addon => {
                          const isSelected = selectedAddonIds.includes(addon.id);
                          
                          return (
                            <div 
                              key={addon.id} 
                              onClick={() => toggleArray(setSelectedAddonIds, selectedAddonIds, addon.id)}
                              className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex gap-5 ${
                                isSelected ? 'border-pink-600 bg-pink-600/5 shadow-sm' : 'border-gray-200 hover:border-gray-200 bg-white'
                              }`}
                            >
                              <div className="w-16 h-16 rounded-xl bg-white border border-gray-200 overflow-hidden shrink-0 flex items-center justify-center">
                                {addon.image_url ? (
                                  <img src={addon.image_url} alt={addon.name} className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-8 h-8 bg-gray-50 rounded-full"></div>
                                )}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-start justify-between">
                                  <div>
                                    <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                      {addon.name}
                                      {addon.is_featured && <span className="bg-yellow-500/20 text-yellow-500 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Featured</span>}
                                    </h3>
                                    <p className="text-sm text-gray-500 mt-1">{addon.short_description}</p>
                                  </div>
                                  <div className="text-right shrink-0">
                                    <p className="font-bold text-gray-900">₹{addon.base_price.toLocaleString()}</p>
                                    <p className="text-[10px] text-gray-500">+{addon.tax_percentage}% GST</p>
                                  </div>
                                </div>
                              </div>
                              <div className="shrink-0 flex items-center justify-center w-6">
                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                                  isSelected ? "border-pink-600 bg-pink-600" : "border-gray-200"
                                }`}>
                                  {isSelected && <Check size={14} className="text-white" />}
                                </div>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>

                    {submitError && (
                      <div className="mb-4 text-red-500 text-sm font-semibold">{submitError}</div>
                    )}
                    <button 
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className={`w-full py-4 rounded-xl font-bold text-base shadow-md transition-all mt-8 ${isSubmitting ? 'bg-gray-100 cursor-not-allowed text-white' : 'bg-pink-600 text-white hover:bg-pink-600/90 hover:-translate-y-0.5'}`}
                    >
                      {isSubmitting ? "Submitting..." : (selectedAddonIds.length > 0 ? "Pay & Submit Property" : "Skip & Submit Property")}
                    </button>
                  </div>

                  {/* Right Panel - Order Summary */}
                  <div className="w-[300px] hidden md:block shrink-0">
                    <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xl shadow-gray-100/50 sticky top-24">
                      <h3 className="font-bold text-gray-900 mb-4">Order Summary</h3>
                      
                      <div className="space-y-3 mb-6 pb-6 border-b border-gray-200 text-sm">
                        <div className="flex justify-between text-gray-500">
                          <span>Listing Fee</span>
                          <span className="font-medium">Free</span>
                        </div>
                        
                        {selectedAddonIds.map(id => {
                          const addon = availableAddons.find(a => a.id === id);
                          if (!addon) return null;
                          return (
                            <div key={id} className="flex justify-between text-gray-500">
                              <span className="truncate pr-4">{addon.name}</span>
                              <span className="font-medium">₹{addon.base_price.toLocaleString()}</span>
                            </div>
                          );
                        })}

                        {selectedAddonIds.length > 0 && (
                          <div className="flex justify-between text-gray-500 text-xs">
                            <span>Estimated GST</span>
                            <span>
                              ₹{Math.round(selectedAddonIds.reduce((sum, id) => {
                                const addon = availableAddons.find(a => a.id === id);
                                return sum + (addon ? addon.base_price * addon.tax_percentage / 100 : 0);
                              }, 0)).toLocaleString()}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex justify-between items-center mb-6">
                        <span className="font-bold text-gray-900">Total Amount</span>
                        <span className="text-xl font-extrabold text-pink-600">
                          ₹{Math.round(selectedAddonIds.reduce((sum, id) => {
                            const addon = availableAddons.find(a => a.id === id);
                            if (!addon) return sum;
                            return sum + addon.base_price + (addon.base_price * addon.tax_percentage / 100);
                          }, 0)).toLocaleString()}
                        </span>
                      </div>

                      <div className="bg-emerald-500/10 rounded-xl p-3 border border-success/20 flex gap-3">
                        <Check className="text-emerald-500 shrink-0" size={16} />
                        <p className="text-xs text-emerald-500 leading-relaxed font-medium">Secure checkout powered by Nestify Payments. GST invoice will be generated.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen pt-28 pb-20">
      <div className="max-w-6xl mx-auto px-6 flex flex-col lg:flex-row gap-12 items-center lg:items-start justify-center">
        
        {/* LEFT SIDE: Copy & Image */}
        <div className="flex-1 lg:max-w-lg mt-10">
          <h1 className="text-4xl font-extrabold text-gray-900 font-['Poppins'] leading-tight mb-4">
            Sell or Rent Property <br/>
            <span className="text-pink-600">online faster</span> with Nestify
          </h1>
          
          <div className="space-y-4 mb-10 mt-8">
            {[
              "Advertise for FREE",
              "Get unlimited enquiries",
              "Get shortlisted buyers and tenants *",
              "Assistance in co-ordinating site visits *"
            ].map((text, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                  <Check size={12} className="text-emerald-500 stroke-[3]" />
                </div>
                <span className="text-gray-900 font-medium text-lg">{text}</span>
              </div>
            ))}
          </div>

          <div className="relative rounded-2xl overflow-hidden shadow-2xl mt-12 group">
            <img 
              src={getPropertyImage('tips-2')} 
              alt="Property Posting" 
              className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <h3 className="text-xl font-bold font-['Poppins'] mb-1">Over 10,000+ owners trust us</h3>
              <p className="text-white/80 text-sm">Post your property today and close deals within weeks.</p>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: Form Card */}
        <div className="w-full lg:w-[480px] shrink-0">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 font-['Poppins'] mb-6">
              Start posting your property, it's free
            </h2>
            
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Add Basic Details</p>
            
            {/* Looking to... */}
            <div className="mb-6">
              <p className="text-sm font-semibold text-gray-900 mb-3">You're looking to ...</p>
              <div className="flex flex-wrap gap-3">
                {lookingToOptions.map(opt => (
                  <button
                    key={opt}
                    onClick={() => setLookingTo(opt)}
                    className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                      lookingTo === opt 
                        ? "bg-pink-600/10 text-pink-600 border-2 border-pink-600" 
                        : "bg-white text-gray-500 border border-gray-200 hover:border-gray-200"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* And it's a... */}
            <div className="mb-6">
              <p className="text-sm font-semibold text-gray-900 mb-3">And it's a ...</p>
              <div className="flex gap-6 mb-4">
                {["Residential", "Commercial"].map(cat => (
                  <label key={cat} className="flex items-center gap-2 cursor-pointer group">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                      category === cat ? "border-pink-600" : "border-gray-200 group-hover:border-gray-300"
                    }`}>
                      {category === cat && <div className="w-2.5 h-2.5 bg-pink-600 rounded-full" />}
                    </div>
                    <span className="text-sm text-gray-900">{cat}</span>
                    <input 
                      type="radio" 
                      name="category" 
                      value={cat} 
                      checked={category === cat}
                      onChange={() => { setCategory(cat); setPropType(""); }}
                      className="hidden" 
                    />
                  </label>
                ))}
              </div>

              {/* Property Type Pills */}
              <div className="flex flex-wrap gap-2.5">
                {currentOptions.map(opt => (
                  <button
                    key={opt}
                    onClick={() => setPropType(opt)}
                    className={`px-4 py-1.5 rounded-full text-xs transition-all border ${
                      propType === opt 
                        ? "bg-gray-50 text-gray-900 border-gray-300 font-semibold" 
                        : "bg-white text-gray-500 border-gray-200 hover:border-gray-200"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>



            <button 
              onClick={() => setStarted(true)}
              className="w-full bg-pink-600 text-white py-3.5 rounded-xl font-bold text-base shadow-md shadow-[#FF3F6C]/20 hover:bg-pink-600/90 hover:-translate-y-0.5 hover:shadow-lg transition-all"
            >
              Start now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
