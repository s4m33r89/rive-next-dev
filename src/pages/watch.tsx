import { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import styles from "@/styles/Watch.module.scss";
import { setContinueWatching } from "@/Utils/continueWatching";
import { toast } from "sonner";
import { IoReturnDownBack } from "react-icons/io5";
import { FaForwardStep, FaBackwardStep } from "react-icons/fa6";
import { BsHddStack, BsHddStackFill } from "react-icons/bs";
import axiosFetch from "@/Utils/fetchBackend";
import WatchDetails from "@/components/WatchDetails";
import Player from "@/components/Artplayer";
import Head from "next/head";
import { FaDiscord, FaDonate } from "react-icons/fa";
import useDeviceSize from "@/Utils/useDeviceSize";

const Watch = () => {
  const params = useSearchParams();
  const { back, push } = useRouter();
  // console.log(params.get("id"));
  const [type, setType] = useState<string | null>("");
  const [id, setId] = useState<any>();
  const [season, setSeason] = useState<any>();
  const [episode, setEpisode] = useState<any>();
  const [minEpisodes, setMinEpisodes] = useState(1);
  const [maxEpisodes, setMaxEpisodes] = useState(2);
  const [maxSeason, setMaxSeason] = useState(1);
  const [nextSeasonMinEpisodes, setNextSeasonMinEpisodes] = useState(1);
  const [loading, setLoading] = useState(true);
  const [watchDetails, setWatchDetails] = useState(false);
  const [data, setdata] = useState<any>();
  const [seasondata, setseasonData] = useState<any>();
  const [source, setSource] = useState("SUP");
  const [embedMode, setEmbedMode] = useState<any>();
  // const [nonEmbedURL, setNonEmbedURL] = useState<any>("");
  const [nonEmbedSourcesIndex, setNonEmbedSourcesIndex] = useState<any>("");
  const [nonEmbedSources, setNonEmbedSources] = useState<any>("");
  const [nonEmbedCaptions, setnonEmbedCaptions] = useState<any>([]);
  const [nonEmbedVideoProviders, setNonEmbedVideoProviders] = useState([]);
  const [nonEmbedSourcesNotFound, setNonEmbedSourcesNotFound] =
    useState<any>(false);
  // const [nonEmbedFormat, setnonEmbedFormat] = useState<any>();
  const nextBtn: any = useRef(null);
  const backBtn: any = useRef(null);
  const moreBtn: any = useRef(null);
  const { isMobile, isTablet, isDesktop, isTV } = useDeviceSize();

  if (type === null && params.get("id") !== null) setType(params.get("type"));
  if (id === null && params.get("id") !== null) setId(params.get("id"));
  if (season === null && params.get("season") !== null)
    setSeason(params.get("season"));
  if (episode === null && params.get("episode") !== null)
    setEpisode(params.get("episode"));

  const watchDetailRef: any = useRef(null);
  useEffect(() => {
    // Function to handle click events
    const handleClickOutside = (event: any) => {
      // Check if the click is outside the Filter component
      if (
        watchDetailRef.current &&
        !watchDetailRef?.current?.contains(event?.target)
      ) {
        setWatchDetails(false);
      }
      console.log({ event });
      console.log({ watchDetailRef });
    };

    // Add event listener to document
    document.addEventListener("mousedown", handleClickOutside);

    // Clean up the event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (
      localStorage.getItem("RiveStreamEmbedMode") !== undefined &&
      localStorage.getItem("RiveStreamEmbedMode") !== null
    )
      setEmbedMode(
        JSON.parse(localStorage.getItem("RiveStreamEmbedMode") || "false"),
      );
    else setEmbedMode(false);
    const latestAgg: any = localStorage.getItem("RiveStreamLatestAgg");
    if (latestAgg !== null && latestAgg !== undefined) setSource(latestAgg);
    setLoading(true);
    setType(params.get("type"));
    setId(params.get("id"));
    setSeason(params.get("season"));
    setEpisode(params.get("episode"));
    setContinueWatching({ type: params.get("type"), id: params.get("id") });
    const fetch = async () => {
      const res: any = await axiosFetch({ requestID: `${type}Data`, id: id });
      setdata(res);
      setMaxSeason(res?.number_of_seasons);
      const seasonData = await axiosFetch({
        requestID: `tvEpisodes`,
        id: id,
        season: season,
      });
      setseasonData(seasonData);
      seasonData?.episodes?.length > 0 &&
        setMaxEpisodes(
          seasonData?.episodes[seasonData?.episodes?.length - 1]
            ?.episode_number,
        );
      setMinEpisodes(seasonData?.episodes[0]?.episode_number);
      if (parseInt(episode) >= maxEpisodes - 1) {
        var nextseasonData = await axiosFetch({
          requestID: `tvEpisodes`,
          id: id,
          season: parseInt(season) + 1,
        });
        nextseasonData?.episodes?.length > 0 &&
          setNextSeasonMinEpisodes(nextseasonData?.episodes[0]?.episode_number);
      }
    };
    const MovieFetch = async () => {
      const res: any = await axiosFetch({ requestID: `${type}Data`, id: id });
      setdata(res);
    };
    if (type === "tv") fetch();
    else MovieFetch();

    const handleKeyDown = (event: any) => {
      if (event.shiftKey && event.key === "N") {
        event.preventDefault();
        nextBtn?.current.click();
        // handleForward();
        // console.log("next");
      } else if (event.shiftKey && event.key === "P") {
        event.preventDefault();
        backBtn?.current.click();
        // handleBackward();
        // console.log("prev");
      } else if (event.shiftKey && event.key === "M") {
        event.preventDefault();
        moreBtn?.current.click();
      }
    };

    // Add event listener when component mounts
    window.addEventListener("keydown", handleKeyDown);

    // Remove event listener when component unmounts
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [params, id, season, episode]);

  useEffect(() => {
    if (embedMode !== undefined && embedMode !== null)
      localStorage.setItem("RiveStreamEmbedMode", embedMode);
    if (embedMode === true) {
      const latestAgg: any = localStorage.getItem("RiveStreamLatestAgg");
      if (latestAgg !== null && latestAgg !== undefined) setSource(latestAgg);
      toast.info(
        <div>
          Cloud: use AD-Blocker services for AD-free experience, like AD-Blocker
          extension or{" "}
          <a target="_blank" href="https://brave.com/">
            Brave Browser{" "}
          </a>
        </div>,
      );

      toast.info(
        <div>
          Cloud: use video downloader extensions like{" "}
          <a target="_blank" href="https://fetchv.net/">
            FetchV{" "}
          </a>{" "}
          or{" "}
          <a target="_blank" href="https://www.hlsloader.com/">
            Stream Recorder{" "}
          </a>{" "}
          for PC and{" "}
          <a
            target="_blank"
            href="https://play.google.com/store/apps/details?id=videoplayer.videodownloader.downloader"
          >
            AVDP{" "}
          </a>{" "}
          for Android, to download movies/tv shows. Refer{" "}
          <a
            target="_blank"
            href="https://www.reddit.com/r/DataHoarder/comments/qgne3i/how_to_download_videos_from_vidsrcme/"
          >
            The Source{" "}
          </a>
        </div>,
      );
    } else {
      // discord Invitation
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
      // discord Invitation
    }
  }, [embedMode]);

  useEffect(() => {
    let autoEmbedMode: NodeJS.Timeout;
    if (embedMode === false && id !== undefined && id !== null) {
      const fetch = async () => {
        setNonEmbedSourcesNotFound(false);
        const providers: any = await axiosFetch({
          requestID: `VideoProviderServices`,
        });
        // console.log({ providers });
        setNonEmbedVideoProviders(
          providers?.data?.map((ele: any) => {
            return {
              name: ele,
              status: "available",
            };
          }),
        );
        const res: any = { sources: [], captions: [] };
        // setNonEmbedSources([]);
        // setnonEmbedCaptions([]);
        for (const ele of providers?.data || []) {
          setNonEmbedVideoProviders((prevProviders: any) =>
            prevProviders.map((provider: any) => {
              if (provider.name === ele) {
                return {
                  ...provider,
                  status: "fetching",
                };
              }
              return provider;
            }),
          );
          try {
            const tempRes: any = await axiosFetch({
              requestID: `${type}VideoProvider`,
              id: id,
              season: season,
              episode: episode,
              service: ele,
            });
            console.log({ tempRes });

            tempRes?.data?.sources?.forEach((source: any) => {
              res.sources.push(source);
            });
            tempRes?.data?.captions?.forEach((caption: any) => {
              res.captions.push(caption);
            });

            setNonEmbedVideoProviders((prevProviders: any) =>
              prevProviders.map((provider: any) => {
                if (provider.name === ele) {
                  return {
                    ...provider,
                    status:
                      tempRes?.data?.sources?.length > 0 ? "success" : "error",
                  };
                }
                return provider;
              }),
            );
            if (tempRes?.data?.sources?.length > 0) {
              setNonEmbedSources((prev: any) => {
                return [...prev, ...tempRes?.data?.sources];
              });
              tempRes?.data?.sources?.length > 0
                ? setNonEmbedSourcesIndex(0)
                : null;
              setnonEmbedCaptions((prev: any) => {
                const captions = Array.isArray(tempRes?.data?.captions)
                  ? tempRes?.data?.captions
                  : [];
                return [...prev, ...captions];
              });
              clearTimeout(autoEmbedMode);
              setNonEmbedSourcesNotFound(false);
            }
          } catch (error) {
            console.error(`Error fetching data for provider ${ele}:`, error);
            setNonEmbedVideoProviders((prevProviders: any) =>
              prevProviders.map((provider: any) => {
                if (provider.name === ele) {
                  return {
                    ...provider,
                    status: "error",
                  };
                }
                return provider;
              }),
            );
          }
        }
        console.log({ res });
        if (res?.sources?.length > 0) {
          setNonEmbedSources(res?.sources);
          res?.sources?.length > 0 ? setNonEmbedSourcesIndex(0) : null;
          setnonEmbedCaptions(res?.captions);
          clearTimeout(autoEmbedMode);
          setNonEmbedSourcesNotFound(false);
        } else {
          setNonEmbedSourcesNotFound(true);
          autoEmbedMode = setTimeout(() => {
            setEmbedMode(true);
          }, 10000);
        }
      };

      if (season !== null && episode !== null)
        toast.info(
          "It may take 30s-1min to load media for an episode. Wait for the player to load",
        );

      fetch();
      // if (nonEmbedURl === "") setEmbedMode(true);
    }
  }, [params, id, season, episode, embedMode]);

  function handleBackward() {
    // setEpisode(parseInt(episode)+1);
    if (episode > minEpisodes)
      push(
        `/watch?type=tv&id=${id}&season=${season}&episode=${parseInt(episode) - 1}`,
      );
  }
  function handleForward() {
    // setEpisode(parseInt(episode)+1);
    if (episode < maxEpisodes)
      push(
        `/watch?type=tv&id=${id}&season=${season}&episode=${parseInt(episode) + 1}`,
      );
    else if (parseInt(season) + 1 <= maxSeason)
      push(
        `/watch?type=tv&id=${id}&season=${parseInt(season) + 1}&episode=${nextSeasonMinEpisodes}`,
      );
  }

  const STREAM_URL_AGG = process.env.NEXT_PUBLIC_STREAM_URL_AGG;
  const STREAM_URL_VID = process.env.NEXT_PUBLIC_STREAM_URL_VID;
  const STREAM_URL_PRO = process.env.NEXT_PUBLIC_STREAM_URL_PRO;
  const STREAM_URL_EMB = process.env.NEXT_PUBLIC_STREAM_URL_EMB;
  const STREAM_URL_MULTI = process.env.NEXT_PUBLIC_STREAM_URL_MULTI;
  const STREAM_URL_SUP = process.env.NEXT_PUBLIC_STREAM_URL_SUP;
  const STREAM_URL_CLUB = process.env.NEXT_PUBLIC_STREAM_URL_CLUB;
  const STREAM_URL_SMASH = process.env.NEXT_PUBLIC_STREAM_URL_SMASH;
  const STREAM_URL_ONE = process.env.NEXT_PUBLIC_STREAM_URL_ONE;
  const STREAM_URL_ANY = process.env.NEXT_PUBLIC_STREAM_URL_ANY;
  const STREAM_URL_PRIME = process.env.NEXT_PUBLIC_STREAM_URL_PRIME;
  const STREAM_URL_RGS = process.env.NEXT_PUBLIC_STREAM_URL_RGS;
  const STREAM_URL_FRE = process.env.NEXT_PUBLIC_STREAM_URL_FRE;
  const STREAM_URL_RUS = process.env.NEXT_PUBLIC_STREAM_URL_RUS;
  const STREAM_URL_POR = process.env.NEXT_PUBLIC_STREAM_URL_POR;
  const STREAM_URL_AUTO = process.env.NEXT_PUBLIC_STREAM_URL_AUTO;
  const STREAM_URL_WEB = process.env.NEXT_PUBLIC_STREAM_URL_WEB;

  return (
    <>
      <Head>
        <title>
          Rive | Watch{" "}
          {id !== undefined && id !== null
            ? `| ${data?.name || data?.title || id}`
            : null}{" "}
          {season !== null && season !== undefined
            ? `| S${season}-E${episode}`
            : null}
        </title>
      </Head>
      <div className={styles.watch}>
        <div onClick={() => back()} className={styles.backBtn}>
          <IoReturnDownBack
            data-tooltip-id="tooltip"
            data-tooltip-content="go back"
          />
        </div>
        {
          <div className={styles.episodeControl}>
            {type === "tv" ? (
              <>
                <div
                  ref={backBtn}
                  onClick={() => {
                    if (episode > 1) handleBackward();
                  }}
                  data-tooltip-id="tooltip"
                  data-tooltip-html={
                    episode > minEpisodes
                      ? "<div>Previous episode <span class='tooltip-btn'>SHIFT + P</span></div>"
                      : `Start of season ${season}`
                  }
                >
                  <FaBackwardStep
                    className={`${episode <= minEpisodes ? styles.inactive : null}`}
                  />
                </div>
                <div
                  ref={nextBtn}
                  onClick={() => {
                    if (
                      episode < maxEpisodes ||
                      parseInt(season) + 1 <= maxSeason
                    )
                      handleForward();
                  }}
                  data-tooltip-id="tooltip"
                  data-tooltip-html={
                    episode < maxEpisodes
                      ? "<div>Next episode <span class='tooltip-btn'>SHIFT + N</span></div>"
                      : parseInt(season) + 1 <= maxSeason
                        ? `<div>Start season ${parseInt(season) + 1} <span class='tooltip-btn'>SHIFT + N</span></div>`
                        : `End of season ${season}`
                  }
                >
                  <FaForwardStep
                    className={`${episode >= maxEpisodes && season >= maxSeason ? styles.inactive : null} ${episode >= maxEpisodes && season < maxSeason ? styles.nextSeason : null}`}
                  />
                </div>
              </>
            ) : null}
            <div
              ref={moreBtn}
              onClick={() => setWatchDetails(!watchDetails)}
              data-tooltip-id="tooltip"
              data-tooltip-html={
                !watchDetails
                  ? "More <span class='tooltip-btn'>SHIFT + M</span></div>"
                  : "close <span class='tooltip-btn'>SHIFT + M</span></div>"
              }
            >
              {watchDetails ? <BsHddStackFill /> : <BsHddStack />}
            </div>
          </div>
        }
        {watchDetails && (
          <>
            <div className="modalOverlay"></div>
            <WatchDetails
              watchDetailRef={watchDetailRef}
              id={id}
              type={type}
              data={data}
              season={season}
              episode={episode}
              setWatchDetails={setWatchDetails}
            />
          </>
        )}
        <div className={styles.watchSelects}>
          {embedMode === true && (
            <select
              name="source"
              id="source"
              aria-placeholder="servers"
              className={styles.source}
              value={source}
              onChange={(e) => {
                setSource(e.target.value);
                localStorage.setItem("RiveStreamLatestAgg", e.target.value);
              }}
            >
              <option value="AGG">Aggregator : 1 (Multi-Server)</option>
              <option value="VID">Aggregator : 2 (VidsrcMe)</option>
              <option value="PRO">Aggregator : 3 (Best-Server) * </option>
              <option value="EMB">Aggregator : 4 (VidSrcTo)</option>
              <option value="MULTI">Aggregator : 5 (Fast-Server)</option>
              <option value="SUP" defaultChecked>
                Aggregator : 6 (Multi/Most-Server) *
              </option>
              <option value="CLUB">Aggregator : 7 (Latest/HD-server) *</option>
              <option value="SMASH">Aggregator : 8 (Multi-Server)</option>
              <option value="ONE">Aggregator : 9 (Multi-Server)</option>
              <option value="ANY">Aggregator : 10 (Multi-Server)</option>
              <option value="PRIME">
                Aggregator : 11 (Multi/Most-Server) *{" "}
              </option>
              <option value="RGS">Aggregator : 12 (Indian-server)</option>
              <option value="FRE">Aggregator : 13 (French-Server)</option>
              <option value="RUS">Aggregator : 14 (Russian-Server)</option>
              <option value="POR">Aggregator : 15 (Portuguese-Server)</option>
              <option value="AUTO">Aggregator : 16 (Multi-Lang) * </option>
              <option value="WEB">Aggregator : 17 (Ad-Free)</option>
              <option value="ADF">Aggregator : 18 (Fast/Ad-Free) * </option>
            </select>
          )}

          {embedMode === false && (
            <select
              name="embedModesource"
              id="embedModesource"
              className={styles.embedMode}
              value={nonEmbedSourcesIndex}
              onChange={(e) => {
                setNonEmbedSourcesIndex(e.target.value);
              }}
              aria-placeholder="servers"
            >
              <option value="" disabled selected>
                servers
              </option>
              {nonEmbedSources?.length > 0 &&
                nonEmbedSources?.map((ele: any, ind: any) => {
                  if (typeof ele === "object" && ele !== null) {
                    return (
                      <option value={ind} defaultChecked>
                        {ele?.source} ({ele?.quality})
                      </option>
                    );
                  }
                })}
            </select>
          )}
          <select
            name="embedMode"
            id="embedMode"
            className={styles.embedMode}
            value={embedMode}
            onChange={(e) => {
              setEmbedMode(JSON.parse(e.target.value));
              localStorage.setItem("RiveStreamEmbedMode", e.target.value);
            }}
          >
            <option value="true">Embed Mode</option>
            <option value="false">NON Embed Mode (AD-free)</option>
          </select>
        </div>
        <div className={`${styles.loader} skeleton`}>
          {embedMode === false && id !== undefined && id !== null ? (
            <div className={styles.videoProviders}>
              {nonEmbedVideoProviders?.map((ele: any) => {
                return (
                  <div
                    className={`${styles.videoProvider} ${ele?.status === "available" ? styles.available : null} ${ele?.status === "fetching" ? styles.fetching : null} ${ele?.status === "success" ? styles.success : null} ${ele?.status === "error" ? styles.error : null}`}
                  >
                    <div className={`${styles.videoProviderName}`}>
                      {ele?.name?.toUpperCase()}
                    </div>
                    <div className={`${styles.videoProviderStatus} `}>
                      {ele?.status}
                    </div>
                  </div>
                );
              })}
              {nonEmbedSourcesNotFound ? (
                <p className={`${styles.para2} ${styles.success}`}>
                  Server not found. Automatically switching to Embed Mode.
                </p>
              ) : (
                <p className={styles.para}>
                  If Server not found, Then system will automatically switch to
                  Embed Mode in 10 seconds
                </p>
              )}
            </div>
          ) : (
            <div className={`${styles.loader}`}>
              <div className={`${styles.scanner}`}>
                <span>Loading..</span>
              </div>
            </div>
          )}
        </div>
        {embedMode === false && nonEmbedSourcesIndex !== "" && (
          <Player
            option={{
              url: nonEmbedSources[nonEmbedSourcesIndex]?.url,
            }}
            format={nonEmbedSources[nonEmbedSourcesIndex]?.format}
            captions={nonEmbedCaptions}
            className={styles.videoPlayer}
          />
        )}
        {source === "AGG" && id !== "" && id !== null && embedMode === true ? (
          <iframe
            scrolling="no"
            src={
              type === "movie"
                ? `${STREAM_URL_AGG}/embed/${id}`
                : `${STREAM_URL_AGG}/embed/${id}/${season}/${episode}`
            }
            className={styles.iframe}
            allowFullScreen
            allow="accelerometer; autoplay; encrypted-media; gyroscope;"
            referrerPolicy="origin"
          ></iframe>
        ) : null}

        {source === "VID" && id !== "" && id !== null && embedMode === true ? (
          <iframe
            scrolling="no"
            src={
              type === "movie"
                ? `${STREAM_URL_VID}/embed/${type}/${id}`
                : `${STREAM_URL_VID}/embed/${type}/${id}/${season}/${episode}`
            }
            className={styles.iframe}
            allowFullScreen
            allow="accelerometer; autoplay; encrypted-media; gyroscope;"
            referrerPolicy="origin"
          ></iframe>
        ) : null}

        {source === "PRO" && id !== "" && id !== null && embedMode === true ? (
          <iframe
            scrolling="no"
            src={
              type === "movie"
                ? `${STREAM_URL_PRO}/embed/${type}/${id}?theme=00c1db`
                : `${STREAM_URL_PRO}/embed/${type}/${id}/${season}/${episode}?theme=00c1db`
            }
            className={styles.iframe}
            allowFullScreen
            allow="accelerometer; autoplay; encrypted-media; gyroscope;"
            referrerPolicy="origin"
          ></iframe>
        ) : null}

        {source === "EMB" && id !== "" && id !== null && embedMode === true ? (
          <iframe
            scrolling="no"
            src={
              type === "movie"
                ? `${STREAM_URL_EMB}/v2/embed/${type}/${id}`
                : `${STREAM_URL_EMB}/v2/embed/${type}/${id}/${season}/${episode}`
            }
            className={styles.iframe}
            allowFullScreen
            allow="accelerometer; autoplay; encrypted-media; gyroscope;"
            referrerPolicy="origin"
          ></iframe>
        ) : null}

        {source === "MULTI" &&
        id !== "" &&
        id !== null &&
        embedMode === true ? (
          <iframe
            scrolling="no"
            src={
              type === "movie"
                ? `${STREAM_URL_MULTI}?video_id=${id}&tmdb=1`
                : `${STREAM_URL_MULTI}?video_id=${id}&tmdb=1&s=${season}&e=${episode}`
            }
            className={styles.iframe}
            allowFullScreen
            allow="accelerometer; autoplay; encrypted-media; gyroscope;"
            referrerPolicy="origin"
          ></iframe>
        ) : null}

        {source === "SUP" && id !== "" && id !== null && embedMode === true ? (
          <iframe
            scrolling="no"
            src={
              type === "movie"
                ? `${STREAM_URL_SUP}/?video_id=${id}&tmdb=1`
                : `${STREAM_URL_SUP}/?video_id=${id}&tmdb=1&s=${season}&e=${episode}`
            }
            className={styles.iframe}
            allowFullScreen
            allow="accelerometer; autoplay; encrypted-media; gyroscope;"
            referrerPolicy="origin"
          ></iframe>
        ) : null}

        {source === "CLUB" && id !== "" && id !== null && embedMode === true ? (
          <iframe
            scrolling="no"
            src={
              type === "movie"
                ? `${STREAM_URL_CLUB}/movie/${id}`
                : `${STREAM_URL_CLUB}/tv/${id}-${season}-${episode}`
            }
            className={styles.iframe}
            allowFullScreen
            allow="accelerometer; autoplay; encrypted-media; gyroscope;"
            referrerPolicy="origin"
          ></iframe>
        ) : null}

        {source === "SMASH" &&
        id !== "" &&
        id !== null &&
        embedMode === true ? (
          <iframe
            scrolling="no"
            src={
              type === "movie"
                ? `${STREAM_URL_SMASH}?tmdb=${id}`
                : `${STREAM_URL_SMASH}?tmdb=${id}&season=${season}&episode=${episode}`
            }
            className={styles.iframe}
            allowFullScreen
            allow="accelerometer; autoplay; encrypted-media; gyroscope;"
            referrerPolicy="origin"
          ></iframe>
        ) : null}

        {source === "ONE" && id !== "" && id !== null && embedMode === true ? (
          <iframe
            scrolling="no"
            src={
              type === "movie"
                ? `${STREAM_URL_ONE}/movie/${id}/watch`
                : `${STREAM_URL_ONE}/tv/${id}/watch?season=${season}&episode=${episode}`
            }
            className={styles.iframe}
            allowFullScreen
            allow="accelerometer; autoplay; encrypted-media; gyroscope;"
            referrerPolicy="origin"
          ></iframe>
        ) : null}

        {source === "ANY" && id !== "" && id !== null && embedMode === true ? (
          <iframe
            scrolling="no"
            src={
              type === "movie"
                ? `${STREAM_URL_ANY}/movie/${id}`
                : `${STREAM_URL_ANY}/tv/${id}/${season}/${episode}`
            }
            className={styles.iframe}
            allowFullScreen
            allow="accelerometer; autoplay; encrypted-media; gyroscope;"
            referrerPolicy="origin"
          ></iframe>
        ) : null}

        {source === "PRIME" &&
        id !== "" &&
        id !== null &&
        embedMode === true ? (
          <iframe
            scrolling="no"
            src={
              type === "movie"
                ? `${STREAM_URL_PRIME}/movie?tmdb=${id}`
                : `${STREAM_URL_PRIME}/tv?tmdb=${id}&season=${season}&episode=${episode}`
            }
            className={styles.iframe}
            allowFullScreen
            allow="accelerometer; autoplay; encrypted-media; gyroscope;"
            referrerPolicy="origin"
          ></iframe>
        ) : null}

        {source === "RGS" && id !== "" && id !== null && embedMode === true ? (
          <iframe
            scrolling="no"
            src={
              type === "movie"
                ? `${STREAM_URL_RGS}/movies/api3/index.html?id=${id}`
                : `${STREAM_URL_RGS}/series/api3/index.html?id=${id}&s=${season}&e=${episode}`
            }
            className={styles.iframe}
            allowFullScreen
            allow="accelerometer; autoplay; encrypted-media; gyroscope;"
            referrerPolicy="origin"
          ></iframe>
        ) : null}

        {source === "FRE" && id !== "" && id !== null && embedMode === true ? (
          <iframe
            scrolling="no"
            src={
              type === "movie"
                ? `${STREAM_URL_FRE}/film.php?id=${id}`
                : `${STREAM_URL_FRE}/serie.php?id=${id}&sa=${season}&epi=${episode}`
            }
            className={styles.iframe}
            allowFullScreen
            allow="accelerometer; autoplay; encrypted-media; gyroscope;"
            referrerPolicy="origin"
          ></iframe>
        ) : null}

        {source === "RUS" && id !== "" && id !== null && embedMode === true ? (
          <iframe
            scrolling="no"
            src={
              type === "movie"
                ? `${STREAM_URL_RUS}/embed/imdb/${data?.imdbId}`
                : `${STREAM_URL_RUS}/embed/imdb/${data?.imdbId}?season=${season}&episode=${episode}`
            }
            className={styles.iframe}
            allowFullScreen
            allow="accelerometer; autoplay; encrypted-media; gyroscope;"
            referrerPolicy="origin"
          ></iframe>
        ) : null}

        {source === "POR" && id !== "" && id !== null && embedMode === true ? (
          <iframe
            scrolling="no"
            src={
              type === "movie"
                ? `${STREAM_URL_POR}/filme/${id}`
                : `${STREAM_URL_POR}/serie/${id}/${season}/${episode}`
            }
            className={styles.iframe}
            allowFullScreen
            allow="accelerometer; autoplay; encrypted-media; gyroscope;"
            referrerPolicy="origin"
          ></iframe>
        ) : null}

        {source === "AUTO" && id !== "" && id !== null && embedMode === true ? (
          <iframe
            scrolling="no"
            src={
              type === "movie"
                ? `${STREAM_URL_AUTO}/embed/${type}/${id}?server=1`
                : `${STREAM_URL_AUTO}/embed/${type}/${id}/${season}/${episode}?server=1`
            }
            className={styles.iframe}
            allowFullScreen
            allow="accelerometer; autoplay; encrypted-media; gyroscope;"
            referrerPolicy="origin"
          ></iframe>
        ) : null}

        {source === "WEB" && id !== "" && id !== null && embedMode === true ? (
          <iframe
            scrolling="no"
            src={
              type === "movie"
                ? `${STREAM_URL_WEB}/media/tmdb-movie-${id}`
                : seasondata?.episodes?.length > 0
                  ? `${STREAM_URL_WEB}/media/tmdb-tv-${id}/${seasondata.id}/${seasondata.episodes[Math.abs(episode - seasondata.episodes[0].episode_number)].id}`
                  : `${STREAM_URL_WEB}/media/tmdb-tv-${id}`
            }
            className={styles.iframe}
            allowFullScreen
            allow="accelerometer; autoplay; encrypted-media; gyroscope;"
            referrerPolicy="origin"
          ></iframe>
        ) : null}

        {source === "ADF" && id !== "" && id !== null && embedMode === true ? (
          <iframe
            scrolling="no"
            src={
              type === "movie"
                ? `${STREAM_URL_PRO}/embed/${type}/${id}?player=new`
                : `${STREAM_URL_PRO}/embed/${type}/${id}/${season}/${episode}?player=new`
            }
            className={styles.iframe}
            allowFullScreen
            allow="accelerometer; autoplay; encrypted-media; gyroscope;"
            referrerPolicy="origin"
          ></iframe>
        ) : null}
      </div>
    </>
  );
};

export default Watch;
