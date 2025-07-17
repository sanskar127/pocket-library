import { useState } from 'react'

const Searchbar = () => {
  const [text, setText] = useState<string>("")

  return (
    <form className='w-xl border border-primary py-1 gap-2 flex items-center'>
      <input type="text" value={text} onChange={(e) => setText(e.target.value)} className='flex-1 pl-4 outline-0' disabled placeholder='Type here to search' />
      {text && (
        <button className='' onClick={() => setText("")}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>
      )}
      <button type="submit" className='w-18 mr-1 p-2 text-xl flex justify-center bg-primary'>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
        </svg>
      </button>
    </form>
  )
}

export default Searchbar
