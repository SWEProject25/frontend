const GIF_API = 'https://api.giphy.com/v1/';
export const GIF_API_KEY = `api_key=${process.env.NEXT_PUBLIC_GIPHY_API_KEY}`;
export const CATERGORIES = [
  'real madrid',
  'cats',
  'dogs',
  'Ronaldo',
  'lions',
  'mbappe',
  'tigers',
  'cheetah',
];
// 'Agree',
// 'Applause',
// 'Awww',
// 'Ronaldo',
// 'Deal with it',
// 'DO no want',
// 'Eww',
// 'Fist bumb',
// export const LIMIT = 1;
const LANGUAGE = 'en';
export const GIF_ENDPOINTS = {
  searchCategories: CATERGORIES.map(
    (cat) =>
      `${GIF_API}gifs/search?${GIF_API_KEY}&q=${cat}=&limit=1&offset=0&rating=g&lang=${LANGUAGE}&bundle=low_bandwidth `
  ),
  search: (text: string) =>
    `${GIF_API}gifs/search?${GIF_API_KEY}&q=${text}=&rating=g&lang=${LANGUAGE}&bundle=low_bandwidth `,
  // searchCategories: CATERGORIES.map(
  //   (cat) =>
  //     `${GIF_API}channels/search?${GIF_API_KEY}&q=${cat}=&limit=1&offset=0 `
  // ),
} as const;
