"use server";

import { reportFormSchema } from "@/lib/schema";
import { z } from "zod";
import { uploadImage, createPost } from "./useUser";

export async function reportFormAction(
  _prevState: unknown,
  formData: FormData
) {
  console.log("Form data image", formData.get("image"));
  console.log("Action started");

  const defaultValues = Object.fromEntries(formData.entries());
  console.log("Form data:", defaultValues);

  try {
    const data = reportFormSchema.parse({
      ...defaultValues,
      tags: formData.getAll("tags"),
      image: formData.get("image") as File,
    });
    console.log("Data parsed:", data);

    console.log("Uploading image...");
    const uploadedImageUrl = await uploadImage(data.image);
    console.log("Image uploaded:", uploadedImageUrl);

    console.log("Creating post...");
    await createPost({
      title: data.title,
      tags: data.tags,
      description: data.description,
      image_url: uploadedImageUrl ? uploadedImageUrl : "",
      location: data.location.split(",").map(Number) as [number, number],
    });
    console.log("Post created");

    return {
      defaultValues: {
        location: "",
        title: "",
        tags: [],
        description: "",
        image: null,
      },
      success: true,
      errors: null,
    };
  } catch (error) {
    console.error("Action error:", error);
    if (error instanceof z.ZodError) {
      console.log("Validation errors:", error.flatten().fieldErrors);
      return {
        defaultValues,
        success: false,
        errors: Object.fromEntries(
          Object.entries(error.flatten().fieldErrors).map(([key, value]) => [
            key,
            value?.join(", "),
          ])
        ),
      };
    }

    return {
      defaultValues,
      success: false,
      errors: null,
    };
  }
}
