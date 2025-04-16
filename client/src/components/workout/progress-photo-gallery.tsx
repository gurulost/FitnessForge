import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { ProgressPhoto } from "@/lib/types";
import { useDeleteProgressPhoto } from "@/hooks/use-progress";
import { useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface ProgressPhotoGalleryProps {
  photos: ProgressPhoto[];
  onAddPhoto: () => void;
}

export function ProgressPhotoGallery({ photos, onAddPhoto }: ProgressPhotoGalleryProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<ProgressPhoto | null>(null);
  const deletePhoto = useDeleteProgressPhoto();
  const { toast } = useToast();
  
  const handleDelete = async () => {
    if (!selectedPhoto) return;
    
    try {
      await deletePhoto.mutateAsync({ 
        id: selectedPhoto.id, 
        userId: selectedPhoto.userId 
      });
      
      toast({
        title: "Photo deleted",
        description: "Your progress photo has been removed",
      });
      
      setSelectedPhoto(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete photo",
        variant: "destructive",
      });
    }
  };
  
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Your Progress Photos</h2>
        <Button 
          onClick={onAddPhoto} 
          variant="ghost" 
          className="text-primary hover:text-blue-700 text-sm font-medium"
        >
          <i className="fas fa-camera mr-1"></i> Add New
        </Button>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {photos.length === 0 ? (
          <p className="text-gray-500 col-span-full text-center py-4">
            You haven't added any progress photos yet. Take your first photo to track your fitness journey!
          </p>
        ) : (
          photos.map((photo) => (
            <PhotoCard 
              key={photo.id} 
              photo={photo} 
              onClick={() => setSelectedPhoto(photo)} 
            />
          ))
        )}
      </div>
      
      {/* Photo Detail Dialog */}
      <Dialog open={!!selectedPhoto} onOpenChange={() => setSelectedPhoto(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Progress Photo</DialogTitle>
          </DialogHeader>
          
          {selectedPhoto && (
            <>
              <div className="overflow-hidden rounded-md">
                <img 
                  src={selectedPhoto.photoUrl} 
                  alt={selectedPhoto.caption || "Progress photo"} 
                  className="w-full object-cover"
                />
              </div>
              
              <div className="space-y-2">
                <p className="text-sm font-medium">
                  {formatDate(selectedPhoto.date)}
                </p>
                {selectedPhoto.caption && (
                  <p className="text-sm text-gray-500">{selectedPhoto.caption}</p>
                )}
              </div>
              
              <DialogFooter className="sm:justify-end">
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedPhoto(null)}
                >
                  Close
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={handleDelete}
                  disabled={deletePhoto.isPending}
                >
                  {deletePhoto.isPending ? "Deleting..." : "Delete"}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface PhotoCardProps {
  photo: ProgressPhoto;
  onClick: () => void;
}

function PhotoCard({ photo, onClick }: PhotoCardProps) {
  return (
    <div 
      className="relative group rounded-lg overflow-hidden shadow cursor-pointer"
      onClick={onClick}
    >
      <img 
        src={photo.photoUrl} 
        alt={photo.caption || "Progress photo"} 
        className="w-full h-48 object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
        <div className="p-3 text-white">
          <p className="text-sm font-medium">{photo.caption || "Progress photo"}</p>
          <p className="text-xs opacity-80">{formatDate(photo.date)}</p>
        </div>
      </div>
    </div>
  );
}
