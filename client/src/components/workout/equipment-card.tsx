import { Card, CardContent } from "@/components/ui/card";
import { EquipmentItem } from "@/lib/types";

interface EquipmentCardProps {
  equipment: EquipmentItem;
}

export function EquipmentCard({ equipment }: EquipmentCardProps) {
  return (
    <Card className="bg-white rounded-lg shadow overflow-hidden">
      <img 
        src={equipment.imageUrl} 
        alt={equipment.name} 
        className="w-full h-40 object-cover"
      />
      <CardContent className="p-3">
        <h3 className="font-medium">{equipment.name}</h3>
        <p className="text-sm text-gray-600">{equipment.description}</p>
      </CardContent>
    </Card>
  );
}
