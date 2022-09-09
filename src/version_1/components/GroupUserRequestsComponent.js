import React, { useContext, useEffect, useState } from 'react'
import LoadingSpinnerComponent from '../components/LoadingSpinnerComponent';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes, faCheck } from '@fortawesome/free-solid-svg-icons'
import { AppContext } from '../../App';
import { get } from '../helpers/apiCallsHelper';

export default function GroupUserRequestsComponent({...props}) {
  const {currentUser, setCurrentUser, setuserLoggedIn, setAlerts} = useContext(AppContext);
  const [loading, setLoading] = useState(true);
  const [userRequests, setUserRequests] = useState([]);

  useEffect(() => {
    console.log('MEMBERS');
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

  return userRequests.length > 0 ? (
    <div className="flex flex-col w-full mt-8 mb-4">
      <h1 className="font-bold text-2xl inline-block mr-3 text-gray-600">Requests</h1>
      {userRequests.map(userRequest => (
        <div className="flex justify-between space-x-3 pt-4">
          <div className="min-w-0 flex-1">
            <p className="text-sm text-light text-gray-400 truncate">{userRequest.user.username}</p>
          </div>
          <span className="flex flex-row">
            <button className='flex-shrink-0 text-red-500 whitespace-nowrap mr-4 text-sm'><FontAwesomeIcon icon={faTimes} /></button>
            <button className='flex-shrink-0 text-green-500 whitespace-nowrap text-sm'><FontAwesomeIcon icon={faCheck} /></button>
          </span>
        </div>
      ))}
    </div>
  ) : (<span></span>)
}
