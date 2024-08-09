import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Helmet } from "react-helmet";

const FaviconAndTitleUpdater = () => {
  const location = useLocation();

  useEffect(() => {
    const updateFaviconAndTitle = () => {
      const link = document.querySelector("link[rel~='icon']");
      if (!link) {
        return;
      }

      const favicon =
        "https://www.assistfin.com/Admin/html/uploads/services/Slide3%20-%20Copy.png";
      const pathname = location.pathname;
    

      let title = pathname
        .split("/")
        .filter(Boolean) // Remove empty strings from splitting
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

      title = title || "Dashboard"; 
    console.log(title)
      link.href = favicon;
      document.title = title;
    };

    updateFaviconAndTitle();
  }, [location]);

  return (
    <Helmet>
      <link rel="icon" type="image/x-icon" href="/icons/default-icon.ico" />
    </Helmet>
  );
};

export default FaviconAndTitleUpdater;
