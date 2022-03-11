import React from 'react'

export function useMediaQuery(query: string): boolean | undefined {
  // Keep track of the preference in state, start with the current match
  const [isMatch, setIsMatch] = React.useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia && window.matchMedia(query).matches
    }
  })

  // Watch for changes
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      if (!window.matchMedia) {
        return
      }

      // Create a matcher
      const matcher = window.matchMedia(query)

      // Create our handler
      const onChange = ({ matches }: MediaQueryListEvent) =>
        setIsMatch(matches)

      // Listen for changes
      matcher.addEventListener('change', onChange)

      return () => {
        // Stop listening for changes
        matcher.removeEventListener('change', onChange)
      }
    }
  }, [query])

  return isMatch
}
