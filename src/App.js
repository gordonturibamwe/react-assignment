import React, { useState, createContext, useLayoutEffect, useEffect } from "react";
import { Routes, Route, Link} from 'react-router-dom';
import Login from "./version_1/pages/Login";
import Register from "./version_1/pages/Register";
import Groups from "./version_1/pages/Groups";
import ProtectedRoutes from "./version_1/components/ProtectedRoutes";
import Group from "./version_1/pages/Group";
import Post from "./version_1/pages/Post";
import AlertComponent from "./version_1/components/AlertComponent";
import NoticeComponent from "./version_1/components/NoticeComponent";
import { get } from "./version_1/helpers/apiCallsHelper";
import NotFound from "./version_1/pages/NotFound";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBell } from '@fortawesome/free-solid-svg-icons'
import LoadingComponent from "./version_1/components/LoadingComponent";
import actionCable from 'actioncable'

// App.js page hold all the Routes for the entire application.
// Before App.js loads useLayoutEffect checks to see if user is logged in using the localStorage 'token'
// If 'token' is valid then user redirected to <Groups> page
// If 'token' is invalid then user is redirected to <Login> page
const CableApp = {}
CableApp.cable = actionCable.createConsumer('ws://localhost:3000/cable');

export const AppContext = createContext({});
function App() {
  const [currentUser, setCurrentUser] = useState({}); // Holds user data information when user is logged in
  const [group, setGroup] = useState({}); // Holds user data information when user is logged in
  const [userLoggedIn, setuserLoggedIn] = useState(false); // Holds a boolean is user is logged in or not
  const [open, setOpen] = useState(false); // For opening and closing group modal form <GroupFormModal/>
  const [alerts, setAlerts] = useState([]); // For displaying alerts <AlertComponent/>
  const [notices, setNotices] = useState([]); // For displaying notices <NoticeComponent/>
  const [loading, setLoading] = useState(true); // For displaying notices <NoticeComponent/>
  const [userGroupRequests, setUserGroupRequests] = useState([]); // For holding userGroupRequests
  const [groupMembers, setGroupMembers] = useState([]); // For holding groupMembers
  const [searchUsers, setUserchUsers] = useState([]); // For holding groupMembers
  const [groupInvites, setGroupInvites] = useState([]); // For holding groupMembers
  const [notifications, setNotifications] = useState([]); // For holding groupMembers

  useLayoutEffect(() => {
    get({
      path: "current-user",
      headers: {headers: {'Authorization': `Bearer ${localStorage.getItem("token")}`}},
    }).then(response => {
      if(response.status == 200) {
        setCurrentUser(response.data);
        setuserLoggedIn(true);
      }
      if(response.status == 0) setAlerts(['Bad connection.']);
      setLoading(false);
    });
  }, []);

  useEffect(() => { // CONNECTING ACTION CABLE TO GROUPSCHANNEL
    CableApp.cable.subscriptions.create(
      {channel: 'NotificationsChannel'}, {
        received: (data) => {
          console.log('++++', data);
          console.log('---~~>', currentUser);
          // setCurrentUser(currentUser);
          // if(currentUser.id == data.recipient.id) {
            // notifications.unshift(data)
            setNotifications([...notifications]);
            console.log('ISIDE', notifications);
          // }
        },
        connected: () => {console.log('NOTIFICATIONS CONNECTED');},
        disconnected: (e) => console.log('NOTIFICATIONS DISCONNECTED', e),
      },
    );
    return () => CableApp.cable.disconnect()
  }, [CableApp.subscriptions, setNotifications]);


  return loading ? <LoadingComponent/> : (
    <AppContext.Provider value={{ // AppContext.Provider context holds all the applications temp states
        CableApp, // Holding Websocket connections
        currentUser, setCurrentUser, // holds currentUser details ~> {id:, username:, etc}
        open, setOpen, // Holds the state of GroupForm. true if open, false when hidden
        alerts, setAlerts,
        notices, setNotices,
        userLoggedIn, setuserLoggedIn,
        group, setGroup,
        userGroupRequests, setUserGroupRequests,
        groupMembers, setGroupMembers,
        searchUsers, setUserchUsers,
        groupInvites, setGroupInvites,
        notifications, setNotifications
      }}>
      {alerts?.length > 0 && <AlertComponent/> /* Show Alerts */}
      {notices?.length > 0 && <NoticeComponent/> /* Show Notices */}

      {/* {notifications.length > 0 && */}
      <div className="alert-toast fixed z-[100] top-[80px] right-[13px] max-w-[250px] w-full">
        {notifications.map((notification) => (
          currentUser.id == notification.recipient.id &&
          <span key={notification.recipient.id} className="close cursor-pointer mb-3 flex flex-row items-start justify-start w-full p-6 bg-orange-500 rounded shadow-md text-white" title="close" htmlFor="footertoast">
            <FontAwesomeIcon icon={faBell} className="mr-4 mt-[5px] text-lg" />
            <p className="opacity-80 text-sm">{notification.message} {currentUser.username}</p>
            <svg className="fill-current text-white absolute right-4 top-4 h-5" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
              <path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"></path>
            </svg>
          </span>
        ))}
      </div>

      {/* message: message,
      recipient: recipient,
      sender: sender,
      path: path */}

      <Routes>
        {!userLoggedIn && <Route path="/login" exact element={<Login/>}/>}
        {!userLoggedIn && <Route path="/register" exact element={<Register/>}/>}
        <Route path="/" element={<ProtectedRoutes />}>
          <Route path="/" element={<Groups />}/>
          <Route path="/group/:id" exact element={<Group />}/>
          <Route path="/post/:id" exact element={<Post />}/>
          <Route path="/logout" exact element={<Login />}/>
        </Route>
        <Route path="/*" element={<NotFound/>  /* To redirect to NoFound if url is not found */}/>
      </Routes>
    </AppContext.Provider>
  )
}

export default App;
