interface IResponseRawg<T> {
    count: 1480,
    next: "https://api.rawg.io/api/games?key=37c2ea24d5f746f19c98f6dff308c182&page=2&page_size=1&search=Cyberpunk+2077",
    previous: null,
    user_platforms: false
    results: T[]
}

interface IRawg {
    slug: string;
    name: string;
    playtime: number;
    platforms: { platform: IPlatform }[];
    stores: { store: IStore }[];
    released: string;
    tba: boolean;
    background_image: string;
    rating: number;
    rating_top: number;
    ratings: IRating[];
    ratings_count: number;
    reviews_text_count: number;
    added: number;
    added_by_status: IAddedByStatus;
    metacritic: number;
    suggestions_count: number;
    updated: string;
    id: number;
    score: string;
    clip: null;
    tags: ITag[];
    esrb_rating: IESRBRating;
    user_game: null;
    reviews_count: number;
    saturated_color: string;
    dominant_color: string;
    short_screenshots: IScreenshot[];
    parent_platforms: { platform: IPlatform }[];
    genres: IGenre[];
}

interface IRawgDetails {
    id: number;
    slug: string;
    name: string;
    name_original: string;
    description: string;
    metacritic: number;
    metacritic_platforms: IMetacriticPlatform[];
    released: string;
    tba: boolean;
    updated: string;
    background_image: string;
    background_image_additional: string;
    website: string;
    rating: number;
    rating_top: number;
    ratings: Record<string, unknown>;
    reactions: Record<string, unknown>;
    added: number;
    added_by_status: Record<string, unknown>;
    playtime: number;
    screenshots_count: number;
    movies_count: number;
    creators_count: number;
    achievements_count: number;
    parent_achievements_count: string;
    reddit_url: string;
    reddit_name: string;
    reddit_description: string;
    reddit_logo: string;
    reddit_count: number;
    twitch_count: string;
    youtube_count: string;
    reviews_text_count: string;
    ratings_count: number;
    suggestions_count: number;
    alternative_names: string[];
    metacritic_url: string;
    parents_count: number;
    additions_count: number;
    game_series_count: number;
    esrb_rating: IESRBRating;
  }

interface IPlatform {
    id: number;
    name: string;
    slug: string;
}

interface IStore {
    id: number;
    name: string;
    slug: string;
}

interface IRating {
    id: number;
    title: string;
    count: number;
    percent: number;
}

interface IAddedByStatus {
    yet: number;
    owned: number;
    beaten: number;
    toplay: number;
    dropped: number;
    playing: number;
}

interface IMetacriticPlatform {
    metascore: number;
    url: string;
  }

interface ITag {
    id: number;
    name: string;
    slug: string;
    language: string;
    games_count: number;
    image_background: string;
}

interface IESRBRating {
    id: number;
    name: string;
    slug: string;
    name_en: string;
    name_ru: string;
}

interface IScreenshot {
    id: number;
    image: string;
}

interface IGenre {
    id: number;
    name: string;
    slug: string;
}
