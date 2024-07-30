'use client'
import {MDXRemote, MDXRemoteSerializeResult} from 'next-mdx-remote';
import DesignSystem from "./DesingSystem";

interface RenderMdxProps {
  mdxSource: MDXRemoteSerializeResult;
}

export default function RenderMdx({mdxSource}: RenderMdxProps) {

  return (
    <MDXRemote {...mdxSource} components={{
      h1: DesignSystem.H1,
      h2: DesignSystem.H2,
      h3: DesignSystem.H3,
      p: DesignSystem.P,
      ul: DesignSystem.Ul,
      ol: DesignSystem.Ol,
      li: DesignSystem.Li,
    }}/>
  );
}
