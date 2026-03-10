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
import { Calendar, Tag, Percent, Package, Search, X, Loader2 } from "lucide-react"
import { Badge } from "@repo/ui/ui/badge"
import { PlusIcon } from "@radix-ui/react-icons"
import { DialogClose, DialogFooter } from "@repo/ui/ui/dialog"
import DropZone from "../common/dropZone"
import { DateTimePicker } from "../ui/DateTimePicker"

const MAX_CAMPAIGN_FILE_SIZE = 5 * 1024 * 1024
const CAMPAIGN_FILE_ACCEPT = {
    "image/jpeg": [],
    "image/png": [],
    "image/webp": [],
    "image/gif": [],
    "application/pdf": [],
} as const

const allowedCampaignMimeTypes = Object.keys(CAMPAIGN_FILE_ACCEPT)

const campaignSchema = z.object({
    name: z.string().min(2, "Campaign name must be at least 2 characters"),
    description: z.string().optional(),
    status: z.enum(['upcoming', 'active', 'expired', 'paused']).optional(),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
    discountType: z.enum(["percentage", "fixed", "buy-one-get-one"]),
    discountValue: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, "Discount value must be positive"),
    image: z.instanceof(File, { message: "Campaign file is required" })
        .refine((file) => allowedCampaignMimeTypes.includes(file.type), "Only JPG, PNG, WEBP, GIF, or PDF files are allowed")
        .refine((file) => file.size <= MAX_CAMPAIGN_FILE_SIZE, "File size must be 5MB or less"),
    products: z.array(z.string()).min(1, "Select at least one product"),
}).refine((data) => new Date(data.endDate) > new Date(data.startDate), {
    path: ["endDate"],
    message: "End date must be after start date",
})

type CampaignFormValues = z.infer<typeof campaignSchema>

interface CreateCampaignFormProps {
    onCancel?: () => void
    onSubmit?: (data: any) => void
    isLoading?: boolean
}

