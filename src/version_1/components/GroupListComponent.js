import React, {useContext} from 'react'
import { Link } from 'react-router-dom'
import TimeAgo from 'react-timeago'
import englishStrings from 'react-timeago/lib/language-strings/en'
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter'
import { AppContext } from '../../App'

export default function GroupListComponent({...props}) {
  const formatter = buildFormatter(englishStrings);
  const {currentUser} = useContext(AppContext);

  return (
    <li id={props.group.id} key={props.group.id} className="flex hover:bg-gray-50 flex-row items-center justify-between flex-basis pr-6">
      <Link to={`/group/${props.group.id}`} state={{groupName: props.group.name}} className="block hover:bg-gray-50 w-full">
        <div className="px-4 py-6 sm:px-6">
          <div className="flex items-center justify-between">
            <h1 className="font-semibold text-2xl inline-block mb-2 text-gray-600">
              {props.group.name}
              {props.group.user_id == currentUser.id && <span className="px-2 ml-2 inline-flex text-xs rounded-full bg-green-100 text-green-800 mt-1">Created by You</span>}
              {props.group.group_access == 'is_secret' && <span className="px-2 ml-2 inline-flex text-xs rounded-full bg-orange-100 text-orange-800 -mt-1">Secret Group</span>}
            </h1>
          </div>
          <div className="mt-1 sm:flex sm:justify-between">
            <div className="sm:flex">
              <p className="flex items-center text-xs text-gray-500 mr-2">{props.group.total_members} Members</p>
              <p className="flex items-center text-xs text-gray-500 mr-2">{props.group.total_posts} Posts</p>
              <p className="flex items-center text-xs text-gray-500"><span className='mr-1'>Last activity </span><TimeAgo date={props.group.last_activity} formatter={formatter} /></p>
            </div>
          </div>
        </div>
      </Link>
      {/* To be used on loading */}
      {props.group?.user_exists_in_group?.user_id != currentUser.id && !props.group?.user_exists_in_group?.request_accepted && props.group.group_access == 'is_public' &&
        <button onClick={(event) => props.joinGroup(event, props.group.id)} className="rounded-[4px] shadow-sm border border-gray-300 hover:text-gray-600 bg-white px-4 py-2 text-gray-600 block text-sm font-medium flex-none">Join Group</button>}
      {props.group?.user_exists_in_group?.user_id != currentUser.id && !props.group?.user_exists_in_group?.request_accepted && props.group.group_access == 'is_private' &&
        <button className="rounded-[4px] shadow-sm border border-gray-300 hover:text-gray-600 bg-white px-4 py-2 text-gray-600 block text-sm font-medium flex-none">Request to Join</button>}

      {/* To be used on websockets */}
      {props.group?.user_exists_in_group?.user_id != currentUser.id && props.group?.user_exists_in_group?.request_accepted && props.group.group_access == 'is_public' &&
        <button onClick={(event) => props.joinGroup(event, props.group.id)} className="rounded-[4px] shadow-sm border border-gray-300 hover:text-gray-600 bg-white px-4 py-2 text-gray-600 block text-sm font-medium flex-none">Join Group</button>}
      {props.group?.user_exists_in_group?.user_id != currentUser.id && props.group?.user_exists_in_group?.request_accepted && props.group.group_access == 'is_private' &&
        <button className="rounded-[4px] shadow-sm border border-gray-300 hover:text-gray-600 bg-white px-4 py-2 text-gray-600 block text-sm font-medium flex-none">Request to Join</button>}
    </li>
  )
}
