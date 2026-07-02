import { supabase } from '@/lib/supabase';
import { getPropertyImage } from '@/utils/propertyImages';
import { DetailedProperty } from '@/types';

export interface PropertyFilters {
  query?: string; // Text search for city, locality, project_name
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  amenities?: string[];
  furnishing?: string[];
  propertyAge?: string[];
  possessionStatus?: string[];
  ownershipType?: string[];
  propertyType?: string[];
  bhk?: number[];
  postedByRole?: string[];
  hasVideos?: boolean;
  hasImages?: boolean;
  hasVirtualTour?: boolean;
  sortBy?: string; // new, price_asc, price_desc, area_desc
}

export interface PopularLocality {
  id: number;
  name: string;
  city: string;
  propertiesCount: number;
  yoy: string;
}

export interface PropertyVideo {
  id: string;
  video_url: string;
  thumbnail_url?: string;
  title?: string;
  duration_seconds?: number;
  file_size_mb?: number;
  is_primary?: boolean;
}

export interface UIProperty {
  id: string;
  title: string;
  price: string | number;
  city: string;
  image: string;
  ownerName: string;
  description?: string;
  status?: string;
  createdAt?: string;
  propertyType?: string;
  bhk?: number;
  areaSqft?: number;
  furnishing?: string;
  ownershipType?: string;
  postedByRole?: string;
  projectName?: string;
  amenities?: string[];
  videos?: PropertyVideo[];
  property_images?: any[]; // To preserve total image count if needed
  hasVirtualTour?: boolean; // True if property has 360° tour scenes
  virtualToursCount?: number; // Number of interactive scenes available
  lat?: number;
  lng?: number;
  locality?: string;
  priceNum?: number;
  type?: string;
  badge?: string;
  possession?: string;
}

