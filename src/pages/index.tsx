import Head from "next/head";
import Image from "next/image";
import styles from "@/styles/Home.module.scss";
import HomeHero from "@/components/HomeHero";
import HomeListAll from "@/components/HomeListAll";

// discord Invitation
import { useEffect } from "react";
import { toast } from "sonner";
import { FaDiscord, FaDonate } from "react-icons/fa";
import useDeviceSize from "@/Utils/useDeviceSize";
// discord Invitation

export default function Home() {
  // discord Invitation
  const { isMobile, isTablet, isDesktop, isTV } = useDeviceSize();
  useEffect(() => {
    (isDesktop || isTV) &&
      (toast.info(
        <a href="/donation" className="discordInvitation">
          <FaDonate />
          Donate to the Rive community
          <FaDonate />
        </a>,
      ),
      toast.info(
        <a
          target="_blank"
          href="https://discord.gg/6xJmJja8fV"
          className="discordInvitation"
        >
          <FaDiscord />
          Join Rive community on Discord
          <FaDiscord />
        </a>,
      ));
  }, [isMobile, isTablet, isDesktop, isTV]);
  // discord Invitation
  return (
    <div className={styles.Home}>
      <HomeHero />
      <HomeListAll />
    </div>
  );
}
