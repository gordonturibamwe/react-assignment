import React, { useContext, useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { AppContext } from '../../App';
import LoadingSpinnerComponent from '../components/LoadingSpinnerComponent';
import { get } from '../helpers/apiCallsHelper';

export default function GroupMembersComponent({...props}) {
  const {currentUser, setCurrentUser, setuserLoggedIn, setAlerts, CableApp} = useContext(AppContext);
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

  useEffect(() => { // CONNECTING ACTION CABLE TO GROUPSCHANNEL
    CableApp.cable.subscriptions.create(
      {channel: 'UsersGroupChannel'}, {
        received: (data) => {
          // console.log(props.group.id, data.group_id == props.group.id)
          setCurrentUser(currentUser);
          if(data.group_id == props.group.id) {
            console.log('FROM users group ----', data);
            if(props.group.group_access == 'is_public' && data.action == 'create') {
              members.push(data) //.splice(1, 0, data) //.unshift(data);
              setMembers([...members]);
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
            <p className="text-sm text-gray-400 truncates">{member.user.username} {member.is_admin && <span className='text-[9px] mt-1 ml-1 text-gray-300'>Admin</span>}</p>
          </div>
          {!member.is_admin && currentUser.id == props.group.user_id &&
          <button className='flex-shrink-0 text-red-500 whitespace-nowrap text-sm'><FontAwesomeIcon icon={faTimes} /></button>}
        </div>
      ))}

    </div>
  )
}
