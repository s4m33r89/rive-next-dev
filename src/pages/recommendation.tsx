import { useState, useEffect } from "react";
import axiosFetch from "@/Utils/fetchBackend";
import styles from "../styles/Recommendation.module.scss";
import MovieCardSmall from "@/components/MovieCardSmall";
import Skeleton from "react-loading-skeleton";
import NProgress from "nprogress";
import { toast } from "sonner";
import { getContinueWatching } from "@/Utils/continueWatching";
import { getBookmarks } from "@/Utils/bookmark";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/Utils/firebase";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
// import MoviePoster from '@/components/MoviePoster';

function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const dummyList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const Recommendation = ({ categoryDiv, categoryPage = null }: any) => {
  const [category, setCategory] = useState("watchHistory"); // watchHistory, watchlist
  const [data, setData] = useState<any>([]);
  const [trigger, setTrigger] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>();
  const [ids, setIds] = useState({ tv: [], movie: [] });
  // const CapitalCategoryType = capitalizeFirstLetter(categoryType);
  // console.log(capitalizeFirstLetter(categoryType));

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userID = user.uid;
        setUser(userID);
        // setIds(await getBookmarks(userID)?.movie)
        // setLoading(false);
      } else {
        // setLoading(true);
      }
    });
  }, []);
  useEffect(() => {
    if (loading) {
      NProgress.start();
    } else NProgress.done(false);
  }, [loading]);

  useEffect(() => {
    setData([]);
    setLoading(true);
    let tempId;
    if (category === "watchlist") {
      getBookmarks(user).then((bookmarks: any) => {
        tempId = bookmarks;
        setIds(tempId);
      });
    } else {
      tempId = getContinueWatching();
      setIds(tempId);
    }
    // setLoading(false);
  }, [category]);

  useEffect(() => {
    const fetchData = async ({ id, type }: any) => {
      // setData([0, 0, 0, 0, 0, 0, 0, 0, 0]); // for blink loading effect
      if (id !== undefined) {
        try {
          const parentData = await axiosFetch({
            requestID: `${type}Data`,
            id: id,
          });
          const data = await axiosFetch({
            requestID: `${type}Related`,
            id: id,
          });
          console.log({ parentData });
          console.log({ data });
          const temp: any = {};
          temp["parent"] =
            parentData?.name || parentData?.original_name || parentData?.title;
          temp["result"] = data?.results;
          if (temp?.parent !== "" && temp?.result?.length > 0) {
            setData((prev: any) => {
              return [...prev, temp];
            });
          }
          setLoading(false);
        } catch (error) {
          console.error("Error fetching data:", error);
          setLoading(false);
        }
      }
    };
    ids?.tv?.map((ele: any) => {
      fetchData({ id: ele, type: "tv" });
    });
    ids?.movie?.map((ele: any) => {
      fetchData({ id: ele, type: "movie" });
    });
  }, [ids]);

  return (
    <div className={styles.Recommendation}>
      <h1>Recommendations</h1>
      <div className={styles.category}>
        <select
          name="category"
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className={styles.filter}
        >
          <option value="disabled" disabled>
            REC based on
          </option>
          <option value="watchlist">Watchlist</option>
          <option value="watchHistory" defaultChecked>
            Watch History
          </option>
        </select>
      </div>
      <div className={styles.HomeListAll}>
        {data?.map((ele: any, ind: any) => {
          return (
            <>
              <h2>
                <p>
                  Because you{" "}
                  {category === "watchlist" ? "watchlisted" : "watched"}{" "}
                  <span>{ele?.parent}</span>
                </p>
                <div>
                  <MdChevronLeft
                    onClick={() => {
                      document
                        .querySelectorAll(`.${styles.HomeListSection}`)
                        [ind].scrollBy(-700, 0);
                    }}
                    data-tooltip-id="tooltip"
                    data-tooltip-content="Swipe Left"
                  />
                  swipe
                  <MdChevronRight
                    onClick={() => {
                      document
                        .querySelectorAll(`.${styles.HomeListSection}`)
                        [ind].scrollBy(700, 0);
                    }}
                    data-tooltip-id="tooltip"
                    data-tooltip-content="Swipe Right"
                  />
                </div>
              </h2>
              <div className={styles.HomeListSection}>
                {ele?.result?.map((temp: any) => {
                  return (
                    <MovieCardSmall
                      data={temp}
                      media_type={temp?.media_type || temp?.type}
                    />
                  );
                })}
                {ele?.result?.length === 0 &&
                  dummyList.map((ele, i) => (
                    <Skeleton className={styles.loading} key={i} />
                  ))}
              </div>
            </>
          );
        })}
        {data?.length === 0 && (
          <h2>
            No Movie/ TV shows in{" "}
            {category === "watchlist" ? "Watchlist" : "Watch History"}
          </h2>
        )}
      </div>
    </div>
  );
};

export default Recommendation;
