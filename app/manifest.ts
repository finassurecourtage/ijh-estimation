import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Estimation de volume — IJH Transport",
    short_name: "IJH Estimation",
    description:
      "Estimez le volume de votre déménagement vers Israël en quelques photos.",
    start_url: "/",
    display: "standalone",
    background_color: "#f4f6f8",
    theme_color: "#1e3a5f",
    icons: [
      {
        src: "/ijh-logo.png",
        sizes: "1200x1200",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
