import { ImageList } from '~/components/ImageList';
import { GalleryThumbnail } from '~/components/GalleryThumbnail';
import { useKeyDown } from '~/hooks';
import { reactMediaHttp } from '~/utils';

export const GalleryScreen = () => {
  const { data, error } = reactMediaHttp.getMedias().useQuery();
  const medias = data?.data || [];

  const isShiftKeyDown = useKeyDown('Shift');
  console.log(medias)

  return (
    <>
      <span>image count: {medias.length}</span>
      <pre>
        <code lang="json">
          {JSON.stringify(error, null, 2)}
        </code>
      </pre>
      <ImageList
        variant="standard"
        gap={24}
        maxColWidth={150}
        cols="auto"
      >
        {medias.map((media: any) => (
          <GalleryThumbnail key={media._id} media={media} isShiftKeyDown={isShiftKeyDown} />
        ))}
      </ImageList>
    </>
  );
}
