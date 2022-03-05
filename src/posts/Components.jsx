import { Audio, Rings } from  'react-loader-spinner'

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

export function ShowProcessing({ loading, children }) {
  return (
    <>
      {loading ? 
        (
          <div className="text-center">
            <Rings
              height="100"
              width="100"
              color='green'
              ariaLabel='loading'
            /> <span>Processing...</span>
          </div>
        ) : children
      }
    </>
  )
}

export function PostContent({ post, title }) {
  return (
    <div>
      <h2>{title} # <span className="text-green-600"> {post.id} </span></h2>
      <div className="mt-3">
        <h3 className="text-2xl font-bold mb-3 tracking-wider"> {post.title} </h3>
        <p className="text-red-500 text-sm" x-text="data.author"> {post.author} </p>
      </div>
    </div>
  )
}