import { useState, useEffect } from "react";
import axiosFetch from "@/Utils/fetchBackend";
// import styles from "@/components/CategorywisePage/style.module.scss";
import styles from "@/styles/Search.module.scss";
import MovieCardSmall from "@/components/MovieCardSmall";
import Skeleton from "react-loading-skeleton";
import NProgress from "nprogress";
import { useRouter } from "next/router";
import Head from "next/head";
import { toast } from "sonner";

const Wallets = [
  {
    name: "Bitcoin (BTC)",
    image: "/wallets/Bitcoin.jpg",
    address: "bc1q9kzm2x0xntjs800addw76dq6crj27rzvxsl9n5",
  },
  {
    name: "Monero (XMR)",
    image: "/wallets/Monero.jpg",
    address:
      "44rCACssPB5hEquN7ZEqg5fFXXchjWjNnLAyTPk2ubKaJwA8ViaawLwLeYBNbQwSopNJD1bKibcJgUPJmXTC48vj6YtLXMB",
  },
  {
    name: "Stellar (XLM)",
    image: "/wallets/Stellar.jpg",
    address: "GB24VAIOZZJLXPGZ3ZK4HKHRD6OPZWX3X66ATVE57XQYBM26YQOHJSNA",
  },
  {
    name: "Ripple (XRP)",
    image: "/wallets/Ripple.jpg",
    address: "rMhBVaJiiqfU9K5pv3P8LroRou3dHd71ZC",
  },
  {
    name: "Bitcoin cash (BCH)",
    image: "/wallets/BitcoinCash.jpg",
    address: "qqqk5h0gek6n2e6anl7tm3xs92hg7gl9cy6c45qupa",
  },
  {
    name: "Dash (DASH)",
    image: "/wallets/Dash.jpg",
    address: "XikTm2uN3Py3zHVP3UF34DPaKUBCYoir9i",
  },
  {
    name: "Tether USD (USDT) (Etherium Network)",
    image: "/wallets/Usdt.jpg",
    address: "0xeCf29b84fAaf18e7126F01daA0AF98374e35d4Ab",
  },
  {
    name: "Ethereum (ETH) (Etherium Network)",
    image: "/wallets/Ethereum.jpg",
    address: "0xeCf29b84fAaf18e7126F01daA0AF98374e35d4Ab",
  },
];

const Collections = ({ categoryType }: any) => {
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (loading) {
      NProgress.start();
    } else NProgress.done(false);
  }, [loading]);
  return (
    <>
      <Head>
        <title>Rive | Wallets</title>
      </Head>
      <div className={`${styles.MoviePage} ${styles.WalletPage}`}>
        <h1>All Wallets</h1>
        <h3>
          We recommend using <a href="https://www.exodus.com/">Exodus Wallet</a>
        </h3>
        <div className={styles.movieList}>
          {Wallets?.map((ele: any) => {
            return (
              <WalletCard
                name={ele?.name}
                image={ele?.image}
                address={ele?.address}
              />
            );
          })}
        </div>
      </div>
    </>
  );
};

const WalletCard = ({ name, image, address }: any) => {
  return (
    <div
      className={styles.WalletCard}
      data-tooltip-id="tooltip"
      data-tooltip-content={address}
      onClick={(e) => {
        navigator.clipboard.writeText(address);
        toast.success("Wallet Address copied to clipboard!");
      }}
    >
      <h3>{name}</h3>
      <img src={`${image}`} alt={name} />
      <p>{address}</p>
    </div>
  );
};

export default Collections;
