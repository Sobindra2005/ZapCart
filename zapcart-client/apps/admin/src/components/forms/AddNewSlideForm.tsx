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
import { Switch } from "@repo/ui/ui/switch"
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue
} from "../ui/select"
import { ExternalLink, Loader, Upload } from "lucide-react"
import DropZone from "../common/dropZone"
import { DialogClose, DialogFooter } from "@repo/ui/ui/dialog"

const slideSchema = z.object({
    title: z.string().optional(),
    subtitle: z.string().optional(),
    buttonLabel: z.string().optional(),
    buttonUrl: z.string().min(1, "Button link is required"),
    status: z.enum(["published", "draft"]),
})

type SlideFormValues = z.infer<typeof slideSchema>

interface AddNewSlideFormProps {
    isSubmitting: boolean;
    onSubmit?: (data: any) => void
}


export function AddNewSlideForm({ onSubmit, isSubmitting }: AddNewSlideFormProps) {
    const form = useForm<SlideFormValues>({
        resolver: zodResolver(slideSchema),
        defaultValues: {
            title: "",
            subtitle: "",
            buttonLabel: "",
            buttonUrl: "",
            status: "draft",
        },
    })


    const [imageFile, setImageFile] = React.useState<File | null>(null);


    const onFormSubmit = async (data: SlideFormValues) => {
        await onSubmit?.({ ...data, imageFile })
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
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Textarea {...field} placeholder="e.g. Shop the latest trends now" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid gap-2">
                    <div className="flex gap-4">
                        <FormField
                            control={form.control}
                            name="buttonLabel"
                            render={({ field }) => (
                                <FormItem className="flex-1">
                                    <FormLabel>Button Label</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="e.g. Shop Now" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="buttonUrl"
                            render={({ field }) => (
                                <FormItem className="flex-1">
                                    <FormLabel>Button Link</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="e.g. /collections/summer" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    {/* Preview Button UI */}
                    <div className="mt-2">
                        <Button
                            type="button"
                            variant="secondary"
                            className="rounded-full px-4 py-2 flex items-center gap-2 text-base font-normal"
                            onClick={() => {
                                const url = form.getValues("buttonUrl");
                                if (url) {
                                    const fullUrl = url.startsWith("http") ? url : `${window.location.origin}${url}`;
                                    window.open(fullUrl, "_blank");
                                }
                            }}
                        >
                            <ExternalLink size={18} />
                            {form.watch("buttonLabel") || "Shop Now"} <span className="mx-1">→</span> <span className="text-muted-foreground">{form.watch("buttonUrl") || '/'}</span>
                        </Button>
                    </div>
                </div>

                <div className="grid gap-2">
                    <FormLabel>Slide Image</FormLabel>
                    <DropZone
                        accept={{ "image/*": [] }}
                        multiple={false}
                        maxSize={5 * 1024 * 1024}
                        onDrop={(files) => {
                            if (files && files[0]) {
                                setImageFile(files[0]);
                            }
                        }}
                        preview
                        className="h-32 w-full"
                    />
                    <span className="text-xs text-gray-500">Upload Banner Image (1920x600)</span>
                </div>

                <div className="flex justify-end gap-2 items-center mt-4">
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>

                        <FormField
                            control={form.control}
                            name="status"
                            render={({ field }) => (
                                <FormItem className="mb-0">
                                    <FormControl>
                                        <Select
                                            value={field.value}
                                            onValueChange={field.onChange}
                                        >
                                            <SelectTrigger className="w-40">
                                                <SelectValue placeholder="Select status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="published">Published</SelectItem>
                                                <SelectItem value="draft">Draft</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? <><Loader className="animate-spin mr-2" size={18} /> Adding Slide</>  : "Add Slide"}
                        </Button>
                    </DialogFooter>
                </div>
            </form>
        </Form>
    )
}
