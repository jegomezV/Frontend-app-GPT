import React, {DetailedHTMLProps, OlHTMLAttributes} from "react";

interface HeadingProps extends React.HTMLProps<HTMLHeadingElement> {
}

interface ParagraphProps extends React.HTMLProps<HTMLParagraphElement> {
}

interface ListUlProps extends React.HTMLProps<HTMLUListElement> {
}

interface ListOlProps extends DetailedHTMLProps<OlHTMLAttributes<HTMLOListElement>, HTMLOListElement> {
}

interface ListItemProps extends React.HTMLProps<HTMLLIElement> {
}

export function H1(props: HeadingProps) {
  return <h1 className="my-2 text-2xl font-bold text-white" {...props} />;
}

export function H2(props: HeadingProps) {
  return <h2 className="my-2 text-lg font-semibold text-white" {...props} />;
}

export function H3(props: HeadingProps) {
  return <h3 className="font-semibold text-purple-950 text-xl" {...props} />;
}

export function P(props: ParagraphProps) {
  return <p className="text-base leading-6 text-white" {...props} />;
}

export function Ul(props: ListUlProps) {
  return <ul className="list-inside list-disc text-base leading-6 text-white" {...props} />;
}

export function Ol(props: ListOlProps) {
  return <ol className="list-inside list-decimal text-base leading-6 text-white" {...props} />;
}

export function Li(props: ListItemProps) {
  return <li className="my-1 text-base leading-6" {...props} />;
}

const DesignSystem = {
  H1,
  H2,
  H3,
  P,
  Ul,
  Ol,
  Li,
};

export default DesignSystem;
