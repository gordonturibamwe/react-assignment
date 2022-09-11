import React, { useContext, useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { AppContext } from '../../App';
import LoadingSpinnerComponent from './LoadingSpinnerComponent';
import { get, destroy } from '../helpers/apiCallsHelper';
import { useNavigate } from 'react-router-dom';

export default function SecretGroupInvitesComponent({...props}) {
  const {
    currentUser, setCurrentUser,
    setuserLoggedIn,
    setAlerts, setNotices,
    userGroupRequests, setUserGroupRequests,
    groupInvites, setGroupInvites,
    CableApp
  } = useContext(AppContext);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    get({
      path: `group/${props.group.id}/secret-group-invites`,
      headers: {headers: {'Authorization': `Bearer ${localStorage.getItem("token")}`}},
    }).then(response => {
      if(response.status == 200) {
        setGroupInvites([...response.data.invites]);
        setuserLoggedIn(true);
      } else {
        setAlerts(arr => response.data.error ? [response.data.error] : response.data?.errors);
      }
      setLoading(false);
    });
  }, []);

  const deleteUserGroupRequest = (event, userGroupRequest) => {
    event.preventDefault();
    destroy({
      path: `destroy-group-request/${userGroupRequest.id}`,
      headers: {headers: {'Authorization': `Bearer ${localStorage.getItem("token")}`}},
    }).then(response => {
      console.log(response.data.group_requests);
      if(response.status == 200) {
        setNotices(['User deleted from group.']);
        if(currentUser.id == userGroupRequest.user.id)
          navigate('/', {replace: true});

      } else {
        setAlerts(arr => response.data.error ? [response.data.error] : response.data?.errors);
      }
      setLoading(false);
    });
  }

  return loading ?
    <LoadingSpinnerComponent/> :
    groupInvites.length > 0 ? (
      <>
        <h1 className="font-bold text-2xl inline-block mr-3 mt-4 text-gray-600">Invites <span className='text-xs text-green-600'><sup>{groupInvites.length}</sup></span></h1>
        <div className="felx flex-row w-full">
          {groupInvites.length > 0 && groupInvites.map(invitee => (
            <div key={invitee.id} className="flex justify-between space-x-3 pt-4">
              <div className="min-w-0 flex-1">
                <p className="text-sm text-gray-400 truncate">{invitee.user.username} {invitee.is_admin && <span className='text-[9px] mt-1 ml-1 text-gray-300'>Admin</span>}</p>
              </div>
              {/* {!invitee.is_admin && currentUser.id == props.group.user_id && */}
              {!invitee.is_admin && currentUser.id == props.group.user_id &&
                <button onClick={(event) => deleteUserGroupRequest(event, invitee)} className='flex-shrink-0 text-red-500 whitespace-nowrap text-sm'><FontAwesomeIcon icon={faTimes} /></button>}
            </div>
          ))}
        </div>
      </>
  ) : <span></span>
}