export const propertyService = {
  /**
   * Fetches properties with optional filters and pagination
   * @param filters City, minPrice, maxPrice
   * @param page Page number (1-indexed)
   * @param limit Items per page (default 10)
   */
  async getAllPropertiesRaw(filters: PropertyFilters = {}, page: number = 1, limit: number = 10) {
    const start = (page - 1) * limit;
    const end = start + limit - 1;

    let selectString = `
      id,
      title,
      description,
      price,
      city,
      status,
      created_at,
      property_type,
      bhk,
      area_sqft,
      furnishing,
      ownership_type,
      posted_by_role,
      project_name,
      amenities,

      owner:users!properties_owner_id_fkey (
        id,
        name,
        email
      ),

      property_images (
        url
      ),

      property_videos (
        id,
        video_url,
        thumbnail_url,
        title,
        duration_seconds,
        file_size_mb,
        is_primary
      ),

      property_virtual_tours (
        id
      ),

      locations (
        lat,
        lng,
        locality,
        city
      )
    `;

    if (filters.amenities && filters.amenities.length > 0) {
      selectString += `, property_amenities!inner ( amenities!inner ( name ) )`;
    }

    let query = supabase
      .from('properties')
      .select(selectString)
      .eq('status', 'approved')
    if (filters.query && filters.query.trim() !== '') {
      // Full text search equivalent using OR conditions on multiple columns
      query = query.or(`city.ilike.%${filters.query.trim()}%,title.ilike.%${filters.query.trim()}%,project_name.ilike.%${filters.query.trim()}%`);
    }

    if (filters.city && filters.city.trim() !== '') {
      query = query.ilike('city', `%${filters.city.trim()}%`);
    }
    if (filters.minPrice !== undefined) {
      query = query.gte('price', filters.minPrice);
    }
    if (filters.maxPrice !== undefined) {
      query = query.lte('price', filters.maxPrice);
    }
    if (filters.furnishing && filters.furnishing.length > 0) {
      query = query.in('furnishing', filters.furnishing);
    }
    if (filters.propertyAge && filters.propertyAge.length > 0) {
      query = query.in('property_age', filters.propertyAge);
    }
    if (filters.possessionStatus && filters.possessionStatus.length > 0) {
      query = query.in('possession_status', filters.possessionStatus);
    }
    if (filters.ownershipType && filters.ownershipType.length > 0) {
      query = query.in('ownership_type', filters.ownershipType);
    }
    if (filters.propertyType && filters.propertyType.length > 0) {
      query = query.in('property_type', filters.propertyType);
    }
    if (filters.bhk && filters.bhk.length > 0) {
      query = query.in('bhk', filters.bhk);
    }
    if (filters.postedByRole && filters.postedByRole.length > 0) {
      query = query.in('posted_by_role', filters.postedByRole);
    }
    if (filters.amenities && filters.amenities.length > 0) {
      query = query.in('property_amenities.amenities.name', filters.amenities);
    }
    if (filters.hasVideos) {
      query = query.not('property_videos', 'is', null);
    }
    if (filters.hasImages) {
      query = query.not('property_images', 'is', null);
    }
    if (filters.hasVirtualTour) {
      query = query.not('property_virtual_tours', 'is', null);
    }

    // Apply Sorting
    if (filters.sortBy === 'price_asc') {
      query = query.order('price', { ascending: true });
    } else if (filters.sortBy === 'price_desc') {
      query = query.order('price', { ascending: false });
    } else if (filters.sortBy === 'area_desc') {
      query = query.order('area_sqft', { ascending: false });
    } else {
      query = query.order('created_at', { ascending: false });
    }

    query = query.range(start, end);

    return await query;
  },

  /**
   * Fetches dynamic filter options
   */
  async getFilterOptions() {
    const { data: amenities } = await supabase.from('amenities').select('name');
    
    // For distinct values, normally we'd use a dedicated RPC or distinct query.
    // As a fallback for demonstration, we return some static merged with dynamic.
    return {
      amenities: amenities?.map(a => a.name) || [],
    };
  },

  /**
   * Fetches search suggestions for autocomplete
   */
  async getSearchSuggestions(queryText: string) {
    if (!queryText || queryText.length < 2) return [];
    
    const { data } = await supabase
      .from('properties')
      .select('city, title, project_name')
      .or(`city.ilike.%${queryText}%,title.ilike.%${queryText}%,project_name.ilike.%${queryText}%`)
      .limit(5);
      
    if (!data) return [];
    
    const suggestions = new Set<string>();
    data.forEach(item => {
      if (item.city?.toLowerCase().includes(queryText.toLowerCase())) suggestions.add(item.city);
      if (item.title?.toLowerCase().includes(queryText.toLowerCase())) suggestions.add(item.title);
      if (item.project_name?.toLowerCase().includes(queryText.toLowerCase())) suggestions.add(item.project_name);
    });
    
    return Array.from(suggestions);
  },

  mapProperties(data: any[]): UIProperty[] {
    return (data || []).map((property: any) => ({
      id: property.id,
      title: property.title || 'Untitled Property',
      price: property.price ? `₹${Number(property.price).toLocaleString('en-IN')}` : 'N/A',
      city: property.city || 'Unknown Location',
      image: property.property_images?.[0]?.url || getPropertyImage(property.id),
      ownerName: (Array.isArray(property.owner) ? property.owner[0]?.name : property.owner?.name) || 'Unknown',
      description: property.description,
      status: property.status,
      createdAt: property.created_at,
      propertyType: property.property_type,
      bhk: property.bhk,
      areaSqft: property.area_sqft,
      furnishing: property.furnishing,
      ownershipType: property.ownership_type,
      postedByRole: property.posted_by_role,
      projectName: property.project_name,
      amenities: property.amenities,
      videos: property.property_videos || [],
      property_images: property.property_images || [],
      hasVirtualTour: (property.property_virtual_tours?.length ?? 0) > 0,
      virtualToursCount: property.property_virtual_tours?.length ?? 0,
      lat: Array.isArray(property.locations) ? property.locations[0]?.lat : property.locations?.lat,
      lng: Array.isArray(property.locations) ? property.locations[0]?.lng : property.locations?.lng,
      locality: Array.isArray(property.locations) ? property.locations[0]?.locality : property.locations?.locality,
    }));
  },

  async getAllProperties(filters: PropertyFilters = {}, page: number = 1, limit: number = 10): Promise<UIProperty[]> {
    const { data, error } = await this.getAllPropertiesRaw(filters, page, limit);
    if (error) {
      console.error('Supabase Error:', error);
      return [];
    }
    return this.mapProperties(data);
  },

  // --- Saved Properties Methods ---
  
  async saveProperty(userId: string, propertyId: string) {
    if (!userId || !propertyId) return { error: new Error('Invalid IDs') };
    const { error } = await supabase
      .from('saved_properties')
      .insert({ user_id: userId, property_id: propertyId });
    if (error) console.error('Error saving property:', error);
    return { error };
  },

  async unsaveProperty(userId: string, propertyId: string) {
    if (!userId || !propertyId) return { error: new Error('Invalid IDs') };
    const { error } = await supabase
      .from('saved_properties')
      .delete()
      .match({ user_id: userId, property_id: propertyId });
    if (error) console.error('Error unsaving property:', error);
    return { error };
  },

  async checkIfSaved(userId: string, propertyId: string) {
    if (!userId || !propertyId) return false;
    const { data, error } = await supabase
      .from('saved_properties')
      .select('id')
      .match({ user_id: userId, property_id: propertyId })
      .maybeSingle();
    return !!data && !error;
  },

  async getSavedProperties(userId: string): Promise<UIProperty[]> {
    if (!userId) return [];
    const { data, error } = await supabase
      .from('saved_properties')
      .select(`
        property_id,
        properties (
          id,
          title,
          description,
          price,
          city,
          status,
          created_at,
          property_type,
          bhk,
          area_sqft,
          furnishing,
          ownership_type,
          posted_by_role,
          project_name,
          amenities,
          owner:users!properties_owner_id_fkey (
            id,
            name,
            email
          ),
          property_images (
            url
          )
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching saved properties:', error);
      return [];
    }

    const properties = (data || [])
      .map((item: any) => item.properties)
      .filter(Boolean);

    return this.mapProperties(properties);
  },

  generatePropertyDescription(property: any): string {
    const bhkText = property.bhk ? `${property.bhk} BHK` : '';
    const areaText = property.areaSqft ? `${property.areaSqft} sq.ft` : '';
    const typeText = property.propertyType || 'property';
    const locText = property.city || 'the city';
    const furnishText = property.furnishing ? property.furnishing.replace('_', ' ') : 'unfurnished';

    if (property.postedByRole === 'owner') {
      return `This well-maintained ${bhkText} ${typeText} is available for sale directly by the owner in ${locText}. The property offers a practical built-up area of ${areaText} and comes with ${furnishText} interiors. With essential amenities nearby, this is perfectly suited for families looking for a comfortable residence in a well-connected location.

Contact directly for a transparent and straightforward deal.`;
    } else {
      const projText = property.projectName ? ` in the premium residential development, ${property.projectName}` : '';
      return `Presenting an exceptional ${bhkText} ${typeText}${projText}, strategically located in ${locText}. Designed with modern aesthetics, it features an expansive layout spanning ${areaText} with premium ${furnishText} interiors. 

Residents will enjoy world-class amenities, robust infrastructure, and seamless connectivity to prime city hubs. This property ensures an elevated lifestyle and high investment value. Contact us to schedule a comprehensive site visit today.`;
    }
  },

  /**
   * Helper to fetch a single property details
   */
  async getPropertyById(id: string): Promise<DetailedProperty> {
    const { data, error } = await supabase
      .from('properties')
      .select(`
        *,
        owner:users!properties_owner_id_fkey (
          id, name, email, role
        ),
        property_images ( id, url ),
        property_videos ( id, video_url, thumbnail_url, title, duration_seconds, file_size_mb, is_primary ),
        property_virtual_tours ( id, panorama_url, thumbnail_url, title, description, sort_order, is_default ),
        property_amenities ( amenities ( id, name, icon_name ) ),
        locations ( city, locality, address, state, pincode, lat, lng ),
        project_details ( id, project_name, builder_name, launch_year, possession_date, total_units, project_area, rera_number, marketing_tagline, description ),
        location_advantages ( id, name, distance, type ),
        property_highlights ( id, title, value ),
        property_addon_orders ( id, payment_status, order_status, addon:addon_services(*) )
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Supabase Error:', error);
      throw error;
    }

    const sellerInfo = Array.isArray(data.owner) ? data.owner[0] : data.owner;
    const loc = Array.isArray(data.locations) ? data.locations[0] : data.locations;
    const proj = Array.isArray(data.project_details) ? data.project_details[0] : data.project_details;

    const rawProperty = {
      ...data,
      bhk: data.bhk,
      areaSqft: data.area_sqft,
      propertyType: data.property_type,
      postedByRole: data.posted_by_role || (sellerInfo?.role) || 'owner',
      city: loc?.city || data.city,
      projectName: proj?.name || data.project_name
    };

    return {
      id: data.id,
      title: data.title || 'Untitled Property',
      price: data.price_display || (data.price_num ? `₹${(data.price_num/100000).toFixed(1)} Lacs` : (data.price ? `₹${(data.price/100000).toFixed(1)} Lacs` : 'N/A')),
      priceNum: data.price_num || data.price || 0,
      location: loc ? `${loc.locality}, ${loc.city}` : (data.city || 'Unknown'),
      area: data.area_sqft ? `${data.area_sqft} sq.ft.` : '',
      carpetArea: data.carpet_area,
      builtUpArea: data.built_up_area,
      superBuiltUpArea: data.super_built_up_area,
      bhk: data.bhk || 0,
      type: data.property_type || 'apartment',
      badge: 'Verified',
      builder: proj?.builder_name || data.project_builder || 'Unknown Builder',
      description: data.description || this.generatePropertyDescription(rawProperty),
      floor: data.floor_number?.toString() || '',
      totalFloors: data.total_floors || 0,
      facing: data.facing || '',
      possession: data.possession_status || '',
      rating: 4.5,
      propertyAge: data.property_age || '',
      ownershipType: data.ownership_type || 'Freehold',
      furnishing: data.furnishing || 'Unfurnished',
      bathrooms: data.bathrooms || 0,
      balconies: data.balconies || 0,
      createdAt: data.created_at,
      updatedAt: data.updated_at || data.created_at,

      images: data.property_images?.length > 0 ? data.property_images.map((img: any) => ({
        id: img.id,
        url: img.url
      })) : [
        {
          id: `default-img-1-${data.id}`,
          url: getPropertyImage(`${data.id}-1`)
        },
        {
          id: `default-img-2-${data.id}`,
          url: getPropertyImage(`${data.id}-2`)
        },
        {
          id: `default-img-3-${data.id}`,
          url: getPropertyImage(`${data.id}-3`)
        }
      ],
      amenities: (data.property_amenities || []).map((pa: any) => ({
        id: pa.amenities.id,
        name: pa.amenities.name,
        iconName: pa.amenities.icon_name || 'CheckCircle'
      })),
      seller: {
        id: sellerInfo?.id || '',
        name: sellerInfo?.name || 'Owner',
        phone: '+91 9876543210',
        joinedDate: '2023',
        propertiesListed: 1,
        role: data.posted_by_role || (sellerInfo?.role) || 'owner'
      },
      videos: data.property_videos || [],
      virtualTours: (data.property_virtual_tours || []).map((t: any) => ({
        id: t.id,
        property_id: data.id,
        panorama_url: t.panorama_url,
        thumbnail_url: t.thumbnail_url || null,
        title: t.title || 'Virtual Tour',
        description: t.description || null,
        sort_order: t.sort_order ?? 0,
        is_default: t.is_default ?? false,
      })),
      locationDetails: {
        city: loc?.city || data.city || '',
        locality: loc?.locality || '',
        address: loc?.address || '',
        state: loc?.state,
        pincode: loc?.pincode,
        coordinates: { 
          lat: loc?.lat != null ? loc.lat : 18.5204, 
          lng: loc?.lng != null ? loc.lng : 73.8567 
        },
        advantages: data.location_advantages || []
      },
      projectDetails: proj ? {
        id: proj.id,
        projectName: proj.project_name,
        builderName: proj.builder_name,
        launchYear: proj.launch_year || proj.possession_date,
        totalUnits: proj.total_units || 0,
        projectArea: proj.project_area || '',
        reraNumber: proj.rera_number,
        marketingTagline: proj.marketing_tagline,
        description: proj.description
      } : undefined,
      highlights: (data.property_highlights || []).map((hl: any) => ({
        id: hl.id,
        title: hl.title,
        value: hl.value
      })),
      maintenanceCharges: data.maintenance_charges || undefined,
      addonOrders: data.property_addon_orders || []
    };
  },

  /**
   * Atomicsly create a property with all related tables.
   * If any step fails, manually roll back the property insertion to ensure no partial data.
   */
  async createProperty(payload: any) {
    let createdPropertyId: string | null = null;
    try {
      // 1. Insert Base Property
      const { data: newProp, error: propError } = await supabase
        .from('properties')
        .insert({
          owner_id: payload.owner_id,
          title: payload.title,
          description: payload.description || `Beautiful ${payload.bhk ? payload.bhk + ' BHK ' : ''}${payload.property_type || 'Property'} located in ${payload.city || 'your city'}.`,
          city: payload.city,
          price: payload.price,
          price_num: payload.price_num,
          price_display: payload.price_display,
          status: payload.status || 'pending',
          type: payload.property_type?.toLowerCase().includes('apartment') || payload.property_type?.toLowerCase().includes('flat') ? 'apartment' : 
                payload.property_type?.toLowerCase().includes('villa') || payload.property_type?.toLowerCase().includes('house') ? 'villa' :
                payload.property_type?.toLowerCase().includes('penthouse') ? 'penthouse' : 'apartment',
          property_type: payload.property_type,
          bhk: payload.bhk,
          area_sqft: payload.area_sqft || payload.built_up_area || payload.carpet_area || payload.super_built_up_area || 0,
          furnishing: payload.furnishing,
          ownership: payload.ownership_type,
          ownership_type: payload.ownership_type,
          posted_by_role: payload.posted_by_role,
          floor_number: payload.floor_number,
          total_floors: payload.total_floors,
          facing: payload.facing,
          possession_status: payload.possession_status,
          property_age: payload.property_age,
          balconies: payload.balconies,
          maintenance_charges: payload.maintenance_charges,
          carpet_area: payload.carpet_area,
          built_up_area: payload.built_up_area,
          super_built_up_area: payload.super_built_up_area,
          bathrooms: payload.bathrooms,
        })
        .select()
        .single();

      if (propError) throw propError;
      createdPropertyId = newProp.id;

      // 1.5 Insert Location
      if (payload.locality || payload.city || payload.address) {
        const { error: locError } = await supabase
          .from('locations')
          .insert({
            property_id: createdPropertyId,
            city: payload.city,
            locality: payload.locality,
            address: payload.address,
            state: payload.state,
            pincode: payload.pincode,
            lat: payload.lat,
            lng: payload.lng
          });
        if (locError) throw locError;
      }

      // 2. Insert Images
      if (payload.images && payload.images.length > 0) {
        const imageInserts = payload.images.map((img: any, index: number) => ({
          property_id: createdPropertyId,
          url: img.url,
          is_floor_plan: false,
          sort_order: index
        }));
        const { error: imgError } = await supabase
          .from('property_images')
          .insert(imageInserts);
        if (imgError) throw imgError;
      }

      // 3. Insert Videos
      if (payload.videos && payload.videos.length > 0) {
        const videoInserts = payload.videos.map((vid: any, index: number) => ({
          property_id: createdPropertyId,
          video_url: vid.url,
          title: vid.title,
          is_primary: index === (payload.primaryVideoIndex || 0),
          sort_order: index,
          duration_seconds: null,
          file_size_mb: vid.size ? (vid.size / (1024 * 1024)) : null,
        }));
        const { error: vidError } = await supabase
          .from('property_videos')
          .insert(videoInserts);
        if (vidError) throw vidError;
      }

      // 4. Insert Amenities (if provided)
      if (payload.amenity_ids && payload.amenity_ids.length > 0) {
        const amenityInserts = payload.amenity_ids.map((amenity_id: string) => ({
          property_id: createdPropertyId,
          amenity_id
        }));
        const { error: amenityError } = await supabase
          .from('property_amenities')
          .insert(amenityInserts);
        if (amenityError) throw amenityError;
      }

      // 4. Insert Dealer-Specific Details
      if (payload.posted_by_role === 'dealer' || payload.posted_by_role === 'builder') {
        // Project Details
        if (payload.project_details) {
          const { error: projError } = await supabase
            .from('project_details')
            .insert({
              property_id: createdPropertyId,
              project_name: payload.project_details.project_name,
              builder_name: payload.project_details.builder_name,
              launch_year: payload.project_details.launch_year,
              possession_date: payload.project_details.possession_date,
              total_units: payload.project_details.total_units,
              project_area: payload.project_details.project_area,
              rera_number: payload.project_details.rera_number,
              marketing_tagline: payload.project_details.marketing_tagline,
              description: payload.project_details.description
            });
          if (projError) throw projError;
        }

        // Location Advantages
        if (payload.location_advantages && payload.location_advantages.length > 0) {
          // Helper function for location mapping
          const getAdvantageType = (name: string) => {
            const n = name.toLowerCase();
            if (n.includes('school') || n.includes('college') || n.includes('university') || n.includes('education')) return 'school';
            if (n.includes('hospital') || n.includes('clinic') || n.includes('medical')) return 'hospital';
            if (n.includes('metro') || n.includes('station') || n.includes('railway') || n.includes('train')) return 'metro';
            if (n.includes('airport') || n.includes('flight')) return 'airport';
            if (n.includes('mall') || n.includes('shopping') || n.includes('market') || n.includes('supermarket')) return 'mall';
            if (n.includes('it park') || n.includes('tech park') || n.includes('sez') || n.includes('business')) return 'it_park';
            if (n.includes('park') || n.includes('garden') || n.includes('playground')) return 'park';
            if (n.includes('highway') || n.includes('expressway') || n.includes('road')) return 'highway';
            if (n.includes('bus stop') || n.includes('transport') || n.includes('bus')) return 'transport';
            return 'transport'; // safe fallback
          };

          const { error: advError } = await supabase.from('location_advantages').insert(
              payload.location_advantages.map((a: any) => ({
                  property_id: createdPropertyId,
                  name: a.name,
                  distance: a.distance,
                  type: getAdvantageType(a.name)
              }))
          );
          if (advError) throw advError;
        }
      }

      // Property Highlights (available for all roles)
      if (payload.highlights && payload.highlights.length > 0) {
        const highlightInserts = payload.highlights.map((hl: any) => ({
          property_id: createdPropertyId,
          title: hl.title,
          value: hl.value
        }));
        const { error: hlError } = await supabase
          .from('property_highlights')
          .insert(highlightInserts);
        if (hlError) throw hlError;
      }

      return { data: newProp, error: null };
    } catch (error: any) {
      console.error("Property creation failed midway. Rolling back...", error);
      
      // Rollback: delete the partially created property (cascades to related tables)
      if (createdPropertyId) {
        console.log(`Deleting property ${createdPropertyId} due to partial failure.`);
        await supabase.from('properties').delete().eq('id', createdPropertyId);
      }
      return { data: null, error };
    }
  },

  /**
   * Update an existing property
   */
  async updateProperty(propertyId: string, payload: any) {
    try {
      // 1. Update Base Property
      const { data: updatedProp, error: propError } = await supabase
        .from('properties')
        .update({
          title: payload.title,
          description: payload.description,
          city: payload.city,
          price: payload.price,
          price_num: payload.price_num,
          price_display: payload.price_display,
          status: payload.status || 'pending',
          type: payload.property_type?.toLowerCase().includes('apartment') || payload.property_type?.toLowerCase().includes('flat') ? 'apartment' : 
                payload.property_type?.toLowerCase().includes('villa') || payload.property_type?.toLowerCase().includes('house') ? 'villa' :
                payload.property_type?.toLowerCase().includes('penthouse') ? 'penthouse' : 'apartment',
          property_type: payload.property_type,
          bhk: payload.bhk,
          area_sqft: payload.area_sqft || payload.built_up_area || payload.carpet_area || payload.super_built_up_area || 0,
          furnishing: payload.furnishing,
          ownership: payload.ownership_type,
          ownership_type: payload.ownership_type,
          posted_by_role: payload.posted_by_role,
          floor_number: payload.floor_number,
          total_floors: payload.total_floors,
          facing: payload.facing,
          possession_status: payload.possession_status,
          property_age: payload.property_age,
          balconies: payload.balconies,
          maintenance_charges: payload.maintenance_charges,
          carpet_area: payload.carpet_area,
          built_up_area: payload.built_up_area,
          super_built_up_area: payload.super_built_up_area,
          bathrooms: payload.bathrooms,
          updated_at: new Date().toISOString()
        })
        .eq('id', propertyId)
        .select()
        .single();

      if (propError) throw propError;

      // 1.5 Update Location
      if (payload.locality || payload.city || payload.address) {
        // Delete old
        await supabase.from('locations').delete().eq('property_id', propertyId);
        // Insert new
        const { error: locError } = await supabase
          .from('locations')
          .insert({
            property_id: propertyId,
            city: payload.city,
            locality: payload.locality,
            address: payload.address,
            state: payload.state,
            pincode: payload.pincode,
            lat: payload.lat,
            lng: payload.lng
          });
        if (locError) throw locError;
      }

      // 2. Insert Images (only new ones are passed as payload.images, old ones are kept)
      if (payload.images && payload.images.length > 0) {
        const imageInserts = payload.images.map((img: any, index: number) => ({
          property_id: propertyId,
          url: img.url,
          is_floor_plan: false,
          sort_order: index + (payload.existingImagesCount || 0)
        }));
        const { error: imgError } = await supabase
          .from('property_images')
          .insert(imageInserts);
        if (imgError) throw imgError;
      }

      // 3. Insert Videos
      if (payload.videos && payload.videos.length > 0) {
        const videoInserts = payload.videos.map((vid: any, index: number) => ({
          property_id: propertyId,
          video_url: vid.url,
          title: vid.title,
          is_primary: index === (payload.primaryVideoIndex || 0),
          sort_order: index + (payload.existingVideosCount || 0),
          duration_seconds: null,
          file_size_mb: vid.size ? (vid.size / (1024 * 1024)) : null,
        }));
        const { error: vidError } = await supabase
          .from('property_videos')
          .insert(videoInserts);
        if (vidError) throw vidError;
      }

      // Delete removed media
      if (payload.deletedImageIds && payload.deletedImageIds.length > 0) {
        await supabase.from('property_images').delete().in('id', payload.deletedImageIds);
      }
      if (payload.deletedVideoIds && payload.deletedVideoIds.length > 0) {
        await supabase.from('property_videos').delete().in('id', payload.deletedVideoIds);
      }
      if (payload.deletedTourIds && payload.deletedTourIds.length > 0) {
        await supabase.from('property_virtual_tours').delete().in('id', payload.deletedTourIds);
      }

      // 4. Update Amenities
      await supabase.from('property_amenities').delete().eq('property_id', propertyId);
      if (payload.amenity_ids && payload.amenity_ids.length > 0) {
        const amenityInserts = payload.amenity_ids.map((amenity_id: string) => ({
          property_id: propertyId,
          amenity_id
        }));
        const { error: amenityError } = await supabase
          .from('property_amenities')
          .insert(amenityInserts);
        if (amenityError) throw amenityError;
      }

      // 5. Update Dealer-Specific Details
      if (payload.posted_by_role === 'dealer' || payload.posted_by_role === 'builder') {
        // Project Details
        await supabase.from('project_details').delete().eq('property_id', propertyId);
        if (payload.project_details) {
          const { error: projError } = await supabase
            .from('project_details')
            .insert({
              property_id: propertyId,
              project_name: payload.project_details.project_name,
              builder_name: payload.project_details.builder_name,
              launch_year: payload.project_details.launch_year,
              possession_date: payload.project_details.possession_date,
              total_units: payload.project_details.total_units,
              project_area: payload.project_details.project_area,
              rera_number: payload.project_details.rera_number,
              marketing_tagline: payload.project_details.marketing_tagline,
              description: payload.project_details.description
            });
          if (projError) throw projError;
        }

        // Location Advantages
        await supabase.from('location_advantages').delete().eq('property_id', propertyId);
        if (payload.location_advantages && payload.location_advantages.length > 0) {
          const getAdvantageType = (name: string) => {
            const n = name.toLowerCase();
            if (n.includes('school') || n.includes('college') || n.includes('university') || n.includes('education')) return 'school';
            if (n.includes('hospital') || n.includes('clinic') || n.includes('medical')) return 'hospital';
            if (n.includes('metro') || n.includes('station') || n.includes('railway') || n.includes('train')) return 'metro';
            if (n.includes('airport') || n.includes('flight')) return 'airport';
            if (n.includes('mall') || n.includes('shopping') || n.includes('market') || n.includes('supermarket')) return 'mall';
            if (n.includes('it park') || n.includes('tech park') || n.includes('sez') || n.includes('business')) return 'it_park';
            if (n.includes('park') || n.includes('garden') || n.includes('playground')) return 'park';
            if (n.includes('highway') || n.includes('expressway') || n.includes('road')) return 'highway';
            if (n.includes('bus stop') || n.includes('transport') || n.includes('bus')) return 'transport';
            return 'transport';
          };

          const { error: advError } = await supabase.from('location_advantages').insert(
              payload.location_advantages.map((a: any) => ({
                  property_id: propertyId,
                  name: a.name,
                  distance: a.distance,
                  type: getAdvantageType(a.name)
              }))
          );
          if (advError) throw advError;
        }
      }

      // Property Highlights
      await supabase.from('property_highlights').delete().eq('property_id', propertyId);
      if (payload.highlights && payload.highlights.length > 0) {
        const highlightInserts = payload.highlights.map((hl: any) => ({
          property_id: propertyId,
          title: hl.title,
          value: hl.value
        }));
        const { error: hlError } = await supabase
          .from('property_highlights')
          .insert(highlightInserts);
        if (hlError) throw hlError;
      }

      return { data: updatedProp, error: null };
    } catch (error: any) {
      console.error("Property update failed.", error);
      return { data: null, error };
    }
  },

  /**
   * Upload an image to Supabase Storage
   */
  async uploadPropertyImage(file: File, userId: string): Promise<{ url: string | null; error: Error | null }> {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}/${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;

      const { error } = await supabase.storage
        .from('property_images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('property_images')
        .getPublicUrl(fileName);

      return { url: publicUrl, error: null };
    } catch (error: any) {
      console.error('Error uploading image:', error);
      return { url: null, error };
    }
  },

  /**
   * Upload a video to Supabase Storage
   */
  async uploadPropertyVideo(file: File, userId: string): Promise<{ url: string | null; error: Error | null }> {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}/${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;

      const { error } = await supabase.storage
        .from('property-videos')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('property-videos')
        .getPublicUrl(fileName);

      return { url: publicUrl, error: null };
    } catch (error: any) {
      console.error('Error uploading video:', error);
      return { url: null, error };
    }
  },

  /**
   * Fetch top localities based on active listings
   */
  async getPopularLocalities(): Promise<PopularLocality[]> {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('city, locations(locality)')
        .eq('status', 'approved');

      if (error) throw error;
      if (!data) return [];

      const localityCounts: Record<string, { city: string, count: number }> = {};
      
      data.forEach(item => {
        const loc = Array.isArray(item.locations) ? item.locations[0] : item.locations;
        const locality = loc?.locality;
        if (!locality) return;
        
        const key = `${locality}|${item.city}`;
        if (!localityCounts[key]) {
          localityCounts[key] = { city: item.city || 'Unknown', count: 0 };
        }
        localityCounts[key].count++;
      });

      const localities: PopularLocality[] = Object.entries(localityCounts).map(([key, info], index) => {
        const localityName = key.split('|')[0];
        
        // Pseudo-random consistent YoY generator
        const hash = localityName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const pseudoRandomGrowth = 4.0 + (hash % 80) / 10;
        
        return {
          id: index + 1,
          name: localityName,
          city: info.city,
          propertiesCount: info.count,
          yoy: `+${pseudoRandomGrowth.toFixed(1)}%`
        };
      });

      // Sort by property count descending
      localities.sort((a, b) => b.propertiesCount - a.propertiesCount);

      return localities.slice(0, 10);
    } catch (err) {
      console.error("Error fetching popular localities:", err);
      return [];
    }
  }
};

