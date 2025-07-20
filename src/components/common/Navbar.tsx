// import Searchbar from './Searchbar'

import Breadcrumbs from "./Breadcrumbs"

const Navbar = () => {
  return (
    <nav className='flex items-center justify-start p-4'>
      {/* <Searchbar/> */}
      <Breadcrumbs/>
    </nav>
  )
}

export default Navbar
