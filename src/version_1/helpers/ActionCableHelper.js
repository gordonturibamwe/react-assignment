import { useContext, useEffect, useState, useLayoutEffect } from "react";
import { AppContext } from "../../App";
import { get } from "./apiCallsHelper";

export const useNotificationsCable = () => {
  const {CableApp, setCurrentUser, currentUser, setNotifications, notifications} = useContext(AppContext);

  useEffect(() => {
    CableApp.cable.subscriptions.create( // connecting to NotificationsChannel
      {channel: 'NotificationsChannel'}, {
        received: (data) => {
          if(currentUser.id == data.recipient.id)
            setNotifications([...notifications, data]);
        },
      },
    );
    return () => CableApp.cable.disconnect();
  }, [CableApp.subscriptions, setNotifications, notifications]);
  return [notifications, setNotifications]
}

export const useGroupsCable = () => {
  const {CableApp, setCurrentUser, currentUser, setUserLoggedIn, setAlerts, groups, setGroups} = useContext(AppContext);
  const [filter, setFilter] = useState('');

  useLayoutEffect(() => {
    get({ // get all groups
      path: `all-groups${filter}`, // filter variable ~> to filter by query '/?q=by-me', '/?q=where-am-member'
      headers: {headers: {'Authorization': `Bearer ${localStorage.getItem("token")}`}},
    }).then(response => {
      if(response.status == 200) {
        setGroups([...response.data['groups']]);
        setUserLoggedIn(true);
      } else
        setAlerts(response.data.errors);
    });
  }, [filter]); // listen to filter changes

  useEffect(() => {
    CableApp.cable.subscriptions.create( // GroupsChannel actionCable websockets
      {channel: 'GroupsChannel'}, {
        received: (data) => {
          setCurrentUser(currentUser);
          if(data['action'] == 'create') {
            setGroups([data, ...groups]);
          } else if(data['action'] == 'update') {
            const _groupIndex = groups.indexOf(groups.find((gp) => gp.id == data.id));
            groups[_groupIndex] = data;
            setGroups([...groups]);
          }
        },
      },
    );
    return () => CableApp.cable.disconnect();
  }, [CableApp.subscriptions, groups, setGroups, filter]);
  return [filter, setFilter]
}
