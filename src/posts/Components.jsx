import { Audio } from  'react-loader-spinner'

export function ShowLoading({ loading, children }) {
  return (
    <>
      {loading ? 
        (
          <div>
            <Audio
              height="100"
              width="100"
              color='green'
              ariaLabel='loading'
            /> <span>Loading</span>
          </div>
        ) : children
      }
    </>
  )
}