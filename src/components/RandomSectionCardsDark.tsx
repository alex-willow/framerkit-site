import RandomSectionCards from "./RandomSectionCards";

type RandomSectionCardsDarkProps = {
  wireframeMode?: boolean;
  isAdmin?: boolean;
};

export default function RandomSectionCardsDark({
  wireframeMode = false,
  isAdmin = false,
}: RandomSectionCardsDarkProps) {
  return (
    <RandomSectionCards
      wireframeMode={wireframeMode}
      theme="dark"
      darkOnly={true}
      isAdmin={isAdmin}
    />
  );
}
