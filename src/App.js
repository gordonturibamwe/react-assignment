import React, { useState, createContext, useLayoutEffect } from "react";
import { BrowserRouter, Routes, Route} from 'react-router-dom';
import Nav from "./version_1/components/Nav";
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

// App.js page hold all the Routes for the entire application.
// Before App.js loads useLayoutEffect checks to see if user is logged in using the localStorage 'token'
// If 'token' is valid then user redirected to <Groups> page
// If 'token' is invalid then user is redirected to <Login> page
export const AppContext = createContext({});
function App() {
  const [currentUser, setCurrentUser] = useState({}); // Holds user data information when user is logged in
  const [userLoggedIn, setuserLoggedIn] = useState(false); // Holds a boolean is user is logged in or not
  const [open, setOpen] = useState(false); // For opening and closing group modal form <GroupFormModal/>
  const [alerts, setAlerts] = useState([]); // For displaying alerts <AlertComponent/>
  const [notices, setNotices] = useState([]); // For displaying notices <NoticeComponent/>

  useLayoutEffect(() => {
    get({
      url: "http://localhost:3000/api/v1/current-user",
      headers: {headers: {'Authorization': `Bearer ${localStorage.getItem("token")}`}},
    }).then(response => {
      if(response.status == 200) {
        setCurrentUser(response.data);
        setuserLoggedIn(true);
      }
    });
  }, []);

  return( // AppContext.Provider context holds all the applications temp states
    <AppContext.Provider value={{currentUser, setCurrentUser, open, setOpen, alerts, setAlerts, notices, setNotices, userLoggedIn, setuserLoggedIn}}>
      {alerts.length > 0 && <AlertComponent/> /* Show Alerts */}
      {notices.length > 0 && <NoticeComponent/> /* Show Notices */}

      <BrowserRouter>
        <Routes>
          {!userLoggedIn && <Route path="/login" exact element={<Login/>}/>}
          {!userLoggedIn && <Route path="/register" exact element={<Register/>}/>}
          <Route path="/" element={<ProtectedRoutes />}>
            <Route path="/" element={<Groups />}/>
            <Route path="/group/:id" exact element={<Group />}/>
            <Route path="/post/:id" exact element={<Post />}/>
            <Route path="/logout" exact element={<Login />}/>
          </Route>
          <Route path="/*" element={<NotFound/>}/>
        </Routes>
      </BrowserRouter>
    </AppContext.Provider>
  )
}

export default App;
