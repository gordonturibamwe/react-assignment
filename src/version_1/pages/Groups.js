import React, { useEffect, createRef, useContext, useLayoutEffect, useState } from 'react'
import { useRef } from 'react';
import { AppContext } from '../../App';
import GroupFormModal from '../components/GroupFormModal';
import Nav from '../components/Nav';
import { get, post } from '../helpers/apiCallsHelper';
import GroupListComponent from '../components/GroupListComponent';
import SEO from '../components/SEO';
import { useGroupsCable } from '../helpers/ActionCableHelper';
import {useNotificationsCable } from './..//helpers/ActionCableHelper';


export default function Groups() {
  const {setAlerts, setNotices, setOpen, groups} = useContext(AppContext);
  const filterButtonRefs = useRef([]);
  filterButtonRefs.current = [0,1,2].map((_, index) => filterButtonRefs.current[index] ?? createRef());
  const [filter, setFilter] = useGroupsCable(); // custom userGroups hook
  const [] = useNotificationsCable();

  const joinGroup = (event, groupId) => {
    post({
      path: `join-public-group/${groupId}`,
      headers: {headers: {'Authorization': `Bearer ${localStorage.getItem("token")}`}},
    }).then(response => {
      if(response.status == 200) {
        setNotices(['Successfully Joined group.']);
      } else {
        setAlerts(arr => response.data.errors);
      }
    });
  };

  const requestToJoinPrivateGroup = (event, groupId) => {
    post({
      path: `request-to-join-private-group/${groupId}`,
      headers: {headers: {'Authorization': `Bearer ${localStorage.getItem("token")}`}},
    }).then(response => {
      if(response.status == 200) {
        setNotices(['Request sent to Group.']);
      } else {
        setAlerts(arr => response.data.errors);
      }
    });
  };

  const filterByNavigation = (event, path) => {
    filterButtonRefs.current.map(button =>{
      button.current.classList.remove('border-gray-300', 'bg-gray-200', 'hover:bg-gray-100', 'hover:text-gray', 'text-gray-500')
    });
    event.target.classList.add('border-gray-300', 'bg-gray-200', 'hover:bg-gray-100', 'hover:text-gray', 'text-gray-500');
    setFilter(path)
    event.preventDefault();
  }

  const sendNotification = (event) => {
    post({
      path: `post-notification`,
      headers: {headers: {'Authorization': `Bearer ${localStorage.getItem("token")}`}},
    }).then(response => {
      if(response.status == 200) {
        console.log('SENT NOTICATION');
      } else {
        setAlerts(arr => response.data.errors);
      }
    });

  }

  return(
    <div>
      <SEO
        title='Groups'
        description='This is a description of the group'
        image='https://images.unsplash.com/photo-1661961110144-12ac85918e40?ixlib=rb-1.2.1&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80'
        imageWidth='500'
        imageHeight='500'
      />
      <Nav/>
      <GroupFormModal formTitle="Create New Group"/>
      <div className="max-w-4xl mx-auto  px-4 sm:px-6 lg:px-8 flex">
        <div className="w-full mx-auto pt-6">
          <h1 className="font-bold text-4xl">Groups</h1>
          <button onClick={sendNotification} className="rounded-[4px] w-full sm:w-auto mt-4 sm:mt-0  px-4 py-2 bg-green-600 hover:bg-green-700 border-green-800 text-white block text-sm font-medium shadow-sm">Notifications </button>
          <div className="w-full sm:flex justify-between items-center pt-6" data-controller="buttons">
            <span className="relative z-0 inline-flex shadow-sm rounded-sm" data-buttons-target="parent">
              <button onClick={(event) => filterByNavigation(event, '/')} ref={filterButtonRefs.current[0]} className="-ml-px flex-none border-gray-300 bg-gray-200 hover:bg-gray-100 hover:text-gray text-gray-500 relative inline-flex items-center px-4 py-2 border text-xs font-medium focus:z-10 focus:outline-none focus:ring-0  rounded-l-[4px]">All groups </button>
              <button onClick={(event) => filterByNavigation(event, '/?q=by-me')} ref={filterButtonRefs.current[1]} className="-ml-px flex-none relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-xs font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-0 ">Created by me</button>
              <button onClick={(event) => filterByNavigation(event, '/?q=where-am-member')} ref={filterButtonRefs.current[2]} className="-ml-px flex-none relative inline-flex items-center px-4 py-2 rounded-r-[4px] border border-gray-300 bg-white text-xs font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-0 ">Where I am member</button>
            </span>
            <button onClick={() => setOpen(true)} className="rounded-[4px] w-full sm:w-auto mt-4 sm:mt-0  px-4 py-2 bg-green-600 hover:bg-green-700 border-green-800 text-white block text-sm font-medium shadow-sm">+ Create New Group </button>
          </div>

          <div className="bg-white shadow-xs overflow-hidden border rounded-md mt-6 border-gray-302">
            <ul role="list" className='w-full divide-y divide-gray-200'>
              {groups?.length > 0 && groups.map((group, index) => <GroupListComponent group={group} joinGroup={joinGroup} requestToJoinPrivateGroup={requestToJoinPrivateGroup}/>)}  {/* group={group} index={index} joinGroup={joinGroup} requestToJoinPrivateGroup={requestToJoinPrivateGroup} */}
              {groups?.length == 0 &&
                <li className="flex hover:bg-gray-50 flex-row items-center justify-between flex-basis pr-6">
                  <div className="px-4 py-6 sm:px-6 text-center">
                    <h1 className="font-semibold text-2xl inline-block text-gray-600">No Groups to show</h1>
                  </div>
                </li>
              }
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
