import React, { useContext, useEffect, useState } from 'react'
import LoadingSpinnerComponent from '../components/LoadingSpinnerComponent';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes, faCheck } from '@fortawesome/free-solid-svg-icons'
import { AppContext } from '../../App';
import { get, patch, destroy } from '../helpers/apiCallsHelper';

export default function GroupUserRequestsComponent({...props}) {
  const {currentUser, setCurrentUser, setuserLoggedIn, setAlerts, setNotices, CableApp} = useContext(AppContext);
  const [loading, setLoading] = useState(true);
  const [userRequests, setUserRequests] = useState([]);

  useEffect(() => {
    get({
      path: `group/${props.group.id}/user-requests`,
      headers: {headers: {'Authorization': `Bearer ${localStorage.getItem("token")}`}},
    }).then(response => {
      console.log(response.data.group_requests);
      if(response.status == 200) {
        setUserRequests([...response.data.group_requests]);
        setuserLoggedIn(true);
      } else {
        setAlerts(arr => response.data.error ? [response.data.error] : response.data?.errors);
      }
      setLoading(false);
    });
  }, []);

  const acceptPrivateRequest = (event, requestId) => {
    event.preventDefault();
    patch({
      path: `accept-private-group-request/${requestId}`,
      headers: {headers: {'Authorization': `Bearer ${localStorage.getItem("token")}`}},
    }).then(response => {
      console.log(response.data.group_requests);
      if(response.status == 200) {
        const requests = userRequests.find((request) => request.id != requestId);
        console.log('++++', requests);
        setUserRequests([...requests || []]);
      } else {
        setAlerts(arr => response.data.error ? [response.data.error] : response.data?.errors);
      }
      setLoading(false);
    });
  }

  const deleteUserGroupRequest = (event, requestId) => {
    event.preventDefault();
    destroy({
      path: `destroy-group-request/${requestId}`,
      headers: {headers: {'Authorization': `Bearer ${localStorage.getItem("token")}`}},
    }).then(response => {
      console.log(response.data.group_requests);
      if(response.status == 200) {
        const requests = userRequests.find((request) => request.id != requestId);
        setUserRequests(requests == undefined ? [] : [...requests]);
        setNotices(['User deleted from group.'])
      } else {
        setAlerts(arr => response.data.error ? [response.data.error] : response.data?.errors);
      }
      setLoading(false);
    });
  }


  useEffect(() => { // CONNECTING ACTION CABLE TO GROUPSCHANNEL
    CableApp.cable.subscriptions.create(
      {channel: 'UsersGroupChannel'}, {
        received: (data) => {
          console.log('2 ----', data);
          setCurrentUser(currentUser);
          if(data.group_id == props.group.id) {
            if(!data.request_accepted && props.group.group_access == 'is_private') {
              userRequests.push(data) //.splice(1, 0, data) //.unshift(data);
              setUserRequests([...userRequests]);
            }
          }
        },
        connected: () => {console.log('USER GROUP CONNECTED');},
        disconnected: (e) => console.log('USER GROUP DISCONNECTED', e),
      },
    );
    return () => CableApp.cable.disconnect()
  }, [CableApp.subscriptions, userRequests, setUserRequests]);


  return userRequests.length > 0 && currentUser.id == props.group.user_id ? (
    <div className="flex flex-col w-full mt-8 mb-4">
      <h1 className="font-bold text-2xl inline-block mr-3 text-gray-600">Requests</h1>
      {userRequests.length > 0 && userRequests.map(userRequest => (
        <div key={userRequest.id} className="flex justify-between space-x-3 pt-4">
          <div className="min-w-0 flex-1">
            <p className="text-sm text-light text-gray-400 truncates">{userRequest.user.username}</p>
          </div>
          <span className="flex flex-row">
            <button onClick={(event) => deleteUserGroupRequest(event, userRequest.id)} className='flex-shrink-0 text-red-500 whitespace-nowrap mr-4 text-sm'><FontAwesomeIcon icon={faTimes} /></button>
            <button onClick={(event) => acceptPrivateRequest(event, userRequest.id)} className='flex-shrink-0 text-green-500 whitespace-nowrap text-sm'><FontAwesomeIcon icon={faCheck} /></button>
          </span>
        </div>
      ))}
    </div>
  ) : (<span></span>)
}
