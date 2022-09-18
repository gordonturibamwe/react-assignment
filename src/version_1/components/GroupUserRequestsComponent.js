import React, { useContext, useEffect, useState } from 'react'
import LoadingSpinnerComponent from '../components/LoadingSpinnerComponent';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes, faCheck } from '@fortawesome/free-solid-svg-icons'
import { AppContext } from '../../App';
import { get, patch, destroy } from '../helpers/apiCallsHelper';

export default function GroupUserRequestsComponent({...props}) {
  const {currentUser, setCurrentUser, setUserLoggedIn, setAlerts, setNotices, userGroupRequests, setUserGroupRequests} = useContext(AppContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    get({
      path: `group/${props.group.id}/user-requests`,
      headers: {headers: {'Authorization': `Bearer ${localStorage.getItem("token")}`}},
    }).then(response => {
      console.log(response.data.group_requests);
      if(response.status == 200) {
        setUserGroupRequests([...response.data.group_requests]);
        setUserLoggedIn(true);
      } else {
        setAlerts(arr => response.data.error ? [response.data.error] : response.data?.errors);
      }
      setLoading(false);
    });
  }, []);

  const acceptPrivateRequest = (event, userGroupRequest) => {
    event.preventDefault();
    patch({
      path: `accept-private-group-request/${userGroupRequest.id}`,
      headers: {headers: {'Authorization': `Bearer ${localStorage.getItem("token")}`}},
    }).then(response => {
      if(response.status == 200) {
        setNotices(['User group request accepted..']);
      } else {
        setAlerts(arr => response.data.error ? [response.data.error] : response.data?.errors);
      }
      setLoading(false);
    });
  }

  const deleteUserGroupRequest = (event, userGroupRequest) => {
    event.preventDefault();
    destroy({
      path: `destroy-group-request/${userGroupRequest.id}`,
      headers: {headers: {'Authorization': `Bearer ${localStorage.getItem("token")}`}},
    }).then(response => {
      if(response.status == 200) {
        setNotices(['User deleted from group.'])
      } else {
        setAlerts(arr => response.data.error ? [response.data.error] : response.data?.errors);
      }
      setLoading(false);
    });
  }

  return userGroupRequests.length > 0 && currentUser.id == props.group.user_id ? (
    <div className="flex flex-col w-full mt-8 mb-4">
      <h1 className="font-bold text-2xl inline-block mr-3 text-gray-600">Requests</h1>
      {userGroupRequests.length > 0 && userGroupRequests.map(userRequest => (
        <div key={userRequest.id} className="flex justify-between space-x-3 pt-4">
          <div className="min-w-0 flex-1">
            <p className="text-sm text-light text-gray-400 truncates">{userRequest.user.username}</p>
          </div>
          <span className="flex flex-row">
            <button onClick={(event) => deleteUserGroupRequest(event, userRequest)} className='flex-shrink-0 text-red-500 whitespace-nowrap mr-4 text-sm'><FontAwesomeIcon icon={faTimes} /></button>
            <button onClick={(event) => acceptPrivateRequest(event, userRequest)} className='flex-shrink-0 text-green-500 whitespace-nowrap text-sm'><FontAwesomeIcon icon={faCheck} /></button>
          </span>
        </div>
      ))}
    </div>
  ) : (<span></span>)
}
