import React, { useContext, useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { AppContext } from '../../App';
import LoadingSpinnerComponent from '../components/LoadingSpinnerComponent';
import { get, destroy } from '../helpers/apiCallsHelper';

export default function GroupMembersComponent({...props}) {
  const {currentUser, setCurrentUser, setuserLoggedIn, setAlerts, setNotices, CableApp} = useContext(AppContext);
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState([]);

  useEffect(() => {
    console.log('MEMBERS', props.group.user_id);
    get({
      path: `group/${props.group.id}/members`,
      headers: {headers: {'Authorization': `Bearer ${localStorage.getItem("token")}`}},
    }).then(response => {
      console.log(response.data.members);
      if(response.status == 200) {
        setMembers([...response.data.members]);
        setuserLoggedIn(true);
      } else {
        setAlerts(arr => response.data.error ? [response.data.error] : response.data?.errors);
      }
      setLoading(false);
    });
  }, []);

  const deleteUserGroupRequest = (event, requestId) => {
    event.preventDefault();
    destroy({
      path: `destroy-group-request/${requestId}`,
      headers: {headers: {'Authorization': `Bearer ${localStorage.getItem("token")}`}},
    }).then(response => {
      console.log(response.data.group_requests);
      if(response.status == 200) {
        const requests = members.find((request) => request.id != requestId);
        console.log('++++', requests);
        setMembers([...requests || []]);
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
          // console.log(props.group.id, data.group_id == props.group.id)
          console.log('1 ----', data);
          setCurrentUser(currentUser);
          if(data.group_id == props.group.id) {
            if(data.request_accepted) {
              members.push(data) //.splice(1, 0, data) //.unshift(data);
              setMembers([...members]);
            } else if(data.action == 'destroy') {
              const requests = members.find((member) => member.id != data.id);
              console.log('++++', requests);
              setMembers([...requests || []]);
            }
          }
        },
        connected: () => {console.log('USER GROUP CONNECTED');},
        disconnected: (e) => console.log('USER GROUP DISCONNECTED', e),
      },
    );
    return () => CableApp.cable.disconnect()
  }, [CableApp.subscriptions, members, setMembers]);


  return loading ? <LoadingSpinnerComponent/> : (
    <div className="felx flex-row w-full">
      {members.map(member => (
        <div key={member.id} className="flex justify-between space-x-3 pt-4">
          <div className="min-w-0 flex-1">
            <p className="text-sm text-gray-400 truncate">{member.user.username} {member.is_admin && <span className='text-[9px] mt-1 ml-1 text-gray-300'>Admin</span>}</p>
          </div>
          {!member.is_admin && currentUser.id == props.group.user_id &&
          <button onClick={(event) => deleteUserGroupRequest(event, member.id)} className='flex-shrink-0 text-red-500 whitespace-nowrap text-sm'><FontAwesomeIcon icon={faTimes} /></button>}
        </div>
      ))}

    </div>
  )
}
