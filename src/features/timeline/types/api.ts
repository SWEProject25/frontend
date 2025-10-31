export interface AddTweetData {
  content: string;
  type: string;
  parentId: number;
  visibility: string;
  media: FormData;
}
export interface AddTweetResponse {
  status: string;
  message: string;
  data: {
    id: number;
    user_id: number;
    content: string;
    type: string;
    parent_id: number;
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
  };
}
