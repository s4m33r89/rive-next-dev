import { getSettings } from "./settings";

interface Fetch {
  requestID: any;
  id?: string | null;
  language?: string;
  page?: number;
  genreKeywords?: string;
  sortBy?: string;
  year?: number;
  country?: string;
  query?: string;
  season?: number;
  episode?: number;
  service?: string;
}
export default async function axiosFetch({
  requestID,
  id,
  language = "en-US",
  page = 1,
  genreKeywords,
  sortBy,
  year,
  country,
  query,
  season,
  episode,
  service,
}: Fetch) {
  const proxyMode = await getSettings()?.proxyMode;
  const request = requestID;
  const API_KEY: any = process.env.NEXT_PUBLIC_TMDB_API_KEY;
  const baseURL = process.env.NEXT_PUBLIC_TMDB_API;
  const randomURL = process.env.NEXT_PUBLIC_RANDOM_URL;
  const ProviderURL = process.env.NEXT_PUBLIC_PROVIDER_URL;
  const ProviderENV = process.env.NEXT_PUBLIC_PROVIDER_ENV;
  const ExternalProviderURL = process.env.NEXT_PUBLIC_EXTERNAL_PROVIDER_URL;
  const requests: any = {
    latestMovie: `${baseURL}/movie/now_playing?language=${language}&page=${page}`, //nowPlayingMovie
    latestTv: `${baseURL}/tv/airing_today?language=${language}&page=${page}`, // airingTodayTv
    popularMovie: `${baseURL}/movie/popular?language=${language}&page=${page}&sort_by=${sortBy}`, // current popular, so similar to latestMovie data
    popularTv: `${baseURL}/tv/popular?language=${language}&page=${page}&sort_by=${sortBy}`,
    topRatedMovie: `${baseURL}/movie/top_rated?language=${language}&page=${page}`,
    topRatedTv: `${baseURL}/tv/top_rated?language=${language}&page=${page}`,
    filterMovie: `${baseURL}/discover/movie?with_genres=${genreKeywords}&language=${language}&sort_by=${sortBy}${year != undefined ? "&year=" + year : ""}${country != undefined ? "&with_origin_country=" + country : ""}&page=${page}`,
    filterTv: `${baseURL}/discover/tv?with_genres=${genreKeywords}&language=${language}&sort_by=${sortBy}${year != undefined ? "&first_air_date_year=" + year : ""}${country != undefined ? "&with_origin_country=" + country : ""}&page=${page}&with_runtime.gte=1`,
    onTheAirTv: `${baseURL}/tv/on_the_air?language=${language}&page=${page}`,
    trending: `${baseURL}/trending/all/day?language=${language}&page=${page}`,
    trendingMovie: `${baseURL}/trending/movie/week?language=${language}&page=${page}`,
    trendingTv: `${baseURL}/trending/tv/week?language=${language}&page=${page}`,
    trendingMovieDay: `${baseURL}/trending/movie/day?language=${language}&page=${page}`,
    trendingTvDay: `${baseURL}/trending/tv/day?language=${language}&page=${page}`,
    searchMulti: `${baseURL}/search/multi?query=${query}&language=${language}&page=${page}`,
    searchKeyword: `${baseURL}/search/keyword?query=${query}&language=${language}&page=${page}`,
    searchMovie: `${baseURL}/search/movie?query=${query}&language=${language}&page=${page}`,
    searchTv: `${baseURL}/search/tv?query=${query}&language=${language}&page=${page}`,

    // for a ID
    movieData: `${baseURL}/movie/${id}?language=${language}`,
    tvData: `${baseURL}/tv/${id}?language=${language}`,
    personData: `${baseURL}/person/${id}?language=${language}`,
    movieVideos: `${baseURL}/movie/${id}/videos?language=${language}`,
    tvVideos: `${baseURL}/tv/${id}/videos?language=${language}`,
    movieImages: `${baseURL}/movie/${id}/images`,
    tvImages: `${baseURL}/tv/${id}/images`,
    personImages: `${baseURL}/person/${id}/images`,
    movieCasts: `${baseURL}/movie/${id}/credits?language=${language}`,
    tvCasts: `${baseURL}/tv/${id}/credits?language=${language}`,
    movieReviews: `${baseURL}/movie/${id}/reviews?language=${language}`,
    tvReviews: `${baseURL}/tv/${id}/reviews?language=${language}`,
    movieRelated: `${baseURL}/movie/${id}/recommendations?language=${language}&page=${page}`,
    tvRelated: `${baseURL}/tv/${id}/recommendations?language=${language}&page=${page}`,
    tvEpisodes: `${baseURL}/tv/${id}/season/${season}?language=${language}`,
    tvEpisodeDetail: `${baseURL}/tv/${id}/season/${season}/episode/${episode}?language=${language}`,
    movieSimilar: `${baseURL}/movie/${id}/similar?language=${language}&page=${page}`,
    tvSimilar: `${baseURL}/tv/${id}/similar?language=${language}&page=${page}`,

    // person
    personMovie: `${baseURL}/person/${id}/movie_credits?language=${language}&page=${page}`,
    personTv: `${baseURL}/person/${id}/tv_credits?language=${language}&page=${page}`,

    // filters
    genresMovie: `${baseURL}/genre/movie/list?language=${language}`,
    genresTv: `${baseURL}/genre/tv/list?language=${language}`,
    countries: `${baseURL}/configuration/countries?language=${language}`,
    languages: `${baseURL}/configuration/languages`,

    // random
    random: `${randomURL}`,

    // collections
    collection: `${baseURL}/collection/${id}?language=${language}`,
    searchCollection: `${baseURL}/search/collection?query=${query}&language=${language}&page=${page}`,

    // withKeywords
    withKeywordsTv: `${baseURL}/discover/tv?with_keywords=${genreKeywords}&language=${language}&sort_by=${sortBy}${year != undefined ? "&first_air_date_year=" + year : ""}${country != undefined ? "&with_origin_country=" + country : ""}&page=${page}&air_date.lte=${new Date().getFullYear()}-${new Date().getMonth()}-${new Date().getDate()}${sortBy === "first_air_date.desc" ? "&with_runtime.gte=1" : null}`,
    withKeywordsMovie: `${baseURL}/discover/movie?with_keywords=${genreKeywords}&language=${language}&sort_by=${sortBy}${year != undefined ? "&first_air_date_year=" + year : ""}${country != undefined ? "&with_origin_country=" + country : ""}&page=${page}&release_date.lte=${new Date().getFullYear()}-${new Date().getMonth()}-${new Date().getDate()}&with_runtime.gte=1`,

    // provider
    VideoProviderServices:
      ProviderENV === "cloudflare"
        ? `${ProviderURL}/api/providers`
        : `${ProviderURL}/providers`,
    movieVideoProvider:
      ProviderENV === "cloudflare"
        ? `${ProviderURL}/api/provider?provider=${service}&id=${id}`
        : `${ProviderURL}/${service}/movie/${id}`,
    tvVideoProvider:
      ProviderENV === "cloudflare"
        ? `${ProviderURL}/api/provider?provider=${service}&id=${id}&season=${season}&episode=${episode}`
        : `${ProviderURL}/${service}/tv/${id}/${season}/${episode}`,

    // External provider
    movieExternalVideoProvider: `${ExternalProviderURL}/${id}?s=0&e=0`,
    tvExternalVideoProvider: `${ExternalProviderURL}/${id}?s=${season}e=${episode}&e=0`,
  };
  const final_request = requests[request];
  // console.log({ final_request });
  const options = {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  };
  let url = new URL(final_request);
  url.searchParams.append("api_key", API_KEY);
  console.log({ url });

  // proxyfying the all api request
  if (proxyMode === "reverseProxy" && !requestID.includes("VideoProvider")) {
    const tempURL = new URL("https://proxy.wafflehacker.io/");
    tempURL.searchParams.append("destination", url.toString());
    url = tempURL;
  }
  try {
    // const response = await axios.get(final_request, {
    //   params: { api_key: API_KEY },
    //   withCredentials: false,
    // });
    // console.log({ response });
    const req = await fetch(url.toString(), options);
    const response = await req.json();
    console.log({ response });
    return await response; // Return the resolved data from the response
  } catch (error) {
    console.error("Error fetching data:", error);
    // Handle errors appropriately (e.g., throw a custom error or return null)
    // throw new Error("Failed to fetch data"); // Example error handling
  }
}
