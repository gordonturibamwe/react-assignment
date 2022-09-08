import React, { useEffect, createRef, useContext, useLayoutEffect, useState } from 'react'
import { useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../../App';
import GroupFormModal from '../components/GroupFormModal';
import Nav from '../components/Nav';
import { get, post } from '../helpers/apiCallsHelper';
import GroupListComponent from '../components/GroupListComponent';

export default function Groups() {
  const {setCurrentUser, setuserLoggedIn, setAlerts, userLoggedIn, setNotices, currentUser, open, setOpen, CableApp} = useContext(AppContext);
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);
  const filterButtonRefs = useRef([]);
  filterButtonRefs.current = [0,1,2].map((_, index) => filterButtonRefs.current[index] ?? createRef());
  const [filter, setFilter] = useState('');

  useLayoutEffect(() => {
    // navigate('/', {replace: true}); // if the url showed any other path
    get({
      path: `all-groups${filter}`,
      headers: {headers: {'Authorization': `Bearer ${localStorage.getItem("token")}`}},
    }).then(response => {
      console.log('---', response.data);
      if(response.status == 200) {
        setGroups(groups => [...response.data['groups']]);
        setuserLoggedIn(true);
      } else {
        setAlerts(arr => response.data.errors);
      }
      console.log('+++', groups);
    });
  }, [filter]);

  const joinGroup = (event, groupId) => {
    console.log(event, groupId);
    post({
      path: `join-public-group/${groupId}`,
      headers: {headers: {'Authorization': `Bearer ${localStorage.getItem("token")}`}},
    }).then(response => {
      console.log(response.data);
      if(response.status == 200) {
        setNotices(['Successfully Joined group.']);
      } else {
        setAlerts(arr => response.data.errors);
      }
    });
  };

  const requestToJoinPrivateGroup = (event, groupId) => {
    console.log(event, groupId);
    post({
      path: `request-to-join-private-group/${groupId}`,
      headers: {headers: {'Authorization': `Bearer ${localStorage.getItem("token")}`}},
    }).then(response => {
      console.log(response.data);
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

  useEffect(() => { // CONNECTING ACTION CABLE TO GROUPSCHANNEL
    CableApp.cable.subscriptions.create(
      {channel: 'GroupsChannel'}, {
        received: (data) => {
          console.log('FROM group----', data);
          if(data['action'] == 'create') {
            groups.unshift(data);
            setGroups([...groups]);
            setCurrentUser(currentUser);
          } else if(data['action'] == 'update') {
            const _group = groups.find((gp) => gp.id == data.id);
            const _groupIndex = groups.indexOf(_group);
            groups[_groupIndex] = data;
            setGroups([...groups]);
            setCurrentUser(currentUser);
          }
        },
        connected: () => {console.log('CONNECTED');},
        disconnected: (e) => console.log('DISCONNECTED', e),
      },
    );
    return () => CableApp.cable.disconnect()
  }, [CableApp.subscriptions, groups, setGroups]);

  //  loading ? <LoadingComponent/> :
  return(
    <div>
      <Nav/>
      <GroupFormModal/>
      <div className="max-w-4xl mx-auto  px-4 sm:px-6 lg:px-8 flex">
        <div className="w-full mx-auto pt-6">
          <h1 className="font-bold text-4xl">Groups</h1>
          <div className="w-full flex justify-between items-center pt-6" data-controller="buttons">
            <span className="relative z-0 inline-flex shadow-sm rounded-sm" data-buttons-target="parent">
              <button onClick={(event) => filterByNavigation(event, '/')} ref={filterButtonRefs.current[0]} className="-ml-px border-gray-300 bg-gray-200 hover:bg-gray-100 hover:text-gray text-gray-500 relative inline-flex items-center px-4 py-2 border text-xs font-medium focus:z-10 focus:outline-none focus:ring-0  rounded-l-[4px]">All groups </button>
              <button onClick={(event) => filterByNavigation(event, '/?q=by-me')} ref={filterButtonRefs.current[1]} className="-ml-px relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-xs font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-0 ">Created by me</button>
              <button onClick={(event) => filterByNavigation(event, '/?q=where-am-member')} ref={filterButtonRefs.current[2]} className="-ml-px relative inline-flex items-center px-4 py-2 rounded-r-[4px] border border-gray-300 bg-white text-xs font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-0 ">Where I am member</button>
            </span>
            <button onClick={() => setOpen(true)} className="rounded-[4px]  px-4 py-2 bg-green-600 hover:bg-green-700 border-green-800 text-white block text-sm font-medium shadow-sm">+ Create New Group </button>
          </div>

          <div className="bg-white shadow-xs overflow-hidden border rounded-md mt-6 border-gray-302">
            <ul role="list" className='w-full divide-y divide-gray-200'>
              {groups?.length > 0 && groups.map((group, index) => <GroupListComponent group={group} index={index} joinGroup={joinGroup} requestToJoinPrivateGroup={requestToJoinPrivateGroup}/>)}
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


// if(data['action'] == 'update') {
//   // UPDATE ACTION IN THE RESPONSE DATA
//   // const found = groupTitles.find((element) => element['id'] == data['id']);
//   // const index = groupTitles.indexOf(found);
//   // groupTitles[index] = data;
//   // setGroupTitles([...groupTitles]);
// } else if(data['action'] == 'create') {
//   // CREAT ACTION IN THE RESPONSE DATA
//   // groupTitles.unshift(data);
//   // setGroupTitles([...groupTitles]);
// } else if(data['action'] == 'delete') {
//   // DELETE ACTION IN THE RESPONSE DATA
//   // setGroupTitles([...groupTitles.filter((element) => element['id'] != data['id'])]);
// }
