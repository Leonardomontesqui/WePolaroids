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
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton
} from '@clerk/nextjs'

import { reportFormAction } from "@/lib/actions";
import { Check, Upload, X, Camera } from "lucide-react";
import Webcam from "react-webcam";

interface MarkerPosition {
  lng: number;
  lat: number;
}

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
  const [isCameraOpen, setIsCameraOpen] = React.useState(false);
  const [cameraImage, setCameraImage] = React.useState<string | null>(null);

  const webcamRef = React.useRef<Webcam>(null);

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

  const handleCameraToggle = () => {
    setIsCameraOpen((prev) => !prev);
  };

  const captureImage = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        const imageBlob = dataURItoBlob(imageSrc);
        console.log(imageBlob);
  
        // Now you can pass the imageBlob wherever it's needed, such as uploading it
        setCameraImage(URL.createObjectURL(imageBlob));
  
        setIsCameraOpen(false);
      }
    }
  };
  

  const dataURItoBlob = (dataURI: string) => {
    const byteString = atob(dataURI.split(',')[1]);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const uintArray = new Uint8Array(arrayBuffer);
    
    for (let i = 0; i < byteString.length; i++) {
      uintArray[i] = byteString.charCodeAt(i);
    }
  
    // Ensure the MIME type matches the file extension
    const mimeType = dataURI.split(';')[0].split(':')[1]; // Extract MIME type from base64 string
    return new Blob([arrayBuffer], { type: mimeType }); 
  };

  return (
    <Card
      className={cn("w-full max-w-md bg-gray-900 text-gray-100", className)}
    >
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-gray-100">Share something</CardTitle>
            {/* <CardDescription className="text-gray-400">
              Share a cool moment
            </CardDescription> */}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-400 hover:text-gray-100"
            aria-label="Close form"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <form action={formAction}>
        <CardContent className="flex flex-col gap-4">
          {state.success ? (
            <p className="text-green-400 flex items-center gap-2 text-sm">
              <Check className="size-4" />
              Your report has been submitted. Thank you for your contribution.
            </p>
          ) : null}
          <div className="space-y-1">
            <Label
              htmlFor="title"
              className={cn(state.errors?.title && "text-red-400")}
            >
              Title <span aria-hidden="true">*</span>
            </Label>
            <Input
              id="title"
              name="title"
              placeholder="Brief title of the issue"
              className={cn(
                "bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-500",
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
            <Label
              htmlFor="location"
              className={cn(state.errors?.location && "text-red-400")}
            >
              Location <span aria-hidden="true">*</span>
            </Label>
            <Input
              id="location"
              name="location"
              placeholder="123 Main St, City, State"
              className={cn(
                "bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-500",
                state.errors?.location &&
                  "border-red-400 focus-visible:ring-red-400"
              )}
              disabled={pending}
              aria-invalid={!!state.errors?.location}
              aria-errormessage="error-location"
              defaultValue={state.defaultValues.location as string}
            />
            {state.errors?.location && (
              <p id="error-location" className="text-red-400 text-sm">
                {state.errors.location}
              </p>
            )}
          </div>
          <div className="space-y-1">
            <Label className={cn(state.errors?.tags && "text-red-400")}>
              Tags <span aria-hidden="true">*</span>
            </Label>
            <ScrollArea className="w-full whitespace-nowrap rounded-md border border-gray-700">
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
                        ? "bg-blue-600 hover:bg-blue-700"
                        : "bg-gray-800 hover:bg-gray-700"
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
              placeholder="Describe the issue you're reporting..."
              className={cn(
                "bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-500",
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
                className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-700 border-dashed rounded-lg cursor-pointer bg-gray-800 hover:bg-gray-700"
              >
                {selectedImage || cameraImage ? (
                  <img
                  src={selectedImage || cameraImage || ""}
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
            <Button
              type="button"
              variant="outline"
              className="mt-4 border-gray-700 text-black hover:bg-gray-700"
              onClick={handleCameraToggle}
            >
              <Camera className="mr-2" /> Open Camera
            </Button>
            {isCameraOpen && (
              <div className="relative mt-4 rounded-lg bg-gray-800 p-2">
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/png"
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
            )}
            {state.errors?.image && (
              <p id="error-image" className="text-red-400 text-sm">
                {state.errors.image}
              </p>
            )}
          </div>
          
        </CardContent>
        <CardFooter>
          <ClerkProvider>
          <SignedOut>
          <SignInButton>
  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2">
    Sign In
  </button>
</SignInButton>
          </SignedOut>
          <SignedIn>
          <Button
            type="submit"
            disabled={pending}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            {pending ? "Submitting..." : "Submit Report"}
          </Button>
          <UserButton />
          </SignedIn>
          </ClerkProvider>
        </CardFooter>
      </form>
    </Card>
  );
}

