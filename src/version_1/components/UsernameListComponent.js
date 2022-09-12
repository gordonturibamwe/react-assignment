import React, { useContext, useEffect, useRef, useState } from 'react'
import LoadingSpinnerComponent from '../components/LoadingSpinnerComponent';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes, faCheck } from '@fortawesome/free-solid-svg-icons'
import { AppContext } from '../../App';
import { get, post, patch, destroy } from '../helpers/apiCallsHelper';

export default function UsernameListComponent() {
  const {
    setuserLoggedIn,
    setAlerts, setNotices,
    group, setGroup,
    groupMembers, setGroupMembers,
    searchUsers, setUserchUsers,
    CableApp
  } = useContext(AppContext);
  const searchInputRef = useRef(null);

  function searchByUsername(event) {
    // search-user/:username
    console.log(event.target.value);
    const value = event.target.value;
    if (value == '') setUserchUsers([]);
    if(!value.match(/[a-zA-Z0-9]/)) return
    else
      get({
        path: `search-user/${value.replace('@', '')}`,
        headers: {headers: {'Authorization': `Bearer ${localStorage.getItem("token")}`}},
      }).then(response => {
        console.log(response.data)
        if(response.status == 200) {
          setUserchUsers([...response.data.users]);
          console.log('sss', searchUsers);
          setGroupMembers([...groupMembers]);
          setuserLoggedIn(true);
        } else {
          setUserchUsers([]);
        }
      });
  }

  function inviteUser(event, user) {
    console.log(event.target.innerText);
    post({
      path: `invite-user-to-secret-group/${group.id}/user/${user.id}`,
      headers: {headers: {'Authorization': `Bearer ${localStorage.getItem("token")}`}},
    }).then(response => {
      console.log(response.data);
      if(response.status == 200) {
        setNotices(['Invite sent to Group.']);
        fetchGroupMember();
      } else {
        setAlerts(arr => response.data.errors);
      }
      searchInputRef.current.value = '';
      setUserchUsers([]);
    });
  }

  function fetchGroupMember() {
    get({
      path: `group/${group.id}/members`,
      headers: {headers: {'Authorization': `Bearer ${localStorage.getItem("token")}`}},
    }).then(response => {
      if(response.status == 200) {
        setGroupMembers([...response.data.members]);
        setuserLoggedIn(true);
      }
    });
  }

  return (
    <span className='relative mb-4 block'>
      <input
        id="email-address"
        name="username"
        ref={searchInputRef}
        onChange={(event) => searchByUsername(event)}
        type="text"
        autoComplete="username"
        className="relative flex-grow block w-full appearance-none rounded-[3px] border border-gray-300 px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:z-10 focus:border-green-500 focus:outline-none focus:ring-green-500 sm:text-sm"
        placeholder="Invite @user"
      />
      {searchUsers.length > 0 &&
      <div className="overflow-y-hidden bg-white absolute w-[184px] top-[38px] z-10">
        <ul role="list" className="divide-y divide-gray-200 border sm:rounded-[4px]">
          {searchUsers.map(user => (
            <li key={user.id} className="cursor-pointer">
              <span href="#" key={user.id} onClick={(event) => inviteUser(event, user)} className="block hover:bg-gray-50 px-3 py-2 truncate text-sm font-medium text-green-600">
                {user.username}
              </span>
            </li>
          ))}
        </ul>
      </div>}
    </span>
  )
}
