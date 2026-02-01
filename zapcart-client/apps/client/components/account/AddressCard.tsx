import { Address } from "@/types/user";
import { Button } from "@repo/ui/ui/button";
import { Card, CardContent } from "@repo/ui/ui/card";
import { MapPin, Edit, Trash2 } from "lucide-react";
import { cn } from "@repo/lib/utils";

interface AddressCardProps {
    address: Address;
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
    onSetDefault: (id: string) => void;
}

export function AddressCard({ address, onEdit, onDelete, onSetDefault }: AddressCardProps) {
    return (
        <Card className={cn(
            "group relative overflow-hidden transition-all duration-300 hover:shadow-lg rounded-2xl", 
            address.isDefault ? "border-primary ring-1 ring-primary/20 bg-primary/2" : "hover:border-primary/30"
        )}>
            <CardContent className="p-5">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className={cn(
                            "p-2.5 rounded-xl transition-colors",
                            address.isDefault ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                        )}>
                            <MapPin className="h-4 w-4" />
                        </div>
                        <div className="flex flex-col">
                            <h3 className="font-bold text-sm">{address.fullName}</h3>
                            {address.isDefault && (
                                <span className="text-[10px] font-bold uppercase tracking-widest text-primary mt-0.5">
                                    Default
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="flex gap-1 md:opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="secondary" size="icon" onClick={() => onEdit(address.id.toString())} className="h-8 w-8 rounded-full shadow-sm">
                            <Edit className="h-3.5 w-3.5" />
                        </Button>
                        {!address.isDefault && (
                            <Button variant="secondary" size="icon" onClick={() => onDelete(address.id.toString())} className="h-8 w-8 rounded-full shadow-sm hover:bg-destructive hover:text-destructive-foreground">
                                <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                        )}
                    </div>
                </div>

                <div className="space-y-1 text-sm mb-6">
                    <p className="text-muted-foreground text-xs">📞 {address.phone}</p>
                    {address.address && (
                        <p className="font-semibold text-foreground">{address.address}</p>
                    )}
                    <p className="text-muted-foreground">{address.city} {address.postalCode}</p>
                </div>

                {!address.isDefault ? (
                    <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => onSetDefault(address.id.toString())} 
                        className="w-full text-xs font-bold transition-all hover:bg-primary hover:text-primary-foreground rounded-xl"
                    >
                        Set as Default
                    </Button>
                ) : (
                    <div className="h-9 flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
