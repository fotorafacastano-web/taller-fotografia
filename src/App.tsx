import { useState } from "react";
import HeroEditorial from "./HeroEditorial";
import DirectorSection from "./DirectorSection";

export default function App() {
  const [cover, setCover] = useState(false);

  return (
    <main>
      <HeroEditorial onSequenceComplete={() => setCover(true)} />
      <DirectorSection cover={cover} />
    </main>
  );
}
