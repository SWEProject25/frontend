export interface GifResponse {
  data: [
    {
      id: string;
      title: string;
      images: {
        fixed_height_small: {
          url: string;
          width: string;
          height: string;
        };
        fixed_width_downsampled: {
          url: string;
          width: string;
          height: string;
        };
        fixed_height_downsampled: {
          url: string;
          width: string;
          height: string;
        };
        original: {
          url: string;
          width: string;
          height: string;
        };
      };
    },
  ];
  meta: {
    status: number;
    msg: string;
  };
  pagination: {
    total_count: number;
    count: number;
    offset: number;
  };
}

// export interface GifResponse {
//   data: [
//     {
//       featured_gif: {
//         id: string;
//         title: string;
//         images: {
//           fixed_height_small_still: {
//             url: string;
//             width: string;
//             height: string;
//           };
//         };
//       };
//     },
//   ];
//   meta: {
//     status: number;
//     msg: string;
//   };
// }
