"use server";

import { reportFormSchema } from "@/lib/schema";
import { z } from "zod";
import { uploadImage } from "./useUser";
import { createPost } from "./useUser";

export async function reportFormAction(
  _prevState: unknown,
  formData: FormData
) {
  const defaultValues = Object.fromEntries(formData.entries());

  try {
    const data = reportFormSchema.parse({
      ...defaultValues,
      tags: formData.getAll("tags"),
      image: formData.get("image") as File,
    });
    console.log("hi");
    const uploadedImageUrl = await uploadImage(data.image);
    await createPost({
      title: data.title,
      tags: data.tags,
      description: data.description,
      image: uploadedImageUrl ? uploadedImageUrl : "",
      location: data.location.split(",").map(Number) as [number, number],
    });
    // This simulates a slow response like a form submission.
    // Replace this with your actual form submission logic.
    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log(data);

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
    if (error instanceof z.ZodError) {
      console.log(error.flatten().fieldErrors);
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
