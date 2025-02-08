import { Post } from "@/lib/types";
import { X } from "lucide-react";
import React from "react";

export default function PostTab({
  post,
  setSelectedPost,
}: {
  post: Post;
  setSelectedPost: (post: Post | null) => void;
}) {
  return (
    <div className="bg-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 md:top-4 md:right-4 md:translate-x-0 md:translate-y-0 md:left-auto w-80 z-50 flex flex-col items-center rounded-lg p-4 gap-2 shadow-lg">
      <header className="w-full">
        <button className="float-right" onClick={() => setSelectedPost(null)}>
          <X color="#7a7a7a" />
        </button>
      </header>
      <div className="w-full h-[380px]">
        <img src={post.image_url} className="rounded-lg h-full w-full" />
      </div>
      <div className="text-[40px] font-semibold text-left w-full leading-tight">
        {post.title}
      </div>
      <div className="text-left w-full">{post.description}</div>
    </div>
  );
}
