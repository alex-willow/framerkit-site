import { useEffect } from "react";

export default function useScrollTopOnChange(ref: React.RefObject<HTMLDivElement>, value: any) {
  useEffect(() => {
    if (ref.current) {
      ref.current.scrollTo({ top: 0 });
    }
  }, [value]);
}
