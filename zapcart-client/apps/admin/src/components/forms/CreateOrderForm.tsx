"use client"

import * as React from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@repo/ui/ui/button"
import { Input } from "@repo/ui/ui/input"
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
import { User, Package, CreditCard, MapPin, Search, Plus, Minus, X, Info } from "lucide-react"

const orderSchema = z.object({
    customerName: z.string().min(2, "Customer name is required"),
    customerEmail: z.string().email("Invalid email address"),
    paymentMethod: z.string().min(1, "Payment method is required"),
    shippingAddress: z.string().min(5, "Shipping address is required"),
    items: z.array(z.object({
        productId: z.string(),
        name: z.string(),
        price: z.number(),
        quantity: z.number().min(1),
        image: z.string()
    })).min(1, "At least one product is required"),
})

type OrderFormValues = z.infer<typeof orderSchema>

interface CreateOrderFormProps {
    onCancel?: () => void
    onSubmit?: (data: any) => void
}

export function CreateOrderForm({ onCancel, onSubmit }: CreateOrderFormProps) {
    const [searchQuery, setSearchQuery] = React.useState("")

    const form = useForm<OrderFormValues>({
        resolver: zodResolver(orderSchema),
        defaultValues: {
            customerName: "",
            customerEmail: "",
            paymentMethod: "credit_card",
            shippingAddress: "",
            items: [],
        },
    })

    const { fields, append, remove, update } = useFieldArray({
        control: form.control,
        name: "items",
    })

    // Mock products for selection
    const mockProducts = [
        { id: "1", name: "Premium Wireless Headphones", price: 299.99, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&q=80" },
        { id: "2", name: "Mechanical Keyboard", price: 149.99, image: "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=100&q=80" },
        { id: "3", name: "Smart Watch Series 7", price: 399.99, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&q=80" },
    ]

    const filteredProducts = mockProducts.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !fields.find(f => f.productId === p.id)
    )

    const addItem = (product: any) => {
        append({
            productId: product.id,
            name: product.name,
            price: product.price,
            quantity: 1,
            image: product.image
        })
        setSearchQuery("")
    }

    const onFormSubmit = (data: OrderFormValues) => {
        const subtotal = data.items.reduce((acc, item) => acc + (item.price * item.quantity), 0)
        const tax = subtotal * 0.1
        const shipping = 15.00
        const total = subtotal + tax + shipping

        const formData = {
            ...data,
            summary: {
                subtotal,
                tax,
                shipping,
                total
            },
            status: "pending",
            createdAt: new Date().toISOString()
        }
        console.log("Order Data:", formData)
        onSubmit?.(formData)
    }

    const items = form.watch("items")
    const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0)
    const tax = subtotal * 0.1
    const shipping = subtotal > 0 ? 15.00 : 0
    const total = subtotal + tax + shipping

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-8 py-4 max-h-[80vh] overflow-y-auto px-1">
                {/* Customer Information */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                        <User className="h-4 w-4 text-primary" />
                        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Customer Details</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="customerName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs font-bold text-gray-700">Full Name</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="John Doe" className="bg-gray-50/50" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="customerEmail"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs font-bold text-gray-700">Email Address</FormLabel>
                                    <FormControl>
                                        <Input {...field} type="email" placeholder="john@example.com" className="bg-gray-50/50" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                {/* Product Selection */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                        <Package className="h-4 w-4 text-primary" />
                        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Order Items</h3>
                    </div>

                    <div className="space-y-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Search products..."
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
                                                onClick={() => addItem(product)}
                                                className="w-full flex items-center gap-3 p-2 hover:bg-gray-50 transition-colors text-left"
                                            >
                                                <img src={product.image} alt="" className="w-10 h-10 rounded object-cover" />
                                                <div className="flex-1 text-xs">
                                                    <p className="font-bold text-gray-900">{product.name}</p>
                                                    <p className="text-gray-500">${product.price}</p>
                                                </div>
                                                <Plus className="h-4 w-4 text-primary" />
                                            </button>
                                        ))
                                    ) : (
                                        <div className="p-4 text-center text-xs text-gray-500">No products found</div>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="space-y-3">
                            {fields.map((item, index) => (
                                <div key={item.id} className="flex items-center gap-4 p-3 bg-gray-50/50 rounded-xl border border-gray-100">
                                    <img src={item.image} alt="" className="w-12 h-12 rounded object-cover border border-gray-200" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-bold text-gray-900 truncate">{item.name}</p>
                                        <p className="text-[10px] text-gray-500">${item.price}</p>
                                    </div>
                                    <div className="flex items-center gap-2 bg-white rounded-lg border border-gray-200 p-1">
                                        <button
                                            type="button"
                                            onClick={() => update(index, { ...item, quantity: Math.max(1, item.quantity - 1) })}
                                            className="h-6 w-6 flex items-center justify-center rounded-md hover:bg-gray-100 transition-colors"
                                        >
                                            <Minus className="h-3 w-3" />
                                        </button>
                                        <span className="text-xs font-bold w-6 text-center">{item.quantity}</span>
                                        <button
                                            type="button"
                                            onClick={() => update(index, { ...item, quantity: item.quantity + 1 })}
                                            className="h-6 w-6 flex items-center justify-center rounded-md hover:bg-gray-100 transition-colors"
                                        >
                                            <Plus className="h-3 w-3" />
                                        </button>
                                    </div>
                                    <div className="text-right min-w-[60px]">
                                        <p className="text-xs font-bold text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => remove(index)}
                                        className="h-8 w-8 flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                            ))}
                            {fields.length === 0 && (
                                <div className="text-center py-8 border-2 border-dashed border-gray-100 rounded-xl">
                                    <Package className="h-8 w-8 text-gray-200 mx-auto mb-2" />
                                    <p className="text-xs text-gray-400 font-medium">No products added to this order yet.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Delivery & Payment */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                            <CreditCard className="h-4 w-4 text-primary" />
                            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Payment Method</h3>
                        </div>
                        <FormField
                            control={form.control}
                            name="paymentMethod"
                            render={({ field }) => (
                                <FormItem>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="bg-gray-50/50">
                                                <SelectValue placeholder="Select method" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="credit_card">Credit Card</SelectItem>
                                            <SelectItem value="paypal">PayPal</SelectItem>
                                            <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                                            <SelectItem value="cod">Cash on Delivery</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                            <MapPin className="h-4 w-4 text-primary" />
                            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Shipping Address</h3>
                        </div>
                        <FormField
                            control={form.control}
                            name="shippingAddress"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input {...field} placeholder="Full delivery address..." className="bg-gray-50/50" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                {/* Order Summary */}
                <div className="bg-gray-900 rounded-2xl p-6 text-white overflow-hidden relative group">
                    <div className="absolute top-0 right-0 p-8 text-white/5 pointer-events-none group-hover:scale-110 transition-transform duration-500">
                        <CreditCard className="h-32 w-32 rotate-12" />
                    </div>
                    <div className="relative space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center border border-primary/20">
                                <Info className="h-4 w-4 text-primary" />
                            </div>
                            <h3 className="text-sm font-bold uppercase tracking-wider">Order Summary</h3>
                        </div>
                        <div className="space-y-2 border-y border-white/10 py-4">
                            <div className="flex justify-between text-xs text-white/60">
                                <span>Subtotal</span>
                                <span className="font-bold text-white">${subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-xs text-white/60">
                                <span>Estimaxed Tax (10%)</span>
                                <span className="font-bold text-white">${tax.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-xs text-white/60">
                                <span>Shipping Fee</span>
                                <span className="font-bold text-white">${shipping.toFixed(2)}</span>
                            </div>
                        </div>
                        <div className="flex justify-between items-center pt-2">
                            <span className="text-xs font-bold uppercase tracking-wider text-white/60">Total Amount</span>
                            <span className="text-2xl font-black text-primary">${total.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
                    <Button variant="outline" type="button" onClick={onCancel} className="font-bold border-gray-200">
                        Discard
                    </Button>
                    <Button type="submit" className="font-bold bg-primary hover:bg-primary/90 px-8">
                        Create Order
                    </Button>
                </div>
            </form>
        </Form>
    )
}
