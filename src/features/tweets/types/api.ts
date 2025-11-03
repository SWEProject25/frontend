export interface Tweet {
  id: number;
  user_id: number;
  content: string;
  type: string;
  parent_id: null;
  visibility: string;
  created_at: string;
  is_deleted: boolean;
  _count: {
    likes: number;
    repostedBy: number;
    Replies: number;
  };
  User: {
    id: number;
    username: string;
  };
  media: [
    {
      media_url: string;
      type: string;
    },
  ];
}

export interface TweetResponseDto {
  status: string;
  message: string;
  data: Tweet;
}
