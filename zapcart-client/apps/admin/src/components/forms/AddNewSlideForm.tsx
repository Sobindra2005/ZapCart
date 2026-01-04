"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
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
import { Switch } from "@repo/ui/ui/switch"
import { Upload } from "lucide-react"

const slideSchema = z.object({
    title: z.string().min(2, "Slide title must be at least 2 characters"),
    subtitle: z.string().optional(),
    linkUrl: z.string().min(1, "Link URL is required"), // Simplified for now to avoid complexity
    isActive: z.boolean().default(true),
})

type SlideFormValues = z.infer<typeof slideSchema>

interface AddNewSlideFormProps {
    onCancel?: () => void
    onSubmit?: (data: any) => void
}

export function AddNewSlideForm({ onCancel, onSubmit }: AddNewSlideFormProps) {
    const form = useForm<SlideFormValues>({
        resolver: zodResolver(slideSchema),
        defaultValues: {
            title: "",
            subtitle: "",
            linkUrl: "",
            isActive: true,
        },
    })

    const onFormSubmit = (data: SlideFormValues) => {
        console.log("Slide Data:", data)
        onSubmit?.(data)
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onFormSubmit)} className="grid gap-4 py-4">
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Slide Title</FormLabel>
                            <FormControl>
                                <Input {...field} placeholder="e.g. New Collection Arrival" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="subtitle"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Subtitle/Description</FormLabel>
                            <FormControl>
                                <Input {...field} placeholder="e.g. Shop the latest trends now" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="linkUrl"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Link URL</FormLabel>
                            <FormControl>
                                <Input {...field} placeholder="/products/new-collection" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid gap-2">
                    <FormLabel>Slide Image</FormLabel>
                    <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 flex flex-col items-center justify-center gap-2 hover:bg-gray-50/50 transition-colors cursor-pointer h-32">
                        <Upload className="h-6 w-6 text-gray-400" />
                        <span className="text-sm text-gray-500">Upload Banner Image (1920x600)</span>
                    </div>
                </div>

                <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Switch
                                    id="active-status"
                                    label="Active Status"
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    className="py-2 bg-transparent px-0"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex justify-end gap-2 mt-4">
                    <Button variant="outline" type="button" onClick={onCancel}>
                        Cancel
                    </Button>
                    <Button type="submit">Add Slide</Button>
                </div>
            </form>
        </Form>
    )
}
