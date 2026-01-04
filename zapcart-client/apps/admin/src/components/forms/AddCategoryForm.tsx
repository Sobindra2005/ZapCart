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
import { Upload, X, Link, Info } from "lucide-react"

const categorySchema = z.object({
    name: z.string().min(2, "Category name must be at least 2 characters"),
    slug: z.string().min(2, "Slug must be at least 2 characters"),
    description: z.string().optional(),
    parentId: z.string().nullable().optional(),
})

type CategoryFormValues = z.infer<typeof categorySchema>

interface AddCategoryFormProps {
    onCancel?: () => void
    onSubmit?: (data: any) => void
}

export function AddCategoryForm({ onCancel, onSubmit }: AddCategoryFormProps) {
    const [icon, setIcon] = React.useState<string | null>(null)

    const form = useForm<CategoryFormValues>({
        resolver: zodResolver(categorySchema),
        defaultValues: {
            name: "",
            slug: "",
            description: "",
            parentId: "none",
        },
    })

    // Watch name to auto-generate slug
    const name = form.watch("name")
    React.useEffect(() => {
        if (name) {
            const generatedSlug = name.toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '')
            form.setValue("slug", generatedSlug)
        }
    }, [name, form])

    const onFormSubmit = (data: CategoryFormValues) => {
        const formData = {
            ...data,
            parentId: data.parentId === "none" ? null : data.parentId,
            icon: icon
        }
        console.log("Category Data:", formData)
        onSubmit?.(formData)
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-6 py-4">
                <div className="space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                        <Info className="h-4 w-4 text-primary" />
                        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Basic Details</h3>
                    </div>
                    <div className="grid gap-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs font-bold text-gray-700">Category Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="e.g. Mens Fashion"
                                            className="bg-gray-50/50"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="slug"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs font-bold text-gray-700">Slug</FormLabel>
                                    <div className="relative">
                                        <Link className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder="mens-fashion"
                                                className="pl-9 bg-gray-50/50"
                                            />
                                        </FormControl>
                                    </div>
                                    <p className="text-[10px] text-gray-400 font-medium">The slug is used in the URL for the category page.</p>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                        <Info className="h-4 w-4 text-primary" />
                        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Placement</h3>
                    </div>
                    <FormField
                        control={form.control}
                        name="parentId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-xs font-bold text-gray-700">Parent Category</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value || "none"}>
                                    <FormControl>
                                        <SelectTrigger className="bg-gray-50/50">
                                            <SelectValue placeholder="Select parent" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="none">None (Top Level)</SelectItem>
                                        <SelectItem value="electronics">Electronics</SelectItem>
                                        <SelectItem value="fashion">Fashion</SelectItem>
                                        <SelectItem value="home">Home & Garden</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-xs font-bold text-gray-700">Description (Optional)</FormLabel>
                            <FormControl>
                                <Textarea {...field} placeholder="Short description for this category..." className="bg-gray-50/50 h-24" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                        <Upload className="h-4 w-4 text-primary" />
                        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Category Icon</h3>
                    </div>
                    {!icon ? (
                        <label className="border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center gap-2 hover:bg-gray-50 transition-colors cursor-pointer group">
                            <Upload className="h-6 w-6 text-gray-400 group-hover:text-primary transition-colors" />
                            <span className="text-xs font-bold text-gray-500">Upload Category Icon</span>
                            <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                                const file = e.target.files?.[0]
                                if (file) {
                                    const reader = new FileReader()
                                    reader.onloadend = () => setIcon(reader.result as string)
                                    reader.readAsDataURL(file)
                                }
                            }} />
                        </label>
                    ) : (
                        <div className="relative w-24 h-24 rounded-xl border border-gray-200 overflow-hidden bg-gray-50 group">
                            <img src={icon} alt="Icon" className="w-full h-full object-cover" />
                            <button
                                type="button"
                                onClick={() => setIcon(null)}
                                className="absolute inset-0 bg-black/40 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                    )}
                </div>

                <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
                    <Button variant="outline" type="button" onClick={onCancel} className="font-bold border-gray-200">
                        Cancel
                    </Button>
                    <Button type="submit" className="font-bold bg-primary hover:bg-primary/90 px-8">
                        Create Category
                    </Button>
                </div>
            </form>
        </Form>
    )
}
