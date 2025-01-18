import React from 'react'
import EventSearch from './EventSearch'
import { Button } from '@nextui-org/button'

function SearchBar() {
  return (
    <div className='bg-white/5 w-[90vw] sm:w-[60vw] md:w-[50vw] lg:w-[40vw] xl:w-max
    p-8 xl:pl-8 xl:pr-2 h-auto xl:h-[70px] rounded-3xl xl:rounded-full backdrop-blur-[20px]
    flex flex-col xl:flex-row items-center gap-6 mx-auto text-sm text-white'>
        {/* Search */}
        <EventSearch />
        {/* Location */}
        <div>Location</div>
        {/* Date */}
        <div>Date</div>
        {/* Submit */}
        <Button className='w-full xl:w-auto rounded-3xl xl:rounded-full' color='primary'>Submit</Button>
    </div>
  )
}

export default SearchBar