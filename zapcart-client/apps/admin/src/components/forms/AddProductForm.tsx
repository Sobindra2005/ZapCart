"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@repo/ui/ui/button"
import { Input } from "@repo/ui/ui/input"
import { Textarea } from "@repo/ui/ui/textarea"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@repo/ui/ui/form"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@repo/ui/ui/select"
import { Upload, X, Plus, Info, Tag } from "lucide-react"

const productSchema = z.object({
    name: z.string().min(2, "Product name must be at least 2 characters"),
    category: z.string().min(1, "Please select a category"),
    price: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, "Price must be a positive number"),
    stock: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, "Stock must be a non-negative number"),
    description: z.string().optional(),
    sku: z.string().optional(),
    compareAtPrice: z.string().optional(),
})

type ProductFormValues = z.infer<typeof productSchema>

interface AddProductFormProps {
    onCancel?: () => void
    onSubmit?: (data: any) => void
}

export function AddProductForm({ onCancel, onSubmit }: AddProductFormProps) {
    const [images, setImages] = React.useState<string[]>([])

    const form = useForm<ProductFormValues>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            name: "",
            category: "",
            price: "",
            stock: "",
            description: "",
            sku: "",
            compareAtPrice: "",
        },
    })

    const onFormSubmit = (data: ProductFormValues) => {
        const formattedData = {
            ...data,
            price: parseFloat(data.price),
            stock: parseInt(data.stock),
            compareAtPrice: data.compareAtPrice ? parseFloat(data.compareAtPrice) : null,
            images,
            status: "active",
        }
        console.log("Product Data:", formattedData)
        onSubmit?.(formattedData)
    }

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || [])
        files.forEach(file => {
            const reader = new FileReader()
            reader.onloadend = () => {
                setImages(prev => [...prev, reader.result as string])
            }
            reader.readAsDataURL(file)
        })
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-8 py-4 max-h-[80vh] overflow-y-auto px-1">
                {/* General Information */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                        <Info className="h-4 w-4 text-primary" />
                        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">General Information</h3>
                    </div>
                    <div className="grid gap-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs font-bold text-gray-700">Product Name</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="e.g. Wireless Noise Cancelling Headphones" className="bg-gray-50/50" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs font-bold text-gray-700">Description</FormLabel>
                                    <FormControl>
                                        <Textarea {...field} placeholder="Describe the product features and benefits..." className="h-32 bg-gray-50/50" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                {/* Organization & Pricing */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                            <Tag className="h-4 w-4 text-primary" />
                            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Organization</h3>
                        </div>
                        <div className="grid gap-4">
                            <FormField
                                control={form.control}
                                name="category"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs font-bold text-gray-700">Category</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="bg-gray-50/50">
                                                    <SelectValue placeholder="Select category" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="electronics">Electronics</SelectItem>
                                                <SelectItem value="clothing">Clothing</SelectItem>
                                                <SelectItem value="home">Home & Garden</SelectItem>
                                                <SelectItem value="toys">Toys</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="sku"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs font-bold text-gray-700">SKU (Stock Keeping Unit)</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder="WH-1000XM5-B" className="bg-gray-50/50" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                            <span className="text-primary font-bold text-lg">$</span>
                            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Pricing & Stock</h3>
                        </div>
                        <div className="grid gap-4">
                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="price"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-xs font-bold text-gray-700">Price ($)</FormLabel>
                                            <FormControl>
                                                <Input {...field} type="number" placeholder="0.00" className="bg-gray-50/50" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="compareAtPrice"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-xs font-bold text-gray-700">Compare at ($)</FormLabel>
                                            <FormControl>
                                                <Input {...field} type="number" placeholder="0.00" className="bg-gray-50/50" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <FormField
                                control={form.control}
                                name="stock"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs font-bold text-gray-700">Inventory Level</FormLabel>
                                        <FormControl>
                                            <Input {...field} type="number" placeholder="0" className="bg-gray-50/50" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>
                </div>

                {/* Media */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                        <Upload className="h-4 w-4 text-primary" />
                        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Product Media</h3>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {images.map((img, i) => (
                            <div key={i} className="aspect-square rounded-xl border border-gray-200 bg-gray-50 relative group overflow-hidden">
                                <img src={img} alt="" className="object-cover w-full h-full" />
                                <button
                                    type="button"
                                    onClick={() => setImages(prev => prev.filter((_, idx) => idx !== i))}
                                    className="absolute top-1 right-1 h-6 w-6 rounded-full bg-white/80 backdrop-blur-sm border border-gray-200 flex items-center justify-center text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <X className="h-3 w-3" />
                                </button>
                            </div>
                        ))}
                        <label className="aspect-square rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-2 hover:bg-gray-50 transition-colors cursor-pointer group">
                            <div className="h-10 w-10 rounded-full bg-primary/5 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                <Plus className="h-5 w-5" />
                            </div>
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider text-center px-2">Add Image</span>
                            <input type="file" className="hidden" accept="image/*" multiple onChange={handleImageUpload} />
                        </label>
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
                    <Button variant="outline" type="button" onClick={onCancel} className="font-bold border-gray-200">
                        Discard Changes
                    </Button>
                    <Button type="submit" className="font-bold bg-primary hover:bg-primary/90 px-8">
                        Save Product
                    </Button>
                </div>
            </form>
        </Form>
    )
}
