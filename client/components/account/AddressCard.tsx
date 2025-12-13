import { Address } from "@/types/user";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Edit, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface AddressCardProps {
    address: Address;
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
    onSetDefault: (id: string) => void;
}

export function AddressCard({ address, onEdit, onDelete, onSetDefault }: AddressCardProps) {
    return (
        <Card className={cn("relative transition-colors", address.isDefault && "border-primary bg-primary/5")}>
            <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-muted rounded-full">
                            <MapPin className="h-4 w-4 text-foreground" />
                        </div>
                        <div>
                            <h3 className="font-semibold">{address.type}</h3>
                            {address.isDefault && (
                                <span className="text-xs text-primary font-medium bg-primary/10 px-2 py-0.5 rounded-full">
                                    Default
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={() => onEdit(address.id)} className="h-8 w-8 text-muted-foreground hover:text-foreground">
                            <Edit className="h-4 w-4" />
                        </Button>
                        {!address.isDefault && (
                            <Button variant="ghost" size="icon" onClick={() => onDelete(address.id)} className="h-8 w-8 text-muted-foreground hover:text-red-500">
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                </div>

                <div className="space-y-1 text-sm text-muted-foreground mb-4">
                    <p>{address.street}</p>
                    <p>{address.city}, {address.state} {address.zipCode}</p>
                    <p>{address.country}</p>
                </div>

                {!address.isDefault && (
                    <Button variant="outline" size="sm" onClick={() => onSetDefault(address.id)} className="w-full">
                        Set as Default
                    </Button>
                )}
            </CardContent>
        </Card>
    );
}
