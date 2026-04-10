import RandomSectionCards from "./RandomSectionCards";

type RandomSectionCardsDarkProps = {
  wireframeMode?: boolean;
};

export default function RandomSectionCardsDark({ wireframeMode = false }: RandomSectionCardsDarkProps) {
  return <RandomSectionCards wireframeMode={wireframeMode} theme="dark" darkOnly={true} />;
}
