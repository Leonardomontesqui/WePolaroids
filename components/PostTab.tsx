import { HeartIcon } from "@radix-ui/react-icons";
import { Heart } from "lucide-react";
import React from "react";

export default function PostTab(post: Post) {
  return (
    <div className="bg-white absolute md:top-4 md:right-4 w-80 z-50 top-4 mr-4 ml-5 flex flex-col items-center rounded-lg p-4 gap-2 shadow-lg">
      <img src={post.image_url} className="rounded-lg" />
      <div className="text-[40px] font-semibold text-left w-full leading-tight">
        {post.title}
      </div>
      <div className="text-left w-full">{post.description}</div>
      <div className="justify-left w-full">
        <Heart />
      </div>
    </div>
  );
}
