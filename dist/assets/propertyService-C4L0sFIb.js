import{s as a}from"./index-D5o8PweC.js";const u={async getAllPropertiesRaw(r={},e=1,s=10){const n=(e-1)*s,i=n+s-1;let o=`
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
      )
    `;r.amenities&&r.amenities.length>0&&(o+=", property_amenities!inner ( amenities!inner ( name ) )");let t=a.from("properties").select(o).eq("status","approved").order("created_at",{ascending:!1});return r.city&&r.city.trim()!==""&&(t=t.ilike("city",`%${r.city.trim()}%`)),r.minPrice!==void 0&&(t=t.gte("price",r.minPrice)),r.maxPrice!==void 0&&(t=t.lte("price",r.maxPrice)),r.furnishing&&(t=t.eq("furnishing",r.furnishing)),r.propertyAge&&(t=t.eq("property_age",r.propertyAge)),r.possessionStatus&&(t=t.eq("possession_status",r.possessionStatus)),r.ownershipType&&(t=t.eq("ownership_type",r.ownershipType)),r.propertyType&&(t=t.eq("property_type",r.propertyType)),r.bhk!==void 0&&(t=t.eq("bhk",r.bhk)),r.postedByRole&&(t=t.eq("posted_by_role",r.postedByRole)),r.amenities&&r.amenities.length>0&&(t=t.in("property_amenities.amenities.name",r.amenities)),r.hasVideos&&(t=t.not("property_videos","is",null)),t=t.range(n,i),await t},mapProperties(r){return(r||[]).map(e=>{var s,n,i,o,t;return{id:e.id,title:e.title||"Untitled Property",price:e.price?`₹${Number(e.price).toLocaleString("en-IN")}`:"N/A",city:e.city||"Unknown Location",image:((n=(s=e.property_images)==null?void 0:s[0])==null?void 0:n.url)||"/placeholder.jpg",ownerName:(Array.isArray(e.owner)?(i=e.owner[0])==null?void 0:i.name:(o=e.owner)==null?void 0:o.name)||"Unknown",description:e.description,status:e.status,createdAt:e.created_at,propertyType:e.property_type,bhk:e.bhk,areaSqft:e.area_sqft,furnishing:e.furnishing,ownershipType:e.ownership_type,postedByRole:e.posted_by_role,projectName:e.project_name,amenities:e.amenities,videos:((t=e.property_videos)==null?void 0:t.length)>0?e.property_videos:[{id:`default-vid-${e.id}`,property_id:e.id,video_url:"https://www.w3schools.com/html/mov_bbb.mp4",thumbnail_url:`https://loremflickr.com/800/450/property,video?random=${e.id}`,title:"Property Walkthrough",is_primary:!0,sort_order:0}],property_images:e.property_images||[]}})},async getAllProperties(r={},e=1,s=10){const{data:n,error:i}=await this.getAllPropertiesRaw(r,e,s);return i?(console.error("Supabase Error:",i),[]):this.mapProperties(n)},async saveProperty(r,e){if(!r||!e)return{error:new Error("Invalid IDs")};const{error:s}=await a.from("saved_properties").insert({user_id:r,property_id:e});return s&&console.error("Error saving property:",s),{error:s}},async unsaveProperty(r,e){if(!r||!e)return{error:new Error("Invalid IDs")};const{error:s}=await a.from("saved_properties").delete().match({user_id:r,property_id:e});return s&&console.error("Error unsaving property:",s),{error:s}},async checkIfSaved(r,e){if(!r||!e)return!1;const{data:s,error:n}=await a.from("saved_properties").select("id").match({user_id:r,property_id:e}).maybeSingle();return!!s&&!n},async getSavedProperties(r){if(!r)return[];const{data:e,error:s}=await a.from("saved_properties").select(`
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
      `).eq("user_id",r).order("created_at",{ascending:!1});if(s)return console.error("Error fetching saved properties:",s),[];const n=(e||[]).map(i=>i.properties).filter(Boolean);return this.mapProperties(n)},generatePropertyDescription(r){const e=r.bhk?`${r.bhk} BHK`:"",s=r.areaSqft?`${r.areaSqft} sq.ft`:"",n=r.propertyType||"property",i=r.city||"the city",o=r.furnishing?r.furnishing.replace("_"," "):"unfurnished";if(r.postedByRole==="owner")return`This well-maintained ${e} ${n} is available for sale directly by the owner in ${i}. The property offers a practical built-up area of ${s} and comes with ${o} interiors. With essential amenities nearby, this is perfectly suited for families looking for a comfortable residence in a well-connected location.

Contact directly for a transparent and straightforward deal.`;{const t=r.projectName?` in the premium residential development, ${r.projectName}`:"";return`Presenting an exceptional ${e} ${n}${t}, strategically located in ${i}. Designed with modern aesthetics, it features an expansive layout spanning ${s} with premium ${o} interiors. 

Residents will enjoy world-class amenities, robust infrastructure, and seamless connectivity to prime city hubs. This property ensures an elevated lifestyle and high investment value. Contact us to schedule a comprehensive site visit today.`}},async getPropertyById(r){var c,l;const{data:e,error:s}=await a.from("properties").select(`
        *,
        owner:users!properties_owner_id_fkey (
          id, name, email, role
        ),
        property_images ( id, url ),
        property_videos ( id, video_url, thumbnail_url, title, duration_seconds, file_size_mb, is_primary ),
        property_amenities ( amenities ( id, name, icon_name ) ),
        locations ( city, locality, address ),
        projects ( id, name, builder_name, rera_id, possession_date, description ),
        location_advantages ( id, name, distance, type ),
        property_highlights ( id, title, value )
      `).eq("id",r).single();if(s)throw console.error("Supabase Error:",s),s;const n=Array.isArray(e.owner)?e.owner[0]:e.owner,i=Array.isArray(e.locations)?e.locations[0]:e.locations,o=Array.isArray(e.projects)?e.projects[0]:e.projects,t={...e,bhk:e.bhk,areaSqft:e.area_sqft,propertyType:e.property_type,postedByRole:e.posted_by_role||(n==null?void 0:n.role)||"owner",city:(i==null?void 0:i.city)||e.city,projectName:(o==null?void 0:o.name)||e.project_name};return{id:e.id,title:e.title||"Untitled Property",price:e.price_display||(e.price_num?`₹${(e.price_num/1e5).toFixed(1)} Lacs`:e.price?`₹${(e.price/1e5).toFixed(1)} Lacs`:"N/A"),priceNum:e.price_num||e.price||0,location:i?`${i.locality}, ${i.city}`:e.city||"Unknown",area:e.area_sqft?`${e.area_sqft} sq.ft.`:"",bhk:e.bhk||0,type:e.property_type||"apartment",badge:"Verified",builder:(o==null?void 0:o.builder_name)||e.project_builder||"Unknown Builder",description:this.generatePropertyDescription(t),floor:((c=e.floor_number)==null?void 0:c.toString())||"",totalFloors:e.total_floors||0,facing:e.facing||"",possession:e.possession_status||"",rating:4.5,propertyAge:e.property_age||"",ownershipType:e.ownership_type||"Freehold",furnishing:e.furnishing||"Unfurnished",bathrooms:e.bathrooms||0,balconies:e.balconies||0,createdAt:e.created_at,updatedAt:e.updated_at||e.created_at,images:(e.property_images||[]).map(p=>({id:p.id,url:p.url})),amenities:(e.property_amenities||[]).map(p=>({id:p.amenities.id,name:p.amenities.name,iconName:p.amenities.icon_name||"CheckCircle"})),seller:{id:(n==null?void 0:n.id)||"",name:(n==null?void 0:n.name)||"Owner",phone:"+91 9876543210",email:(n==null?void 0:n.email)||"",joinedDate:"2023",propertiesListed:1,role:e.posted_by_role||(n==null?void 0:n.role)||"owner"},videos:((l=e.property_videos)==null?void 0:l.length)>0?e.property_videos:[{id:`default-vid-${e.id}`,property_id:e.id,video_url:"/demo-property.mp4",thumbnail_url:`https://loremflickr.com/800/450/property,video?random=${e.id}`,title:"Property Walkthrough",is_primary:!0,sort_order:0}],locationDetails:{city:(i==null?void 0:i.city)||e.city||"",locality:(i==null?void 0:i.locality)||"",address:(i==null?void 0:i.address)||"",coordinates:(i==null?void 0:i.coordinates)||{lat:18.5204,lng:73.8567},advantages:e.location_advantages||[]},projectDetails:o?{id:o.id,projectName:o.name,builderName:o.builder_name,launchYear:o.possession_date,totalUnits:0,projectArea:o.description||"",reraNumber:o.rera_id}:void 0,highlights:(e.property_highlights||[]).map(p=>({id:p.id,title:p.title,value:p.value})),maintenanceCharges:e.maintenance_charges||void 0}},async createProperty(r){let e=null;try{const{data:s,error:n}=await a.from("properties").insert({owner_id:r.owner_id,title:r.title,description:r.description,city:r.city,price:r.price,price_num:r.price_num,price_display:r.price_display,status:r.status||"pending",property_type:r.property_type,bhk:r.bhk,area_sqft:r.area_sqft,furnishing:r.furnishing,ownership_type:r.ownership_type,posted_by_role:r.posted_by_role,floor_number:r.floor_number,total_floors:r.total_floors,facing:r.facing,possession_status:r.possession_status,property_age:r.property_age,balconies:r.balconies,maintenance_charges:r.maintenance_charges}).select().single();if(n)throw n;if(e=s.id,r.images&&r.images.length>0){const i=r.images.map((t,c)=>({property_id:e,url:t.url,is_primary:c===0,sort_order:c})),{error:o}=await a.from("property_images").insert(i);if(o)throw o}if(r.videos&&r.videos.length>0){const i=r.videos.map((t,c)=>({property_id:e,video_url:t.url,title:t.title,is_primary:c===(r.primaryVideoIndex||0),sort_order:c,duration_seconds:null,file_size_mb:t.size?t.size/1048576:null})),{error:o}=await a.from("property_videos").insert(i);if(o)throw o}if(r.amenity_ids&&r.amenity_ids.length>0){const i=r.amenity_ids.map(t=>({property_id:e,amenity_id:t})),{error:o}=await a.from("property_amenities").insert(i);if(o)throw o}if(r.posted_by_role==="dealer"||r.posted_by_role==="builder"){if(r.project_details){const{error:i}=await a.from("project_details").insert({property_id:e,project_name:r.project_details.project_name,builder_name:r.project_details.builder_name,launch_year:r.project_details.launch_year,possession_date:r.project_details.possession_date,total_units:r.project_details.total_units,project_area:r.project_details.project_area,rera_number:r.project_details.rera_number});if(i)throw i}if(r.location_advantages&&r.location_advantages.length>0){const i=r.location_advantages.map(t=>({property_id:e,name:t.name,distance:t.distance,type:t.type})),{error:o}=await a.from("location_advantages").insert(i);if(o)throw o}if(r.highlights&&r.highlights.length>0){const i=r.highlights.map(t=>({property_id:e,title:t.title,value:t.value})),{error:o}=await a.from("property_highlights").insert(i);if(o)throw o}}return{data:s,error:null}}catch(s){return console.error("Property creation failed midway. Rolling back...",s),e&&(console.log(`Deleting property ${e} due to partial failure.`),await a.from("properties").delete().eq("id",e)),{data:null,error:s}}},async uploadPropertyImage(r,e){try{const s=r.name.split(".").pop(),n=`${e}/${Date.now()}_${Math.random().toString(36).substring(2)}.${s}`,{data:i,error:o}=await a.storage.from("property_images").upload(n,r,{cacheControl:"3600",upsert:!1});if(o)throw o;const{data:{publicUrl:t}}=a.storage.from("property_images").getPublicUrl(n);return{url:t,error:null}}catch(s){return console.error("Error uploading image:",s),{url:null,error:s}}},async uploadPropertyVideo(r,e){try{const s=r.name.split(".").pop(),n=`${e}/${Date.now()}_${Math.random().toString(36).substring(2)}.${s}`,{data:i,error:o}=await a.storage.from("property-videos").upload(n,r,{cacheControl:"3600",upsert:!1});if(o)throw o;const{data:{publicUrl:t}}=a.storage.from("property-videos").getPublicUrl(n);return{url:t,error:null}}catch(s){return console.error("Error uploading video:",s),{url:null,error:s}}},async getPopularLocalities(){try{const{data:r,error:e}=await a.from("properties").select("city, locations(locality)").eq("status","approved");if(e)throw e;if(!r)return[];const s={};r.forEach(i=>{const o=Array.isArray(i.locations)?i.locations[0]:i.locations,t=o==null?void 0:o.locality;if(!t)return;const c=`${t}|${i.city}`;s[c]||(s[c]={city:i.city||"Unknown",count:0}),s[c].count++});const n=Object.entries(s).map(([i,o],t)=>{const c=i.split("|")[0],p=4+c.split("").reduce((d,_)=>d+_.charCodeAt(0),0)%80/10;return{id:t+1,name:c,city:o.city,propertiesCount:o.count,yoy:`+${p.toFixed(1)}%`}});return n.sort((i,o)=>o.propertiesCount-i.propertiesCount),n.slice(0,10)}catch(r){return console.error("Error fetching popular localities:",r),[]}}};export{u as p};
