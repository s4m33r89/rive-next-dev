import { useState, useEffect } from "react";

type DeviceSize = {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isTV: boolean;
};

const useDeviceSize = (): DeviceSize => {
  const [deviceSize, setDeviceSize] = useState<DeviceSize>({
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    isTV: false,
  });

  useEffect(() => {
    const checkDeviceSize = () => {
      const isMobile = window.matchMedia("(max-width: 767px)").matches;
      const isTablet = window.matchMedia(
        "(min-width: 768px) and (max-width: 1023px)",
      ).matches;
      const isDesktop = window.matchMedia(
        "(min-width: 1024px) and (max-width: 1919px)",
      ).matches;
      const isTV = window.matchMedia("(min-width: 1920px)").matches;

      setDeviceSize({
        isMobile,
        isTablet,
        isDesktop,
        isTV,
      });
    };

    // Initial check
    checkDeviceSize();

    // Add event listener
    window.addEventListener("resize", checkDeviceSize);

    // Cleanup listener on unmount
    return () => window.removeEventListener("resize", checkDeviceSize);
  }, []);

  return deviceSize;
};

export default useDeviceSize;