export function CreateCampaignForm({ onCancel, onSubmit, isLoading = false }: CreateCampaignFormProps) {
    const [selectedProducts, setSelectedProducts] = React.useState<any[]>([])
    const [searchQuery, setSearchQuery] = React.useState("")

    const form = useForm<CampaignFormValues>({
        resolver: zodResolver(campaignSchema),
        defaultValues: {
            name: "",
            description: "",
            status: "upcoming",
            startDate: "",
            endDate: "",
            discountType: "percentage",
            discountValue: "",
            products: [],
        },
    })

    const onFormSubmit = (data: CampaignFormValues) => {
        const formData = {
            ...data,
            discountValue: parseFloat(data.discountValue),
            productIds: data.products,
            imageFile: data.image,
        }
        console.log("Campaign Data:", formData)
        onSubmit?.(formData)
    }

    // Mock products for selection
    const mockProducts = [
        { id: "1", name: "Premium Wireless Headphones", price: 299.99, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&q=80" },
        { id: "2", name: "Mechanical Keyboard", price: 149.99, image: "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=100&q=80" },
        { id: "3", name: "Smart Watch Series 7", price: 399.99, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&q=80" },
        { id: "4", name: "Camera Lens 50mm", price: 599.99, image: "https://images.unsplash.com/photo-1526170315870-ef689710027d?w=100&q=80" },
    ]

    const filteredProducts = mockProducts.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !selectedProducts.find(sp => sp.id === p.id)
    )

    const addProduct = (product: any) => {
        const nextProducts = [...selectedProducts, product]
        setSelectedProducts(nextProducts)
        form.setValue("products", nextProducts.map((p) => p.id), {
            shouldDirty: true,
            shouldValidate: true,
        })
        setSearchQuery("")
    }

    const removeProduct = (productId: string) => {
        const nextProducts = selectedProducts.filter(p => p.id !== productId)
        setSelectedProducts(nextProducts)
        form.setValue("products", nextProducts.map((p) => p.id), {
            shouldDirty: true,
            shouldValidate: true,
        })
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onFormSubmit)} >
                {/* Campaign Details */}
                <div className="max-h-[80vh] overflow-y-auto space-y-8 py-4  px-1">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                            <Tag className="h-4 w-4 text-primary" />
                            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Campaign Details</h3>
                        </div>
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs font-bold text-gray-700">Campaign Name</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="e.g. Summer Flash Sale 2024" className="bg-gray-50/50" />
                                    </FormControl>
                                    {/* <FormMessage /> */}
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
                                        <Textarea {...field} placeholder="Describe this campaign" className="bg-gray-50/50" />
                                    </FormControl>
                                    {/* <FormMessage /> */}
                                </FormItem>
                            )}
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="startDate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs font-bold text-gray-700">Start Date</FormLabel>
                                        <DateTimePicker
                                            date={field.value ? new Date(field.value) : undefined}
                                            setDate={(date) => field.onChange(date?.toISOString())}
                                            time={field.value ? new Date(field.value).toLocaleTimeString("en-US", { hour12: false }) : ""}
                                            setTime={(time) => {
                                                const currentDate = field.value ? new Date(field.value) : new Date();
                                                const [hours, minutes, seconds] = time.split(":");
                                                currentDate.setHours(parseInt(hours));
                                                currentDate.setMinutes(parseInt(minutes));
                                                currentDate.setSeconds(parseInt(seconds));
                                                field.onChange(currentDate.toISOString());
                                            }}
                                        />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="endDate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs font-bold text-gray-700">End Date</FormLabel>
                                        <DateTimePicker
                                            date={field.value ? new Date(field.value) : undefined}
                                            setDate={(date) => field.onChange(date?.toISOString())}
                                            time={field.value ? new Date(field.value).toLocaleTimeString("en-US", { hour12: false }) : ""}
                                            setTime={(time) => {
                                                const currentDate = field.value ? new Date(field.value) : new Date();
                                                const [hours, minutes, seconds] = time.split(":");
                                                currentDate.setHours(parseInt(hours));
                                                currentDate.setMinutes(parseInt(minutes));
                                                currentDate.setSeconds(parseInt(seconds));
                                                field.onChange(currentDate.toISOString());
                                            }}
                                        />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="status"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs font-bold text-gray-700">Status</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="bg-gray-50/50">
                                                    <SelectValue placeholder="Select status" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="upcoming">Upcoming</SelectItem>
                                                <SelectItem value="active">Active</SelectItem>
                                                <SelectItem value="paused">Paused</SelectItem>
                                                <SelectItem value="expired">Expired</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {/* <FormMessage /> */}
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>

                    {/* Discount Configuration */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                            <Percent className="h-4 w-4 text-primary" />
                            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Discount Configuration</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="discountType"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs font-bold text-gray-700">Discount Type</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="bg-gray-50/50">
                                                    <SelectValue placeholder="Select type" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="percentage">Percentage (%)</SelectItem>
                                                <SelectItem value="fixed">Fixed Amount ($)</SelectItem>
                                                <SelectItem value="buy-one-get-one">Buy One Get One</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {/* <FormMessage /> */}
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="discountValue"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs font-bold text-gray-700">Value</FormLabel>
                                        <FormControl>
                                            <Input {...field} type="number" placeholder="0.00" className="bg-gray-50/50" />
                                        </FormControl>
                                        {/* <FormMessage /> */}
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>

                    {/* Campaign Media */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                            <Tag className="h-4 w-4 text-primary" />
                            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Campaign Media</h3>
                        </div>
                        <FormField
                            control={form.control}
                            name="image"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs font-bold text-gray-700">Campaign File</FormLabel>
                                    <FormControl>
                                        <DropZone
                                            accept={CAMPAIGN_FILE_ACCEPT}
                                            multiple={false}
                                            maxSize={MAX_CAMPAIGN_FILE_SIZE}
                                            onDrop={(files) => {
                                                field.onChange(files?.[0])
                                                form.trigger("image")
                                            }}
                                            preview
                                            className="h-32 w-full"
                                        />
                                    </FormControl>
                                    <span className="text-xs text-gray-500">Accepted: JPG, PNG, WEBP, GIF, PDF (max 5MB)</span>
                                    {/* <FormMessage /> */}
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Product Selection */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                            <Package className="h-4 w-4 text-primary" />
                            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Select Products</h3>
                        </div>
                        <div className="space-y-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    placeholder="Search products by name or SKU..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-9 bg-gray-50/50"
                                />
                                {searchQuery && (
                                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-48 overflow-y-auto">
                                        {filteredProducts.length > 0 ? (
                                            filteredProducts.map(product => (
                                                <button
                                                    key={product.id}
                                                    type="button"
                                                    onClick={() => addProduct(product)}
                                                    className="w-full flex items-center gap-3 p-2 hover:bg-gray-50 transition-colors text-left"
                                                >
                                                    <img src={product.image} alt="" className="w-10 h-10 rounded object-cover" />
                                                    <div className="flex-1">
                                                        <p className="text-xs font-bold text-gray-900">{product.name}</p>
                                                        <p className="text-[10px] text-gray-500">${product.price}</p>
                                                    </div>
                                                    <PlusIcon className="h-4 w-4 text-primary" />
                                                </button>
                                            ))
                                        ) : (
                                            <div className="p-4 text-center text-xs text-gray-500">No products found</div>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {selectedProducts.map(product => (
                                    <Badge key={product.id} variant="secondary" className="pl-2 pr-1 py-1 gap-2 bg-primary/5 text-primary border-primary/10">
                                        <span className="text-[10px] font-bold">{product.name}</span>
                                        <button
                                            type="button"
                                            onClick={() => removeProduct(product.id)}
                                            className="h-4 w-4 rounded-full hover:bg-primary/10 flex items-center justify-center transition-colors"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </Badge>
                                ))}
                                {selectedProducts.length === 0 && !searchQuery && (
                                    <div className="text-[10px] text-gray-400 italic">No products selected for this campaign.</div>
                                )}
                            </div>
                            <FormField
                                control={form.control}
                                name="products"
                                render={() => (
                                    <FormItem>
                                        {/* <FormMessage /> */}
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>
                </div>

                <div className="flex w-full justify-end items-center ">
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline" disabled={isLoading}>Cancel</Button>
                        </DialogClose>
                        <Button type="submit" className="font-bold bg-primary hover:bg-primary/90 px-8" disabled={isLoading}>
                            {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                            {isLoading ? "Creating..." : "Create Campaign"}
                        </Button>
                    </DialogFooter>
                </div>
            </form>
        </Form>
    )
}
