import { useProperties } from '@/hooks/useProperties';
import { PropertyTable } from '@/components/admin/PropertyTable';

export function AdminPropertiesPage() {
  const { properties, isLoading, error, actionLoadingId, updateStatus, deleteProperty } = useProperties();

  return (
    <div className="p-8 max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold font-['Poppins']">Property Management</h1>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-destructive/40 rounded-xl text-red-500">
          {error}
        </div>
      )}

      <PropertyTable 
        properties={properties} 
        isLoading={isLoading} 
        actionLoadingId={actionLoadingId} 
        onUpdateStatus={updateStatus} 
        onDelete={deleteProperty}
      />
    </div>
  );
}
