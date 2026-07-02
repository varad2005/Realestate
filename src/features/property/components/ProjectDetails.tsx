import { ProjectDetails as ProjectDetailsType } from '@/types';
import { Building2, Calendar, LayoutDashboard, FileCheck } from 'lucide-react';

export function ProjectDetails({ project }: { project?: ProjectDetailsType }) {
  if (!project) return null;

  return (
    <div className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-gray-200">
      <h3 className="text-xl font-bold font-['Poppins'] text-gray-900 mb-6 flex items-center gap-2">
        <Building2 className="text-pink-600" size={20} /> Project Details
      </h3>
      
      <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
        <h4 className="text-lg font-bold text-gray-900 mb-1">{project.projectName}</h4>
        <p className="text-sm text-gray-500 mb-6">By {project.builderName}</p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {project.launchYear && (
            <div>
              <div className="flex items-center gap-1.5 text-gray-500 text-xs mb-1">
                <Calendar size={14} /> Launch Year
              </div>
              <p className="font-semibold text-gray-900">{project.launchYear}</p>
            </div>
          )}
          
          {project.totalUnits && (
            <div>
              <div className="flex items-center gap-1.5 text-gray-500 text-xs mb-1">
                <Building2 size={14} /> Total Units
              </div>
              <p className="font-semibold text-gray-900">{project.totalUnits}</p>
            </div>
          )}
          
          {project.projectArea && (
            <div>
              <div className="flex items-center gap-1.5 text-gray-500 text-xs mb-1">
                <LayoutDashboard size={14} /> Project Area
              </div>
              <p className="font-semibold text-gray-900">{project.projectArea}</p>
            </div>
          )}
          
          {project.reraNumber && (
            <div>
              <div className="flex items-center gap-1.5 text-gray-500 text-xs mb-1">
                <FileCheck size={14} /> RERA ID
              </div>
              <p className="font-semibold text-gray-900">{project.reraNumber}</p>
            </div>
          )}
        </div>
        
        {project.description && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h4 className="text-sm font-bold text-gray-900 mb-2">About the Project</h4>
            <p className="text-sm text-gray-500 leading-relaxed">{project.description}</p>
          </div>
        )}
      </div>
    </div>
  );
}
