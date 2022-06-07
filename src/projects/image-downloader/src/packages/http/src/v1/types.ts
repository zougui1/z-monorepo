export interface PopulatedMedia {
  _id: string;
  title: string;
  rating: string;

  file: {
    fileName: string;

    optimizedMedias: {
      fileName: string;
      size: number;
      contentType: string;
    }[];
  };
  group: {
    _id: string;
    posts: Media[];
  };
}

export interface Media {
  _id: string;
  title: string;
  rating: string;

  file: {
    fileName: string;

    optimizedMedias: {
      fileName: string;
      size: number;
      contentType: string;
    }[];
  };
  group: {
    _id: string;
    posts: Media[];
  };
}
