import {MDXRemoteSerializeResult} from "next-mdx-remote";

export interface ChatTypes {
  _id: string;
  user: string;
  title: string;
  messages: {
    content: string | MDXRemoteSerializeResult;
    role: "system" | "user" | "assistant";
  }[];
  hasArchive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
