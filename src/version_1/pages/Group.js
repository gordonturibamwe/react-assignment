import React, { useState, useLayoutEffect, useContext, useEffect } from 'react'
import GroupFormModal from '../components/GroupFormModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCog, faTimes, faCheck, faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { AppContext } from '../../App';
import { get } from '../helpers/apiCallsHelper';
import PostForm from '../components/PostForm';
import Nav from '../components/Nav';
import { useLocation, useNavigate } from 'react-router-dom';
import LoadingComponent from '../components/LoadingComponent';
import UserNotAGroupMemberComponent from '../components/UserNotAGroupMemberComponent';
import GroupMembersComponent from '../components/GroupMembersComponent'
import GroupUserRequestsComponent from '../components/GroupUserRequestsComponent'
import SecretGroupInvitesComponent from '../components/SecretGroupInvitesComponent'
import UsernameListComponent from '../components/UsernameListComponent';

export default function Group() {
  const {
    currentUser, setCurrentUser,
    setuserLoggedIn,
    setAlerts, setNotices,
    open, setOpen,
    group, setGroup,
    userGroupRequests, setUserGroupRequests,
    groupMembers, setGroupMembers,
    searchUsers, setUserchUsers,
    CableApp
  } = useContext(AppContext);
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useLayoutEffect(() => {
    setGroup({...location.state.group});
    get({
      path: `${location.pathname}`,
      headers: {headers: {'Authorization': `Bearer ${localStorage.getItem("token")}`}},
    }).then(response => {
      if(response.status == 200) {
        setGroup({...response.data});
        setuserLoggedIn(true);
      } else {
        setAlerts(arr => response.data.error ? [response.data.error] : response.data?.errors);
        if(response.data.error == 'Not Found')
          navigate('/', {replace: true});
      }
      setLoading(false);
    });
  }, []);

  useEffect(() => { // CONNECTING ACTION CABLE TO GROUPSCHANNEL
    CableApp.cable.subscriptions.create(
      {channel: 'UsersGroupChannel'}, {
        received: (data) => {
          setCurrentUser(currentUser);
          if(data.group_id == group.id) {
            if(data.request_accepted && data.action == 'create') {
              console.log('1 created');
              groupMembers.push(data);
              setGroupMembers([...groupMembers]);
            } else if(data.request_accepted && data.action == 'update') {
              setUserGroupRequests([...userGroupRequests.filter((request) => request.id != data.id)]);
              console.log('update');
              groupMembers.push(data);
              setGroupMembers([...groupMembers]);
            } else if(data.request_accepted && data.action == 'destroy') {
              console.log('1 destroy');
              setGroupMembers([...groupMembers.filter((request) => request.id != data.id)]);
            } else if(!data.request_accepted && data.action == 'destroy') {
              console.log('2 destroy');
              setUserGroupRequests([...userGroupRequests.filter((request) => request.id != data.id)]);
            } else if(!data.request_accepted && data.action == 'create') {
              userGroupRequests.push(data);
              console.log('2 create', userGroupRequests);
              setUserGroupRequests([...userGroupRequests])
            }
          }
        },
        connected: () => {console.log('USER GROUP CONNECTED');},
        disconnected: (e) => console.log('USER GROUP DISCONNECTED', e),
      },
    );
    return () => CableApp.cable.disconnect()
  }, [CableApp.subscriptions, userGroupRequests, setUserGroupRequests, groupMembers, setGroupMembers]);

  return (
    <>
      <Nav/>
      {loading ?
        <LoadingComponent/> :
      !group.user_exists_in_group?.request_accepted || group.user_exists_in_group?.secret_group_invitation ?
        <UserNotAGroupMemberComponent group={group}/> :
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className='grid grid-cols-4 gap-x-8 pt-6'>
            <div className='col-span-3 min-h-[350px]'>
              <GroupFormModal action='update'/>
              <div className="flex flex-row w-full mt-6 items-center">
                <h1 className="font-semibold text-4xl mr-4 capitalize text-gray-600">{group.name}</h1>
                {currentUser.id == group.user_id && <button onClick={() => setOpen(true)} className="text-3xl inline-block text-green-600"><FontAwesomeIcon icon={faCog} /></button>}
              </div>
              <PostForm buttonTitle="+ Post"/>

              <div className='w-full pb-10'>
                <h1 className="font-semibold text-3xl mr-4 capitalize text-gray-600 mt-4">All Posts</h1>
                <div className="mt-6 border rounded-[4px] shadow-sm" id="dfdfdf">
                  <div className='p-5 pb-2'>
                    <h1 className="font-medium text-3xl inline-block mb-3 text-gray-600 w-4/5 font-serif">For a More Creative Brain Follow These 5 Steps</h1>
                    <div className="mt-0 post text-sm text-gray-600"> early all great ideas follow a similar creative process and this article explains how this process works. Understanding this is important because creative thinking is one of the most useful skills you can possess. Nearly every problem you face in work and in life can benefit from innovative solutions, lateral thinking, and creative ideas..</div>
                    <span className="mt-4 block text-xs text-gray-400 font-normal" id="_<%= post.id %>">
                      <span>Last comment 4 mins ago</span> .
                      <span className="mr-1 ml-1 inline-block"><a href='/'>Edit</a></span> .
                      <span className="mr-1 ml-1 inline-block"><a href='/'>Delete</a></span> .
                      <span className="mr-1 ml-1 inline-block">Created by Username</span>
                    </span>
                  </div>
                  <a href='/post/dsfsfs' className='bg-gray-50 block w-full px-5 py-3 mt-3 text-gray-400 hover:text-gray-500 rounded-b-[4px] border-t'>
                    <p className='truncate text-sm font-medium text-green-600'>View Post <span className='inline-block ml-2 text-xs'><FontAwesomeIcon icon={faArrowRight} /></span></p>
                  </a>
                </div>

                <div className="mt-6 border rounded-[4px] shadow-sm" id="dfdfdf">
                  <div className='p-5 pb-2'>
                    <h1 className="font-medium text-3xl inline-block mb-3 text-gray-600 w-4/5 font-serif">The Surprising Benefits of Journaling One Sentence Every Day</h1>
                    <div className="mt-0 post text-sm text-gray-600">Throughout the 1980s and 1990s, the “Queen of All Media” built a brand that stretched far beyond the television screen. She went on to become a billionaire, a well-regarded philanthropist, and a recipient of the Presidential Medal of Freedom. And as she was busy working toward these otherworldly accomplishments, Oprah relied on a simple habit: journaling..</div>
                    <span className="mt-4 block text-xs text-gray-400 font-normal" id="_<%= post.id %>">
                      <span>Last comment 29 days ago</span> .
                      <span className="mr-1 ml-1 inline-block">Created by Kalanzi</span>
                    </span>
                  </div>
                  <a href='/post/dsfsfs' className='bg-gray-50 block w-full px-5 py-3 mt-3 text-gray-400 hover:text-gray-500 rounded-b-[4px] border-t'>
                    <p className='truncate text-sm font-medium text-green-600'>View Post <span className='inline-block ml-2 text-xs'><FontAwesomeIcon icon={faArrowRight} /></span></p>
                  </a>
                </div>

                <div className="mt-6 border rounded-[4px] shadow-sm" id="dfdfdf">
                  <div className='p-5 pb-2'>
                    <h1 className="font-medium text-3xl inline-block mb-3 text-gray-600 w-4/5 font-serif">The true story of the fake US embassy in Ghana</h1>
                    <div className="mt-0 post text-sm text-gray-600">The story was an immediate hit. “In less than an hour we were getting 20,000 views on the website for that story alone,” Emmanuel Dogbevi, the website’s managing editor, told me. Two days later, the news agency Reuters picked up the story and it swiftly became an international sensation.</div>
                    <span className="mt-4 block text-xs text-gray-400 font-normal" id="_<%= post.id %>">
                      <span>Last comment 4 mins ago</span> .
                      <span className="mr-1 ml-1 inline-block"><a href='/'>Edit</a></span> .
                      <span className="mr-1 ml-1 inline-block"><a href='/'>Delete</a></span> .
                      <span className="mr-1 ml-1 inline-block">Created by Username</span>
                    </span>
                  </div>
                  <a href='/post/dsfsfs' className='bg-gray-50 block w-full px-5 py-3 mt-3 text-gray-400 hover:text-gray-500 rounded-b-[4px] border-t'>
                    <p className='truncate text-sm font-medium text-green-600'>View Post <span className='inline-block ml-2 text-xs'><FontAwesomeIcon icon={faArrowRight} /></span></p>
                  </a>
                </div>
              </div>
            </div>
            <div className='col-span-1 min-h-[50px] mt-6 pt-2'>
              {group.group_access == 'is_secret' && currentUser.id == group.user_id && <UsernameListComponent/>}
              <GroupMembersComponent group={group}/>
              <GroupUserRequestsComponent group={group}/>
              {false && group.group_access == 'is_secret' && <SecretGroupInvitesComponent group={group}/>}
            </div>
          </div>
        </div>
    }
    </>
  )
}

// Toolbar editor
// https://github.com/abhaynikam/react-trix-rte/blob/master/src/components/ReactTrixRTEToolbar/constants.js

// ReactTrixRTEInput
// https://github.com/abhaynikam/react-trix-rte/blob/master/src/components/ReactTrixRTEInput/ReactTrixRTEInput.jsx
