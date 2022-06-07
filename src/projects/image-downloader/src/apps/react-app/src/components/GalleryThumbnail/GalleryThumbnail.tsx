import { useRef } from 'react';
import {
  ImageListItem,
  ImageListItemBar,
  Typography,
  IconButton,
  Tooltip,
  Badge,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import _ from 'lodash';

import config from '@zougui/common.config/browser/from-env';
import type { PopulatedMedia } from '@zougui/image-downloader.http/v1';

import { MediaThumbnail } from '~/components/MediaThumbnail';
import { useHover } from '~/hooks';

export const GalleryThumbnail = ({ media, isShiftKeyDown }: GalleryThumbnailProps) => {
  const ref = useRef<HTMLLIElement | null>(null);
  const isHovered = useHover(ref);

  return (
    <ImageListItem ref={ref} style={{ overflow: 'hidden', minHeight: 200 }}>
      {isHovered && isShiftKeyDown && (
        <ImageListItemBar
          actionIcon={
            <>
              <IconButton>
                <DeleteIcon color="error" />
              </IconButton>
            </>
          }
          position="top"
          style={{ boxShadow: '#000 1px 0px 4px 1px', justifyContent: 'right', left: 'unset' }}
        />
      )}

      <MediaThumbnail
        media={media}
        style={{ display: 'block', width: '100%', height: '100%' }}
        imgProps={{
          style: {
            //objectFit: 'contain',
            width: '100%',
            height: '100%',
            maxWidth: '100%',
          },
        }}
      />

      <ImageListItemBar
        title={
          <Tooltip title={media.title}>
            <Typography noWrap>{media.title}</Typography>
          </Tooltip>
        }
        style={{ boxShadow: '#000 1px 0px 4px 1px' }}
        subtitle={
          <div style={{ display: 'flex' }}>
            {media.rating === 'SFW'
              ? <Typography color={theme => theme.palette.success.main}>S</Typography>
              : <Typography color={theme => theme.palette.error.main}>E</Typography>
            }

            {media.group.posts.length > 1 && (
              <Badge variant="dot" color="success">
                <Tooltip
                  title={
                    <>
                      <Typography>Variants: {media.group.posts.length - 1}</Typography>
                    </>
                  }
                >
                  <Typography>V</Typography>
                </Tooltip>
              </Badge>
            )}
          </div>
        }
      />
    </ImageListItem>
  );
}

export interface GalleryThumbnailProps {
  media: PopulatedMedia;
  isShiftKeyDown?: boolean | undefined;
}
