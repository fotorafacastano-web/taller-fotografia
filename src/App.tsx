import { useState } from "react";
import HeroEditorial from "./HeroEditorial";
import DirectorSection from "./DirectorSection";
import ManifestoSection from "./ManifestoSection";
import WorkSection from "./WorkSection";
import SpiralGallery from "./SpiralGallery";

export default function App() {
  const [cover, setCover] = useState(false);

  return (
    <main>
      <HeroEditorial onSequenceComplete={() => setCover(true)} />
      <DirectorSection cover={cover} />
      <ManifestoSection />
      <WorkSection />
      <SpiralGallery />
    </main>
  );
}
