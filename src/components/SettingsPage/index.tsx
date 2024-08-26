import React, { useState, useEffect } from "react";
import styles from "@/styles/Settings.module.scss";
import Link from "next/link";
import { FaGithub, FaGlobe, FaDiscord } from "react-icons/fa";
import { getSettings, setSettings } from "@/Utils/settings";
import { usePathname } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/Utils/firebase";
import { logoutUser } from "@/Utils/firebaseUser";
import { useRouter } from "next/navigation";
import { fetchRandom } from "@/Utils/randomdata";

const SettingsPage = ({
  mode,
  theme,
  ascent_color,
  SysFFamily,
  SFFamily,
  SFSize,
  SFColor,
  SBColor,
  SBBlur,
  SOpacity,
  setMode,
  setTheme,
  fetchMode,
  proxyMode,
  setAscent_color,
  setSysFFamily,
  setSFFamily,
  setSFSize,
  setSFColor,
  setSBColor,
  setSBBlur,
  setSOpacity,
  setFetchMode,
  setProxyMode,
}: any) => {
  const [user, setUser] = useState<any>(false);
  const [loading, setLoading] = useState(true);
  const { push } = useRouter();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      // console.log({ user });
      if (user) {
        setUser(user);
        setLoading(false);
      } else {
        setUser(false);
        setLoading(false);
      }
    });
  }, []);
  const handleSelect = ({ type, value }: any) => {
    const prevVal = {
      mode,
      theme,
      ascent_color,
      SysFFamily,
      SFFamily,
      SFSize,
      SFColor,
      SBColor,
      SBBlur,
      SOpacity,
      fetchMode,
      proxyMode,
    };
    if (type === "mode") setSettings({ values: { ...prevVal, mode: value } });
    if (type === "theme") setSettings({ values: { ...prevVal, theme: value } });
    if (type === "SysFFamily")
      setSettings({ values: { ...prevVal, SysFFamily: value } });
    if (type === "SFFamily")
      setSettings({ values: { ...prevVal, SFFamily: value } });
    if (type === "SFColor")
      setSettings({ values: { ...prevVal, SFColor: value } });
    if (type === "SFSize")
      setSettings({ values: { ...prevVal, SFSize: value } });
    if (type === "SBColor")
      setSettings({ values: { ...prevVal, SBColor: value } });
    if (type === "SBBlur")
      setSettings({ values: { ...prevVal, SBBlur: value } });
    if (type === "SOpacity")
      setSettings({ values: { ...prevVal, SOpacity: value } });
    if (type === "ascent_color")
      setSettings({ values: { ...prevVal, ascent_color: value } });
    if (type === "fetchMode")
      setSettings({ values: { ...prevVal, fetchMode: value } });
    if (type === "proxyMode")
      setSettings({ values: { ...prevVal, proxyMode: value } });
  };
  const handleRandom = async () => {
    const res = await fetchRandom();
    console.log({ res });
    if (res?.type && res?.id) {
      push(`/detail?type=${res.type}&id=${res.id}`);
    }
  };
  return (
    <div className={`${styles.settingsPage} ${styles.authPage}`}>
      <div className={styles.logo}>
        <img src="/images/logo.svg" alt="logo" />
        <p>Your Personal Streaming Oasis</p>
      </div>
      <div className={styles.settings}>
        <h1>Account</h1>
        {user ? (
          <div className={styles.group}>
            <>
              <p className={styles.logout} onClick={() => logoutUser()}>
                Logout
              </p>
              {/* <Link href="/signup">Signup</Link> */}
            </>
            <h4 className={styles.profileCard}>Hi There!</h4>
          </div>
        ) : (
          <div className={styles.group}>
            <>
              <Link href="/login">Login</Link>
              <Link href="/signup">Signup</Link>
            </>
            <h4 className={styles.profileCard}>Login to sync to cloud</h4>
          </div>
        )}
        <h1>Appearence</h1>
        <div className={styles.group}>
          <div>
            <label htmlFor="mode">Mode</label>
            <select
              name="mode"
              id="mode"
              value={mode}
              onChange={(e) => {
                setMode(e.target.value);
                handleSelect({ type: "mode", value: e.target.value });
              }}
            >
              <option value="system" defaultChecked>
                System
              </option>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>
          {/* <div>
            <label htmlFor="theme">Theme</label>
            <select name="theme" id="theme" value={theme} onChange={(e) => {setTheme(e.target.value);handleSelect({type:"theme",value:e.target.value})}}>
              <option value="liquidate" defaultChecked>Liquidate</option>
              <option value="normal">Normal</option>
            </select>
          </div> */}
          <div>
            <label htmlFor="ascent">Ascent Color</label>
            <select
              name="ascent"
              id="ascent"
              value={ascent_color}
              onChange={(e) => {
                setAscent_color(e.target.value);
                handleSelect({ type: "ascent_color", value: e.target.value });
              }}
            >
              <option value="gold" defaultChecked>
                Gold
              </option>
              <option value="#f44336">Red</option>
              <option value="#e91e63">Pink</option>
              <option value="#9c27b0">Purple</option>
              <option value="#673ab7">Deep Purple</option>
              <option value="#3f51b5">Indigo</option>
              <option value="#2196f3">Blue</option>
              <option value="#03a9f4">Light Blue</option>
              <option value="#00bcd4">Cyan</option>
              <option value="#009688">Teal</option>
              <option value="#4caf50">Green</option>
              <option value="#8bc34a">Light Green</option>
              <option value="#ffeb3b">Yellow</option>
              <option value="#ffc107">Amber</option>
              <option value="#ff9800">Orange</option>
              <option value="#ff5722">Deep Orange</option>
              <option value="#795548">Brown</option>
            </select>
          </div>
          <div>
            <label htmlFor="SysFFamily">System Font Family</label>
            <select
              name="SysFFamily"
              id="SFFamily"
              value={SysFFamily}
              onChange={(e) => {
                setSysFFamily(e.target.value);
                handleSelect({ type: "SysFFamily", value: e.target.value });
              }}
            >
              <option value="Abel">Abel</option>
              <option value="serif">Serif</option>
              <option value="Ubuntu">Ubuntu</option>
              <option value="cursive">Cursive</option>
              <option value="Helvetica">Helvetica</option>
              <option value="Montserrat">Montserrat</option>
              <option value="system-ui">System UI</option>
              <option value="Open Sans">Open Sans</option>
              <option value="Roboto Mono" defaultChecked>
                Roboto Mono
              </option>
            </select>
          </div>
        </div>
        <h1>Subtitle</h1>
        <div className={styles.group}>
          <div>
            <label htmlFor="SFFamily">Subtitle Font Family</label>
            <select
              name="SFFamily"
              id="SFFamily"
              value={SFFamily}
              onChange={(e) => {
                setSFFamily(e.target.value);
                handleSelect({ type: "SFFamily", value: e.target.value });
              }}
            >
              <option value="Abel">Abel</option>
              <option value="serif">Serif</option>
              <option value="Ubuntu">Ubuntu</option>
              <option value="cursive">Cursive</option>
              <option value="Helvetica">Helvetica</option>
              <option value="Montserrat">Montserrat</option>
              <option value="system-ui">System UI</option>
              <option value="Open Sans">Open Sans</option>
              <option value="Roboto Mono" defaultChecked>
                Roboto Mono
              </option>
            </select>
          </div>
          <div>
            <label htmlFor="SFSize">Subtitle Font Size</label>
            <select
              name="SFSize"
              id="SFSize"
              value={SFSize}
              onChange={(e) => {
                setSFSize(e.target.value);
                handleSelect({ type: "SFSize", value: e.target.value });
              }}
            >
              <option value="12px">50%</option>
              <option value="18px">75%</option>
              <option value="24px" defaultChecked>
                100%
              </option>
              <option value="36px">150%</option>
              <option value="42px">175%</option>
              <option value="48px">200%</option>
              <option value="72px">300%</option>
            </select>
          </div>
          <div>
            <label htmlFor="SFColor">Subtitle Font Color</label>
            <select
              name="SFColor"
              id="SFColor"
              value={SFColor}
              onChange={(e) => {
                setSFColor(e.target.value);
                handleSelect({ type: "SFColor", value: e.target.value });
              }}
            >
              <option value="gold" defaultChecked>
                Gold
              </option>
              <option value="#f44336">Red</option>
              <option value="#e91e63">Pink</option>
              <option value="#9c27b0">Purple</option>
              <option value="#673ab7">Deep Purple</option>
              <option value="#3f51b5">Indigo</option>
              <option value="#2196f3">Blue</option>
              <option value="#03a9f4">Light Blue</option>
              <option value="#00bcd4">Cyan</option>
              <option value="#009688">Teal</option>
              <option value="#4caf50">Green</option>
              <option value="#8bc34a">Light Green</option>
              <option value="#ffeb3b">Yellow</option>
              <option value="#ffc107">Amber</option>
              <option value="#ff9800">Orange</option>
              <option value="#ff5722">Deep Orange</option>
              <option value="#795548">Brown</option>
              <option value="#000000">Black</option>
              <option value="#ffffff">White</option>
            </select>
          </div>
          <div>
            <label htmlFor="SBColor">Subtitle Background Color</label>
            <select
              name="SBColor"
              id="SBColor"
              value={SBColor}
              onChange={(e) => {
                setSBColor(e.target.value);
                handleSelect({ type: "SBColor", value: e.target.value });
              }}
            >
              <option value="transparent" defaultChecked>
                Transparent
              </option>
              <option value="gold">Gold</option>
              <option value="#f44336">Red</option>
              <option value="#e91e63">Pink</option>
              <option value="#9c27b0">Purple</option>
              <option value="#673ab7">Deep Purple</option>
              <option value="#3f51b5">Indigo</option>
              <option value="#2196f3">Blue</option>
              <option value="#03a9f4">Light Blue</option>
              <option value="#00bcd4">Cyan</option>
              <option value="#009688">Teal</option>
              <option value="#4caf50">Green</option>
              <option value="#8bc34a">Light Green</option>
              <option value="#ffeb3b">Yellow</option>
              <option value="#ffc107">Amber</option>
              <option value="#ff9800">Orange</option>
              <option value="#ff5722">Deep Orange</option>
              <option value="#795548">Brown</option>
              <option value="#000000">Black</option>
              <option value="#ffffff">White</option>
            </select>
          </div>
          <div>
            <label htmlFor="SBBlur">Subtitle Background Blurness</label>
            <select
              name="SBBlur"
              id="SBBlur"
              value={SBBlur}
              onChange={(e) => {
                setSBBlur(e.target.value);
                handleSelect({ type: "SBBlur", value: e.target.value });
              }}
            >
              <option value="0" defaultChecked>
                0%
              </option>
              <option value="0.5rem">25%</option>
              <option value="1.5rem">50%</option>
              <option value="2rem">75%</option>
              <option value="3rem">100%</option>
            </select>
          </div>
          <div>
            <label htmlFor="SOpacity">Subtitle Opacity</label>
            <select
              name="SOpacity"
              id="SOpacity"
              value={SOpacity}
              onChange={(e) => {
                setSOpacity(e.target.value);
                handleSelect({ type: "SOpacity", value: e.target.value });
              }}
            >
              <option value="0%">0%</option>
              <option value="25%">25%</option>
              <option value="50%">50%</option>
              <option value="75%">75%</option>
              <option value="100%" defaultChecked>
                100%
              </option>
            </select>
          </div>
        </div>
        <h1
          data-tooltip-id="tooltip"
          data-tooltip-html="Tweak these settings, if you're getting only loading screens on any page"
        >
          Developer Center
        </h1>
        <div className={styles.group}>
          <div>
            <label
              htmlFor="fetchMode"
              data-tooltip-id="tooltip"
              data-tooltip-html="Fetch Mode for API Requests </br> Choose Server-side if TMDB is blocked by your ISP"
            >
              Fetch Mode
            </label>
            <select
              name="fetchMode"
              id="fetchMode"
              value={fetchMode}
              onChange={(e) => {
                setFetchMode(e.target.value);
                handleSelect({ type: "fetchMode", value: e.target.value });
              }}
            >
              <option value="server" defaultChecked>
                Server-side
              </option>
              <option value="client">Client-side</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="proxyMode"
              data-tooltip-id="tooltip"
              data-tooltip-html="Proxy your API Requests </br> Choose Reverse Proxy if TMDB is blocked by your ISP"
            >
              Proxy Mode
            </label>
            <select
              name="proxyMode"
              id="proxyMode"
              value={proxyMode}
              onChange={(e) => {
                setProxyMode(e.target.value);
                handleSelect({ type: "proxyMode", value: e.target.value });
              }}
            >
              <option value="noProxy" defaultChecked>
                No Proxy
              </option>
              <option value="reverseProxy">Reverse Proxy</option>
            </select>
          </div>
        </div>
        <h1>App Center</h1>
        <div className={styles.group}>
          <Link
            href="/anime"
            data-tooltip-id="tooltip"
            data-tooltip-html="Go to Anime Page"
          >
            Anime
          </Link>
          <Link
            href="/kdrama"
            data-tooltip-id="tooltip"
            data-tooltip-html="Go to K-Drama Page"
          >
            K-Drama
          </Link>
          <Link
            href=""
            onClick={handleRandom}
            data-tooltip-id="tooltip"
            data-tooltip-html="Random Movie/ Tv Show <span class='tooltip-btn'>CTRL + SHIFT + R</span>"
          >
            Random
          </Link>
          <Link
            href="/downloads"
            data-tooltip-id="tooltip"
            data-tooltip-content="Downloads"
          >
            Download
          </Link>
          <Link
            href="/donation"
            data-tooltip-id="tooltip"
            data-tooltip-content="Donations"
          >
            Donations
          </Link>
          <Link
            href="/disclaimer"
            data-tooltip-id="tooltip"
            data-tooltip-content="Disclaimer"
          >
            Disclaimer
          </Link>
          <Link href="mailto:developer@rivestream.live">Contact Us</Link>
          <Link
            href="/recommendation"
            data-tooltip-id="tooltip"
            data-tooltip-content="More Detailed Recommendation"
          >
            Recommendation
          </Link>
          {/* <Link href="/contact">Contact Us</Link> */}
        </div>
        <h1>Links</h1>
        <div className={styles.group}>
          {/* <Link href={"https://github.com/Developabile/rive-next"}>
            <FaGithub /> Github
          </Link> */}
          <Link href={"https://discord.gg/6xJmJja8fV"}>
            <FaDiscord /> Discord
          </Link>
          <Link href={"/"}>
            <FaGlobe /> Website
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
