## features

### Search

FA style

- word
- keyword
- operators
  - and
  - or
  - not
  - grouping
- sort
  - by date only
  - order by
    - ASC
    - DESC
- rating
  - SFW
  - NSFW
- type
  - image
  - video
  - story
- misc
  - fav: yes, no, *shrugs*
  - seen: yes, no, *shrugs*
  - group comics together: yes or no
  - group variants together: yes or no

### Browser

#### Posts

- size
  - full height (when possible)
  - variable width
- thumbnail
- e621 style overlay
  - tag for animations
  - tag for flash
- e621/material-ui style info bar
  - [x] title
  - [x] rating (color: SFW = green; NSFW = red)
  - heart icon if faved
  - eye icon if seen
  - tag for comics
    - badge number: number of pages
      - change the style when there is at least 1 new page
    - tooltip on hover
      - number of how many are seen
      - number of how many are new
  - tag for variants
    - badge number: number of variants
      - change the style when there is at least 1 new variant
    - tooltip on hover
      - number of how many are seen
      - number of how many are new
- discord style icon toolbar (when shift is pressed)
  - icon to completely delete the post
    - disable if the post is faved
      - tooltip on hover to say the post can't be deleted because it is fav
    - confirmation dialog on enabled click
  - icon to compare variants (if any)
    - variant comparison view inside a *dialog* on click
    - variant comparison view inside a *page* on CTRL + click

#### Tabs

Firefox style

panic mode (on shortcut):
  - all previews, thumbnails and images are hidden

##### Desktop sized window

parallel loading: 5

- width
  - fixed
  - adapts to the amount of tabs
  - min width, after which it does not shrink further down
  - preview of the post on hover
    - thumbnail size
- tab icon (for browser it is the website's icon)
  - tiny thumbnail (16px) (support for animations)
- loading indicator
  - spinner when is loading (within the 5 prallelized loads)
  - discord style indicator when is waiting (5 posts are already loading)
- close button
  - is hidden if there is too many tabs and the tabs are smaller

##### Mobile sized window

parallel loading: 2

- grid (2 columns)
- swipe to close
- loading indicator
  - spinner when is loading (within the 5 prallelized loads)
  - discord style indicator when is waiting (5 posts are already loading)
- close button
- preview
  - thumbnail size
