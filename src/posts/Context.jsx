import { createContext, useState, useContext } from 'react'

/**
 * @type React.Context<[{ lastPost: { title: String } }, React.Dispatch<React.SetStateAction<{ lastPost: { title: String } }>]>
 */
export const Context = createContext([])

export function PostContext({ children }) {
  const [state, setState] = useState({
    lastPost: {
      title: ''
    }
  })

  return (
    <Context.Provider value={[state, setState]}>
      {children}
    </Context.Provider>
  )
}

export function useChangeTitleCtx() {
  const [ctx, setCtx] = useContext(Context)
  
  function changeTitleCtx(title)
  {
    setCtx({
      ...ctx,
      lastPost: {
        title
      }
    })
  }
  
  return changeTitleCtx
}