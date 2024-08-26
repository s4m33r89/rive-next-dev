import { useState, useEffect } from "react";
import styles from "@/styles/Settings.module.scss";
import { SiDart, SiFlutter, SiNextdotjs, SiPwa, SiTauri } from "react-icons/si";

const LoginPage = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>();
  useEffect(() => {
    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    });
  }, []);
  const handleDownload = async () => {
    if (deferredPrompt !== null && deferredPrompt !== undefined) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setDeferredPrompt(null);
      }
    }
  };
  return (
    <div className={`${styles.settingsPage} ${styles.authPage}`}>
      <div className={styles.logo}>
        <img
          src="/images/logo.svg"
          alt="logo"
          data-tooltip-id="tooltip"
          data-tooltip-content="Rive"
        />
        <p>Your Personal Streaming Oasis</p>
      </div>
      <div className={styles.settings}>
        <h1 className={`${styles.downloadsHeading}`}>Downloads</h1>
        <div className={`${styles.group2} ${styles.downloadsGroup}`} id="pwa">
          <h1>Rive - PWA</h1>
          <p>
            Tech Stack : <SiNextdotjs className={styles.highlight} />{" "}
            <SiPwa className={styles.highlight} />
          </p>
          <p>
            Supported Devices :{" "}
            <span className={styles.highlight}> All Devices </span>
          </p>
          <p>
            This will install app for all device using very low space and data
          </p>
          <p>
            Download using Brave Browser or Chrome if you have ad-blocker on the
            chrome account, for ad-free experience
          </p>
          <p className={styles.highlight}>
            If it doesn't download, refresh this page and try again
          </p>
          {/* <p>To download movies/tv shows, go to it's watch page, and use extensions like FetchV</p> */}
          <h4
            className={styles.downloadButton}
            onClick={handleDownload}
            data-tooltip-id="tooltip"
            data-tooltip-content="Download PWA"
          >
            Download
          </h4>
        </div>
        <div
          className={`${styles.group2} ${styles.downloadsGroup}`}
          id="flutter"
        >
          <h1>Rive - Flutter</h1>
          <p>
            Tech Stack : <SiDart className={styles.highlight} />{" "}
            <SiFlutter className={styles.highlight} />
          </p>
          <p>
            Supported Devices :{" "}
            <span className={styles.highlight}>
              {" "}
              Android, IOS , Windows, Linux, MacOs, TVs{" "}
            </span>
          </p>
          <p>This will install light-weight app for all devices</p>
          <p className={styles.highlight}>Completely AD-free apps</p>
          {/* <p>To download movies/tv shows, go to it's watch page, and use extensions like FetchV</p> */}
          <a
            href="https://drive.proton.me/urls/79691JYEB4#3WXjfaTWJVUK"
            target="_blank"
            className={styles.downloadButton}
            data-tooltip-id="tooltip"
            data-tooltip-content="Download Rive Flutter Apps"
          >
            Download
          </a>
        </div>
        <div className={`${styles.group2} ${styles.downloadsGroup}`} id="tauri">
          <h1>RIve - Tauri</h1>
          <p>
            Tech Stack : <SiNextdotjs className={styles.highlight} />{" "}
            <SiTauri className={styles.highlight} />
          </p>
          <p>
            Supported Devices :{" "}
            <span className={styles.highlight}> Windows, Linux, MacOs </span>
          </p>
          <p>This will install light-weight app for desktop devices only</p>
          <p className={styles.highlight}>
            It uses your default browser or MS Edge browser
          </p>
          <p>So use Ad-Blocker in those browsers</p>
          {/* <p>To download movies/tv shows, go to it's watch page, and use extensions like FetchV</p> */}
          <a
            href="https://drive.proton.me/urls/0RKC1BF7A8#OfmfxB5YHncu"
            target="_blank"
            className={styles.downloadButton}
            data-tooltip-id="tooltip"
            data-tooltip-content="Download Rive Tauri Apps"
          >
            Download
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
