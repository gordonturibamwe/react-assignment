import NotificationsComponent from './version_1/components/NotificationsComponent';
import {
  React, useState, createContext, useLayoutEffect, useEffect,
  Routes, Route, Login, Register, Groups, ProtectedRoutes, Group, Post, AlertComponent,
  NoticeComponent, get, NotFound, FontAwesomeIcon, faBell, LoadingComponent, actionCable,
} from './version_1/helpers/AppImportHelpers';

// App.js page holds all the Routes for the entire application.
// Before App.js loads useLayoutEffect checks to see if user is logged in using the localStorage 'token'
// If 'token' is valid then user redirected to <Groups> page
// If 'token' is invalid then user is redirected to <Login> page
const CableApp = {}
CableApp.cable = actionCable.createConsumer('ws://localhost:3000/cable');

export const AppContext = createContext({}); // application context to hold data across the app
function App() {
  const [currentUser, setCurrentUser] = useState({}); // holds current user data details when user is logged in
  const [group, setGroup] = useState({}); // holds group details
  const [groups, setGroups] = useState([]); // holds group details
  const [userLoggedIn, setUserLoggedIn] = useState(false); // Holds a boolean true if userLoggedIn, false if not
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
        setUserLoggedIn(true);
      }
      if(response.status == 0) setAlerts(['Bad connection.']);
      setLoading(false);
    });
  }, []);

  return loading ? <LoadingComponent/> : (
    <AppContext.Provider value={{ // AppContext.Provider context holds all the applications temp states
        CableApp, // ActionCable Websocket connections
        currentUser, setCurrentUser, // holds currentUser details ~> {id:, username:, etc}
        open, setOpen, // holds the state of GroupForm. true if open, false when hidden
        alerts, setAlerts, // holds Array of <strings> alerts ~> ['Alert example'] to display alerts in red
        notices, setNotices, // holds Array of <strings> notices ~> ['Notice example'] to display notices in green
        userLoggedIn, setUserLoggedIn,
        group, setGroup,
        groups, setGroups,
        userGroupRequests, setUserGroupRequests,
        groupMembers, setGroupMembers,
        searchUsers, setUserchUsers,
        groupInvites, setGroupInvites,
        notifications, setNotifications
      }}>
      {alerts?.length > 0 && <AlertComponent/> /* displa alerts */}
      {notices?.length > 0 && <NoticeComponent/> /* displa notices */}
      {<NotificationsComponent/> /* displa notices */}

      {/* {notifications.length > 0 && */}

      <Routes>
        {!userLoggedIn && <Route path="/login" exact element={<Login/>}/>}
        {!userLoggedIn && <Route path="/register" exact element={<Register/>}/>}
        <Route path="/" element={<ProtectedRoutes /> /* Accessible if userLoggedIn */}>
          <Route path="/" element={<Groups /> /* Groups page */}/>
          <Route path="/group/:id" exact element={<Group /> /* Group page */}/>
          <Route path="/post/:id" exact element={<Post /> /* Post page */}/>
          <Route path="/logout" exact element={<Login /> /* Login page form after log out*/}/>
        </Route>
        <Route path="/*" element={<NotFound/> /* to redirect to NotFound if url is not found */}/>
      </Routes>
    </AppContext.Provider>
  )
}

export default App;


{/* message: message,
recipient: recipient,
sender: sender,
path: path */}
