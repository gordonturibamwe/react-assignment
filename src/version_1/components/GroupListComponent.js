import React, {useContext} from 'react'
import { Link } from 'react-router-dom'
import TimeAgo from 'react-timeago'
import englishStrings from 'react-timeago/lib/language-strings/en'
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter'
import { AppContext } from '../../App'
import { parseWithOptions } from 'date-fns/fp'
import GroupJoinButtonsComponent from './GroupJoinButtonsComponent'

export default function GroupListComponent({...props}) {
  const {currentUser, group, setGroup} = useContext(AppContext);
  const formatter = buildFormatter(englishStrings);

    //TODO: DELETE THIS
  function onGroupClick(event, clickedGroup) { //  onClick={(event) => onGroupClick(event, props.group)}
    setGroup({...clickedGroup});
  }

  return (
    <li id={props.group.id} key={props.group.id} className="sm:flex hover:bg-gray-50 flex-row items-center justify-between flex-basis pr-6">
      <Link to={`/group/${props.group.id}`} state={{group: group}} className="block hover:bg-gray-50 w-full">
        <div className="px-4 sm:py-6 pt-6 sm:px-6">
          <div className="flex items-center justify-between">
            <h1 className="font-semibold text-2xl inline-block mb-2 text-gray-600">
              {props.group.name} {currentUser.username}
              {props.group.user_id == currentUser.id && <span className="px-2 ml-2 inline-flex text-xs rounded-full bg-green-100 text-green-800 mt-1">Created by You</span>}
              {props.group.group_access == 'is_secret' && <span className="px-2 ml-2 inline-flex text-xs rounded-full bg-orange-100 text-orange-800 -mt-1">Secret Group</span>}
            </h1>
          </div>
          <div className="mt-1 sm:flex sm:justify-between">
            <div className="flex">
              <p className="flex items-center text-xs text-gray-500 mr-2">{props.group.total_members} Members</p>
              <p className="flex items-center text-xs text-gray-500 mr-2">{props.group.total_posts} Posts</p>
              <p className="flex items-center text-xs text-gray-500"><span className='mr-1'>Last activity </span><TimeAgo date={props.group.last_activity} formatter={formatter} /></p>
            </div>
          </div>
        </div>
      </Link>
      <GroupJoinButtonsComponent group={props.group} currentUser={currentUser} joinGroup={props.joinGroup} requestToJoinPrivateGroup={props.requestToJoinPrivateGroup}/>
    </li>
  )
}
