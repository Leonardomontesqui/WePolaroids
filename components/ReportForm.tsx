"use client";

import * as React from "react";
import {
  Card,
  CardTitle,
  CardHeader,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

import { reportFormAction } from "@/lib/actions";
import { Check, Upload, X } from "lucide-react";

const tags = [
  { id: "pothole", label: "Pothole" },
  { id: "park", label: "Park" },
  { id: "streetlight", label: "Streetlight" },
  { id: "graffiti", label: "Graffiti" },
  { id: "trash", label: "Trash" },
  { id: "sidewalk", label: "Sidewalk" },
  { id: "traffic", label: "Traffic" },
  { id: "noise", label: "Noise" },
];

export function ReportForm({ className }: React.ComponentProps<typeof Card>) {
  const [state, formAction, pending] = React.useActionState(reportFormAction, {
    defaultValues: {
      location: "",
      tags: [],
      description: "",
      image: null,
    },
    success: false,
    errors: null,
  });

  const [selectedImage, setSelectedImage] = React.useState<string | null>(null);
  const [selectedTags, setSelectedTags] = React.useState<string[]>([]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
    }
  };

  const handleTagSelect = (tagId: string) => {
    setSelectedTags((prev) => {
      if (prev.includes(tagId)) {
        return prev.filter((id) => id !== tagId);
      } else {
        return [...prev, tagId];
      }
    });
  };

  const removeTag = (tagId: string) => {
    setSelectedTags((prev) => prev.filter((id) => id !== tagId));
  };

  return (
    <Card
      className={cn("w-full max-w-md bg-gray-900 text-gray-100", className)}
    >
      <CardHeader>
        <CardTitle className="text-gray-100">Report an Issue</CardTitle>
        <CardDescription className="text-gray-400">
          Help us improve your community by reporting issues you encounter.
        </CardDescription>
      </CardHeader>
      <form action={formAction}>
        <CardContent className="flex flex-col gap-6">
          {state.success ? (
            <p className="text-green-400 flex items-center gap-2 text-sm">
              <Check className="size-4" />
              Your report has been submitted. Thank you for your contribution.
            </p>
          ) : null}
          <div
            className="group/field grid gap-2"
            data-invalid={!!state.errors?.location}
          >
            <Label
              htmlFor="location"
              className="group-data-[invalid=true]/field:text-red-400"
            >
              Location <span aria-hidden="true">*</span>
            </Label>
            <Input
              id="location"
              name="location"
              placeholder="123 Main St, City, State"
              className="bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-500 group-data-[invalid=true]/field:border-red-400 focus-visible:ring-gray-500"
              disabled={pending}
              aria-invalid={!!state.errors?.location}
              aria-errormessage="error-location"
              defaultValue={
                typeof state.defaultValues.location === "string"
                  ? state.defaultValues.location
                  : ""
              }
            />
            {state.errors?.location && (
              <p id="error-location" className="text-red-400 text-sm">
                {state.errors.location}
              </p>
            )}
          </div>
          <div
            className="group/field grid gap-2"
            data-invalid={!!state.errors?.tags}
          >
            <Label className="group-data-[invalid=true]/field:text-red-400">
              Tags <span aria-hidden="true">*</span>
            </Label>
            <Select onValueChange={handleTagSelect}>
              <SelectTrigger className="w-full bg-gray-800 border-gray-700 text-gray-100">
                <SelectValue placeholder="Select tags" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                {tags.map((tag) => (
                  <SelectItem
                    key={tag.id}
                    value={tag.id}
                    className="text-gray-100"
                  >
                    {tag.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <ScrollArea className="h-24 w-full rounded-md border border-gray-700 p-2">
              <div className="flex flex-wrap gap-2">
                {selectedTags.map((tagId) => (
                  <div
                    key={tagId}
                    className="bg-gray-700 text-gray-100 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                  >
                    {tags.find((t) => t.id === tagId)?.label}
                    <button
                      type="button"
                      onClick={() => removeTag(tagId)}
                      className="text-gray-400 hover:text-gray-200"
                    >
                      <X className="h-3 w-3" />
                    </button>
                    <input type="hidden" name="tags" value={tagId} />
                  </div>
                ))}
              </div>
            </ScrollArea>
            {state.errors?.tags && (
              <p id="error-tags" className="text-red-400 text-sm">
                {state.errors.tags}
              </p>
            )}
          </div>
          <div
            className="group/field grid gap-2"
            data-invalid={!!state.errors?.description}
          >
            <Label
              htmlFor="description"
              className="group-data-[invalid=true]/field:text-red-400"
            >
              Description <span aria-hidden="true">*</span>
            </Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Describe the issue you're reporting..."
              className="bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-500 group-data-[invalid=true]/field:border-red-400 focus-visible:ring-gray-500"
              disabled={pending}
              aria-invalid={!!state.errors?.description}
              aria-errormessage="error-description"
              defaultValue={
                typeof state.defaultValues.description === "string"
                  ? state.defaultValues.description
                  : ""
              }
            />
            {state.errors?.description && (
              <p id="error-description" className="text-red-400 text-sm">
                {state.errors.description}
              </p>
            )}
          </div>
          <div
            className="group/field grid gap-2"
            data-invalid={!!state.errors?.image}
          >
            <Label
              htmlFor="image"
              className="group-data-[invalid=true]/field:text-red-400"
            >
              Image <span aria-hidden="true">*</span>
            </Label>
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="image"
                className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-700 border-dashed rounded-lg cursor-pointer bg-gray-800 hover:bg-gray-700"
              >
                {selectedImage ? (
                  <img
                    src={selectedImage}
                    alt="Selected"
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-4 text-gray-400" />
                    <p className="mb-2 text-sm text-gray-400">
                      <span className="font-semibold">Click to upload</span> or
                      drag and drop
                    </p>
                    <p className="text-xs text-gray-500">
                      PNG, JPG or WebP (MAX. 5MB)
                    </p>
                  </div>
                )}
                <Input
                  id="image"
                  name="image"
                  type="file"
                  accept="image/png, image/jpeg, image/webp"
                  className="hidden"
                  onChange={handleImageChange}
                  disabled={pending}
                />
              </label>
            </div>
            {state.errors?.image && (
              <p id="error-image" className="text-red-400 text-sm">
                {state.errors.image}
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            size="sm"
            disabled={pending}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {pending ? "Submitting..." : "Submit Report"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
