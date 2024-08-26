// watchlist :{
//   movie:[],
//   tv:[],
// }

// RiveStreamFBWatchlist: [
//   {
//     userId: string,
//     timestamp: number,
//     movie: [],
//     tv: []
//   },
// ]

import {
  addToFbWatchlist,
  checkInFbWatchlist,
  fetchFbWatchlist,
  removeFromFbWatchlist,
} from "./firebaseUser";

const CACHE_TTL: number = 43200;

export const getBookmarks = async (userId: any) => {
  // console.log({ userId });
  if (userId !== null && userId !== undefined) {
    let localFBWatchlist: any = localStorage.getItem("RiveStreamFBWatchlist");
    localFBWatchlist = JSON.parse(localFBWatchlist) || [];
    const localUserWatchlist = localFBWatchlist?.find(
      (ele: any) => ele?.userId === userId,
    );
    if (Date.now() - localUserWatchlist?.timestamp < CACHE_TTL * 1000) {
      // return localFBWatchlist?.find((ele: any) => ele?.userId === userId);
      return localUserWatchlist;
    } else {
      localFBWatchlist = localFBWatchlist?.filter(
        (ele: any) => ele?.userId !== userId,
      );
    }
    return fetchFbWatchlist({ userID: userId })
      .then(async (result) => {
        localStorage.setItem(
          "RiveStreamFBWatchlist",
          JSON.stringify([
            ...localFBWatchlist,
            { ...result, timestamp: Date.now(), userId: userId },
          ]),
        );
        return await result;
      })
      .catch((err) => {
        console.error("Error fetching from Firebase:", err);
        const values: any = localStorage.getItem("RiveStreamWatchlist");
        return JSON.parse(values) || undefined;
      });
  } else {
    const values: any = localStorage.getItem("RiveStreamWatchlist");
    return JSON.parse(values) || undefined;
  }
  return undefined;
};

export const setBookmarks = async ({ userId = null, type, id }: any) => {
  if (userId !== null) {
    let localFBWatchlist: any = localStorage.getItem("RiveStreamFBWatchlist");
    localFBWatchlist = JSON.parse(localFBWatchlist) || [];
    localFBWatchlist.forEach((ele: any) => {
      if (ele?.userId === userId && !ele[type]?.includes(id)) {
        // ele[type] = ele[type].reverse();
        ele[type] = [id, ...ele[type]];
        // ele[type] = ele[type].reverse();
      }
    });
    localStorage.setItem(
      "RiveStreamFBWatchlist",
      JSON.stringify(localFBWatchlist),
    );
    return addToFbWatchlist({ userID: userId, type, id }).catch(
      async (error) => {
        console.error("Error adding to Firebase:", error);
        var values: any = (await getBookmarks(userId)) || { movie: [], tv: [] };
        if (!values[type]?.includes(id)) {
          values[type] = values[type].reverse();
          values[type]?.push(id);
          values[type] = values[type].reverse();
          localStorage.setItem("RiveStreamWatchlist", JSON.stringify(values));
        }
      },
    );
  } else {
    var values: any = (await getBookmarks(userId)) || { movie: [], tv: [] };
    if (!values[type]?.includes(id)) {
      values[type] = values[type].reverse();
      values[type]?.push(id);
      values[type] = values[type].reverse();
      localStorage.setItem("RiveStreamWatchlist", JSON.stringify(values));
    }
  }
};

export const removeBookmarks = async ({ userId = null, type, id }: any) => {
  if (userId !== null) {
    let localFBWatchlist: any = localStorage.getItem("RiveStreamFBWatchlist");
    localFBWatchlist = JSON.parse(localFBWatchlist) || [];
    localFBWatchlist.forEach((ele: any) => {
      if (ele?.userId === userId && ele[type]?.includes(id)) {
        // Add the id to the correct array
        ele[type] = ele[type].filter((ele: any) => ele !== id);
      }
    });
    localStorage.setItem(
      "RiveStreamFBWatchlist",
      JSON.stringify(localFBWatchlist),
    );
    return removeFromFbWatchlist({ userID: userId, type, id }).catch(
      async (error) => {
        console.error("Error removing from Firebase:", error);
        var values: any = (await getBookmarks(userId)) || { movie: [], tv: [] };
        if (values[type]?.includes(id)) {
          values[type] = values[type].filter((ele: any) => ele !== id);
          localStorage.setItem("RiveStreamWatchlist", JSON.stringify(values));
        }
      },
    );
  } else {
    var values: any = (await getBookmarks(userId)) || { movie: [], tv: [] };
    if (values[type]?.includes(id)) {
      values[type] = values[type].filter((ele: any) => ele !== id);
      localStorage.setItem("RiveStreamWatchlist", JSON.stringify(values));
    }
  }
};

export const checkBookmarks = async ({ userId = null, type, id }: any) => {
  var values: any = (await getBookmarks(userId)) || { movie: [], tv: [] };
  if (values[type]?.includes(id)) {
    return true;
  }
  return false;
};
