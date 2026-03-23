import type { Metadata } from "next";
import GalleryClient from "@/components/panel/gallery/GalleryClient";

export const metadata: Metadata = { title: "Fotoğraf Galerisi" };

export default function GalleryPage() {
  return <GalleryClient />;
}
