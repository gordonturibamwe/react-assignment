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
import SEO from '../components/SEO';
import GroupPostsComponent from '../components/GroupPostsComponent';

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
        connected: ()=>{},
        disconnected: ()=>{},
      },
    );
    return () => CableApp.cable.disconnect()
  }, [CableApp.subscriptions, userGroupRequests, setUserGroupRequests, groupMembers, setGroupMembers]);

  return (
    <>
      <SEO
        title={group.name}
        description='This is a description of the group'
        image='https://images.unsplash.com/photo-1661961110144-12ac85918e40?ixlib=rb-1.2.1&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80'
        imageWidth='500'
        imageHeight='500'
      />
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
              <PostForm id={group.id} buttonTitle="+ Post"/>

              <GroupPostsComponent/>
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
