import React from 'react'

export default function GroupJoinButtonsComponent({...props}) {
  return (
    <div className='flex-none pb-4 sm:pb-0'>
      {/* BUTTONS FOR PUBLIC GROUP */}
      {(props.currentUser.id != props.group.user_id &&
      props.group?.user_exists_in_group?.user_id != props.currentUser.id &&
      !props.group?.user_exists_in_group?.request_accepted &&
      props.group.group_access == 'is_public') ?
        <button onClick={(event) => props.joinGroup(event, props.group.id)} className="rounded-[4px] shadow-sm border border-gray-300 hover:text-gray-600 bg-white px-4 py-2 text-gray-600 block text-sm font-medium flex-none">Join Group</button> :
        props.group.group_access == 'is_public' &&
        <button className=" text-gray-400 block font-normal text-xs flex-none">You are a Member</button>
      }

      {/* BUTTONS FOR PRIVATE GROUP */}
      {props.currentUser.id != props.group.user_id &&
      props.group?.user_exists_in_group?.user_id != props.currentUser.id &&
      !props.group?.user_exists_in_group?.request_accepted &&
      props.group.group_access == 'is_private' ?
        <button onClick={(event) => props.requestToJoinPrivateGroup(event, props.group.id)} className="rounded-[4px] shadow-sm border border-gray-300 hover:text-gray-600 bg-white px-4 py-2 text-gray-600 block text-sm font-medium flex-none">Request to Join</button> :
      props.currentUser.id != props.group.user_id &&
      !props.group?.user_exists_in_group?.request_accepted &&
      props.group.group_access == 'is_private' ?
        <button className=" text-gray-400 block font-normal text-xs flex-none">Waiting Approval</button> :
        <span></span>
      }

      {props.group.group_access == 'is_secret' && props.group?.user_exists_in_group?.request_accepted ?
        <button className=" text-gray-400 block font-normal text-xs flex-none">You are a Member</button> :
        <span></span>}
    </div>
  )
}
