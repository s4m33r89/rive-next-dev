import { useState, useEffect } from "react";
import styles from "@/styles/Settings.module.scss";
import {
  SiCloudflare,
  SiCloudflarepages,
  SiFirebase,
  SiHostinger,
} from "react-icons/si";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const LoginPage = () => {
  const { push } = useRouter();
  const handleRedirectToWallets = () => {
    push("/wallets");
  };
  return (
    <div
      className={`${styles.settingsPage} ${styles.authPage} ${styles.donation}`}
    >
      <div
        className={styles.logo}
        onClick={(e) => {
          navigator.clipboard.writeText(
            "44rCACssPB5hEquN7ZEqg5fFXXchjWjNnLAyTPk2ubKaJwA8ViaawLwLeYBNbQwSopNJD1bKibcJgUPJmXTC48vj6YtLXMB",
          );
          toast.success("Wallet Address copied to clipboard!");
        }}
      >
        <img
          src="/wallets/Monero.jpg"
          alt="logo"
          data-tooltip-id="tooltip"
          data-tooltip-content="Rive's Monero (XMR) Wallet"
        />
        <p
          className={styles.walletAdd}
          data-tooltip-id="tooltip"
          data-tooltip-content="44rCACssPB5hEquN7ZEqg5fFXXchjWjNnLAyTPk2ubKaJwA8ViaawLwLeYBNbQwSopNJD1bKibcJgUPJmXTC48vj6YtLXMB"
        >
          44rCACssPB5hEquN7ZEqg5fFXXchjWjNnLAyTPk2ubKaJwA8ViaawLwLeYBNbQwSopNJD1bKibcJgUPJmXTC48vj6YtLXMB
        </p>
        <p>Monero (XMR)</p>
      </div>
      <div className={styles.settings}>
        <h1 className={`${styles.downloadsHeading}`}>Donations</h1>
        <div
          className={`${styles.group2} ${styles.downloadsGroup}`}
          id="website"
        >
          <h1>Rive - Website</h1>
          <p className={styles.highlight}>
            Where Your Donation Goes for the Maintenance of Rive
          </p>
          {/* <p>
            1. <SiCloudflare className={styles.highlight} /> Cloudflare: We are using Cloudflare to proxy and cache our domain. <br></br> we are using <SiCloudflarepages className={styles.highlight} /> CloudflarePages to host our website <br></br>
          </p>
          <p>
            2. <SiFirebase className={styles.highlight} /> Firebase: We are using Firebase for authentication. <br></br> we are using Firestore to store User's Watchlist <br></br>
          </p> */}
          <p>Pricing of services we use: </p>
          <p>
            1. <SiCloudflare className={styles.highlight} /> Cloudflare Pages :
            <span className={styles.highlight}> $5/month </span>
          </p>
          <p>
            2. <SiFirebase className={styles.highlight} /> Firestore:
            <span className={styles.highlight}> $10/month </span>
          </p>
          <p>
            2. <SiHostinger className={styles.highlight} /> Domain:
            <span className={styles.highlight}> $30/year </span>
          </p>
          <p>
            Our proposed budget (monthly) : $15 <br />
            Our proposed budget (yearly) : $210
          </p>
          <p>
            <span className={styles.highlight}>
              Your generous donation will contribute directly to maintaining our
              services and ensuring that our website remains AD-free{" "}
            </span>{" "}
            <br />
            We kept the Advertisement Model our second choice due to NSFW
            contents and too many redirects <br />
            <span className={styles.highlight}>
              Advertisements might be considered a necessary evil for sustaining
              this digital marvel
            </span>
          </p>
          {/* <p>To download movies/tv shows, go to it's watch page, and use extensions like FetchV</p> */}
          <h4
            className={styles.downloadButton}
            onClick={handleRedirectToWallets}
            data-tooltip-id="tooltip"
            data-tooltip-content="Check All Wallets"
          >
            All Wallets
          </h4>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
