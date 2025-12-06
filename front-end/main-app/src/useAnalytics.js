import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function useAnalytics() {
  const location = useLocation();

  useEffect(() => {
    if (window.gtag) {
      window.gtag("config", "G-6C5KMHEPJL", {
        page_path: location.pathname + location.search,
      });
    }
  }, [location]);
}
