import { Calendar, User } from "lucide-react";
import { getPropertyImage } from '@/utils/propertyImages';
import { BlogPost } from '@/types';

export function BlogCard({ post }: { post: BlogPost }) {
  return (
    <article className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer border border-gray-100 flex flex-col h-full">
      <div className="relative h-48 overflow-hidden bg-gray-100 shrink-0">
        <img 
          src={getPropertyImage(post.imageUrl)}
          alt={post.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-[#FF3F6C]">
          {post.category}
        </div>
      </div>
      
      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-lg font-bold text-[#1A1A1A] font-['Poppins'] leading-snug mb-2 group-hover:text-[#FF3F6C] transition-colors">
          {post.title}
        </h3>
        <p className="text-sm text-[#6B7280] mb-4 flex-1 line-clamp-3">
          {post.excerpt}
        </p>
        
        <div className="flex items-center justify-between text-xs text-[#6B7280] pt-4 border-t border-gray-100">
          <div className="flex items-center gap-1.5">
            <User size={12} />
            <span>{post.author}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar size={12} />
            <span>{post.date}</span>
          </div>
        </div>
      </div>
    </article>
  );
}
