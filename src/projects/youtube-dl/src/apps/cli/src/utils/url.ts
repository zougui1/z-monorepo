const videoIdParamName = 'v';

export const cleanYoutubeUrl = (url: string): string => {
  const parsedUrl = new URL(url);

  parsedUrl.searchParams.forEach((value, name) => {
    if (name !== videoIdParamName) {
      parsedUrl.searchParams.delete(name);
    }
  });

  return parsedUrl.toString();
}
