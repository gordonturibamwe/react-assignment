import React, { useContext, useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { AppContext } from '../../App';
import LoadingSpinnerComponent from '../components/LoadingSpinnerComponent';
import { get, destroy } from '../helpers/apiCallsHelper';
import { useNavigate } from 'react-router-dom';

export default function GroupMembersComponent({...props}) {
  // const {currentUser, setCurrentUser, setUserLoggedIn, setAlerts, setNotices, CableApp} = useContext(AppContext);
  const {
    currentUser, setCurrentUser,
    setUserLoggedIn,
    setAlerts, setNotices,
    open, setOpen,
    group, setGroup,
    userGroupRequests, setUserGroupRequests,
    groupMembers, setGroupMembers,
    CableApp
  } = useContext(AppContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState([]);

  useEffect(() => {
    get({
      path: `group/${props.group.id}/members`,
      headers: {headers: {'Authorization': `Bearer ${localStorage.getItem("token")}`}},
    }).then(response => {
      if(response.status == 200) {
        setGroupMembers([...response.data.members]);
        setUserLoggedIn(true);
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
        console.log('--11', currentUser.id, userGroupRequest)
        if(currentUser.id == userGroupRequest.user.id)
          navigate('/', {replace: true});
      } else {
        setAlerts(arr => response.data.error ? [response.data.error] : response.data?.errors);
      }
      setLoading(false);
    });
  }

  return loading ? <LoadingSpinnerComponent/> : (
    <>
      <h1 className="font-bold text-2xl inline-block mr-3 text-gray-600">Members <span className='text-xs text-green-600'><sup>{groupMembers.length}</sup></span></h1>
      <div className="felx flex-row w-full">
        {groupMembers.length > 0 && groupMembers.map(member => (
          <div key={member.id} className="flex justify-between space-x-3 pt-4">
            <div className="min-w-0 flex-1">
              <p className="text-sm text-gray-400 truncate">{member.user.username} {member.is_admin && <span className='text-[9px] mt-1 ml-1 text-gray-300'>Admin</span>}</p>
            </div>
            {!member.is_admin && currentUser.id == props.group.user_id &&
              <button onClick={(event) => deleteUserGroupRequest(event, member)} className='flex-shrink-0 text-red-500 whitespace-nowrap text-sm'><FontAwesomeIcon icon={faTimes} /></button>}
            {currentUser.id == member.user.id && !member.is_admin &&
              <button onClick={(event) => deleteUserGroupRequest(event, member)} className='flex-shrink-0 text-red-500 whitespace-nowrap text-sm'><FontAwesomeIcon icon={faTimes} /></button>}
          </div>
        ))}
      </div>
    </>
  )
}
