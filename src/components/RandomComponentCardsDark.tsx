import RandomComponentCards from "./RandomComponentCards";

type RandomComponentCardsDarkProps = {
  wireframeMode?: boolean;
  isAdmin?: boolean;
};

export default function RandomComponentCardsDark({
  wireframeMode = false,
  isAdmin = false,
}: RandomComponentCardsDarkProps) {
  return (
    <RandomComponentCards
      darkOnly={true}
      theme="dark"
      wireframeMode={wireframeMode}
      isAdmin={isAdmin}
    />
  );
}
