import type { User } from "@prisma/client";
import React from "react";

interface IPostProps {
  post: {
    user: User;
    id: string;
    body: string;
    createdAt: Date;
  };
}

export const Post: React.FC<IPostProps> = ({ post }) => {
  return (
    <div>
      <div>{post.user.name}</div>
      <div>{post.body}</div>
      <div>{post.createdAt.toDateString()}</div>
    </div>
  );
};
