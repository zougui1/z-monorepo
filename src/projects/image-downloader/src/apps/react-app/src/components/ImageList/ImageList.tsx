import {
  ImageList as MuiImageList,
  ImageListProps as MuiImageListProps,
} from '@mui/material';

export const ImageList = ({ maxColWidth, cols, ...muiProps }: ImageListProps) => {
  const actualCols = cols === 'auto' ? undefined : cols;

  const style = cols === 'auto' ? {
    ...(muiProps.style || {}),
    gridTemplateColumns: `repeat(auto-fill, ${maxColWidth || 100}px)`,
  } : muiProps.style;

  return (
    <MuiImageList
      {...muiProps}
      cols={actualCols}
      style={style}
    />
  );
}

export interface ImageListProps extends Omit<MuiImageListProps, 'cols'> {
  maxColWidth?: number | undefined;
  cols?: 'auto' | MuiImageListProps['cols'] | undefined;
}
