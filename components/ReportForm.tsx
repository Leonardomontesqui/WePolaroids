"use client";

import * as React from "react";
import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

import { reportFormAction } from "@/lib/actions";
import { Check, Upload, X } from "lucide-react";
// import Webcam from "react-webcam";

interface MarkerPosition {
  lng: number;
  lat: number;
}

const tags = [
  { id: "meh", label: "meh" },
  { id: "cool", label: "cool" },
  { id: "swaggy", label: "swaggy" },
];

export function ReportForm({
  className,
  location,
  onClose,
}: React.ComponentProps<typeof Card> & {
  onClose?: () => void;
  location: MarkerPosition;
}) {
  const [state, formAction, pending] = React.useActionState(reportFormAction, {
    defaultValues: {
      title: "",
      location: [location.lng, location.lat].join(", "),
      tags: [],
      description: "",
      image: null,
    },
    success: false,
    errors: null,
  });

  const [selectedTags, setSelectedTags] = React.useState<string[]>([]);
  const [selectedImage, setSelectedImage] = React.useState<string | null>(null);
  const [cameraImage] = React.useState<string | null>(null);

  // const webcamRef = React.useRef<Webcam>(null);

  const toggleTag = (tagId: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId]
    );
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
    }
  };

  // const handleCameraToggle = () => {
  //   setIsCameraOpen((prev) => !prev);
  // };

  // const captureImage = () => {
  //   if (webcamRef.current) {
  //     const imageSrc = webcamRef.current.getScreenshot();
  //     console.log("Captured image:", imageSrc);
  //     setCameraImage(imageSrc || null);
  //     setIsCameraOpen(false);
  //   }
  // };

  return (
    <Card className="bg-cream text-semiBlack absolute md:top-4 md:right-4 w-80 z-50 top-4 mr-4 ml-5">
      <CardHeader>
        <div className="flex justify-between items-center w-full">
          <div>
            <CardTitle>Leave your mark</CardTitle>
          </div>

          <button
            className="text-semiBlack hover:text-gray-300"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </CardHeader>
      <form action={formAction}>
        <CardContent className="flex flex-col gap-4">
          <input
            type="hidden"
            id="location"
            name="location"
            defaultValue={[location.lng, location.lat].join(", ")}
          />
          {state.success ? (
            <p className="text-green-400 flex items-center gap-2 text-sm">
              <Check className="size-4" />
              Added!
            </p>
          ) : null}
          <div className="space-y-1">
            <Label
              htmlFor="title"
              className={cn(state.errors?.title && "text-red-400")}
            >
              Caption <span aria-hidden="true">*</span>
            </Label>
            <Input
              id="title"
              name="title"
              placeholder="5 words maximum"
              className={cn(
                "bg-white border-[#E8E5E5] text-semiBlack placeholder-gray-500",
                state.errors?.title &&
                  "border-red-400 focus-visible:ring-red-400"
              )}
              disabled={pending}
              aria-invalid={!!state.errors?.title}
              aria-errormessage="error-title"
              defaultValue={state.defaultValues.title as string}
            />
            {state.errors?.title && (
              <p id="error-title" className="text-red-400 text-sm">
                {state.errors.title}
              </p>
            )}
          </div>
          <div className="space-y-1">
            <Label className={cn(state.errors?.tags && "text-red-400")}>
              Tags <span aria-hidden="true">*</span>
            </Label>
            <ScrollArea className="w-full whitespace-nowrap rounded-md bg-white border border-[#E8E5E5]">
              <div className="flex w-max space-x-2 p-2">
                {tags.map((tag) => (
                  <Badge
                    key={tag.id}
                    variant={
                      selectedTags.includes(tag.id) ? "default" : "outline"
                    }
                    className={cn(
                      "cursor-pointer",
                      selectedTags.includes(tag.id)
                        ? "bg-[#FDF47B] text-[#BD9846] hover:bg-[#FDF47B]"
                        : "bg-white hover:bg-[#E2E2E2]"
                    )}
                    onClick={() => toggleTag(tag.id)}
                  >
                    {tag.label}
                  </Badge>
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
            {selectedTags.map((tagId) => (
              <input key={tagId} type="hidden" name="tags" value={tagId} />
            ))}
            {state.errors?.tags && (
              <p id="error-tags" className="text-red-400 text-sm">
                {state.errors.tags}
              </p>
            )}
          </div>
          <div className="space-y-1">
            <Label
              htmlFor="description"
              className={cn(state.errors?.description && "text-red-400")}
            >
              Description <span aria-hidden="true">*</span>
            </Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Share your thoughts..."
              className={cn(
                "bg-white border-[#E8E5E5] text-semiBlack placeholder-gray-500",
                state.errors?.description &&
                  "border-red-400 focus-visible:ring-red-400"
              )}
              disabled={pending}
              aria-invalid={!!state.errors?.description}
              aria-errormessage="error-description"
              defaultValue={state.defaultValues.description as string}
            />
            {state.errors?.description && (
              <p id="error-description" className="text-red-400 text-sm">
                {state.errors.description}
              </p>
            )}
          </div>
          <div className="space-y-1">
            <Label
              htmlFor="image"
              className={cn(state.errors?.image && "text-red-400")}
            >
              Image <span aria-hidden="true">*</span>
            </Label>
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="image"
                className="flex flex-col items-center justify-center w-full h-64 border-2 border-[#E8E5E5] border-dashed rounded-lg cursor-pointer bg-white hover:bg-gray-100"
              >
                {selectedImage || cameraImage ? (
                  <img
                    src={selectedImage || cameraImage || ""}
                    alt="Selected"
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center pt-5 pb-6 ">
                    <Upload className="w-8 h-8 mb-4 text-gray-400 " />
                    <p className="mb-2 text-sm text-gray-400">
                      <span className="font-semibold">Click to upload</span> or
                      drag and drop
                    </p>
                    <p className="text-xs text-gray-500">
                      PNG, JPG/JPEG or WebP (MAX. 5MB)
                    </p>
                  </div>
                )}
                <Input
                  id="image"
                  name="image"
                  type="file"
                  accept="image/png, image/jpeg, image/jpg, image/webp"
                  className="hidden"
                  onChange={handleImageChange}
                  disabled={pending}
                />
              </label>
            </div>
            {/* <Button
              type="button"
              variant="outline"
              className="mt-4 border-[#E8E5E5] text-black hover:bg-[#ECECEC] w-full"
              onClick={handleCameraToggle}
            >
              <Camera className="mr-2" /> Open Camera
            </Button> */}
            {/* {isCameraOpen && (
              <div className="relative mt-4 rounded-lg bg-gray-800 p-2">
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  width="100%"
                  height="auto"
                  videoConstraints={{
                    facingMode: "environment",
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-gray-100 bg-gray-700 border-gray-600 hover:bg-gray-600"
                  onClick={captureImage}
                >
                  Capture Image
                </Button>
              </div>
            )} */}
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
            disabled={pending}
            className="w-full bg-blue hover:bg-[#4D58D1] text-white"
          >
            {pending ? "Sharing..." : "Share"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
