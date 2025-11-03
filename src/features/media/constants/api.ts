const GIF_API_KEY = 'api_key=t0JUs64tvKcw5xaMCbIX640GKnqJ6Ybi';
const GIF_API = 'https://api.giphy.com/v1/gifs/';
const CATERGORIES = [
  'Agree',
  'Applause',
  'Awww',
  'Ronaldo',
  'Deal with it',
  'DO no want',
  'Eww',
  'Fist bumb',
];
// export const LIMIT = 1;
const LANGUAGE = 'en';
export const GIF_ENDPOINTS = {
  searchCategories: CATERGORIES.map(
    (cat) =>
      `${GIF_API}search?${GIF_API_KEY}&q=${cat}=&limit=1&offset=0&rating=g&lang=${LANGUAGE}&bundle=messaging_non_clips `
  ),
} as const;
