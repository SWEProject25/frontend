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
      };
    },
  ];
}
