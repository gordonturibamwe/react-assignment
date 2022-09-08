import React from 'react'

export default function GroupJoinButtonsComponent({...props}) {
  return (
    <div className='flex-none'>
      {/* To be used on loading */}
      {props.group.user_id != props.currentUser.id && !props.group?.user_exists_in_group?.request_accepted && props.group.group_access == 'is_public' &&
      <button onClick={(event) => props.joinGroup(event, props.group.id)} className="rounded-[4px] shadow-sm border border-gray-300 hover:text-gray-600 bg-white px-4 py-2 text-gray-600 block text-sm font-medium flex-none">1 Join Group</button>}
      {props.group.user_id != props.currentUser.id && !props.group?.user_exists_in_group?.request_accepted && props.group.group_access == 'is_private' &&
      <button onClick={(event) => props.requestToJoinPrivateGroup(event, props.group.id)}  className="rounded-[4px] shadow-sm border border-gray-300 hover:text-gray-600 bg-white px-4 py-2 text-gray-600 block text-sm font-medium flex-none">Request to Join</button>}

      {/* To be used on websockets */}
      {props.group.user_id != props.currentUser.id && props.group?.user_exists_in_group?.request_accepted && props.group.group_access == 'is_public' &&
      <button onClick={(event) => props.joinGroup(event, props.group.id)} className="rounded-[4px] shadow-sm border border-gray-300 hover:text-gray-600 bg-white px-4 py-2 text-gray-600 block text-sm font-medium flex-none">2 Join Group</button>}
      {props.group.user_id != props.currentUser.id && props.group?.user_exists_in_group?.request_accepted && props.group.group_access == 'is_private' &&
      <button onClick={(event) => props.requestToJoinPrivateGroup(event, props.group.id)}  className="rounded-[4px] shadow-sm border border-gray-300 hover:text-gray-600 bg-white px-4 py-2 text-gray-600 block text-sm font-medium flex-none">Request to Join</button>}
    </div>
  )
}

