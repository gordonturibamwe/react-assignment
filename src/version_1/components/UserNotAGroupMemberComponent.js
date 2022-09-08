import React from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'

export default function UserNotAGroupMember({...props}) {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className='pb-10 h-[90vh] text-center flex flex-col items-center justify-center'>
        <h1 className="font-semibold text-center text-4xl mr-4 capitalize text-gray-600">{props.groupName}</h1>
        <div className="mt-0 post text-md text-gray-600 text-center py-6 max-w-[300px]">You need to be a member to view posts and fellow members.</div>

        {props.groupAccess == 'is_public' &&
          <button className="rounded-[4px] mx-auto shadow-sm border border-gray-300 hover:text-gray-600 bg-white px-10 py-3 text-gray-600 block text-sm font-medium flex-none">Join Group</button>}
        {props.groupAccess == 'is_private' &&
          <button className="rounded-[4px] mx-auto shadow-sm border border-gray-300 hover:text-gray-600 bg-white px-10 py-3 text-gray-600 block text-sm font-medium flex-none">Request to Join</button>}


        <Link to='/'className="block text-xs text-gray-400 w-full mt-6"><FontAwesomeIcon icon={faArrowLeft} /> BACK</Link>
      </div>
    </div>
  )
}
