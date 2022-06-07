import type { Media } from '@zougui/image-downloader.http/v1';
import config from '@zougui/common.config/browser/from-env';

const apiServer = config.media.apiServer.url;

export const MediaThumbnail = ({ media, imgProps = {}, ...pictureProps }: MediaThumbnailProps) => {
  const altSources = media.file.optimizedMedias.slice().sort((a: any, b: any) => a.size - b.size);

  return (
    <picture {...pictureProps}>
      {altSources.map((image: any) => (
        <source
          key={image.fileName}
          srcSet={`${apiServer}/api/v1/medias/file/${image.fileName}`}
          type={image.contentType}
        />
      ))}

      <img
        alt={media.title}
        loading="lazy"
        {...imgProps}
        src={`${apiServer}/api/v1/medias/file/${media.file.fileName}`}
      />
    </picture>
  );
}

export interface MediaThumbnailProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> {
  media: Media;
  imgProps?: JSX.IntrinsicElements['img'] | undefined;
}
