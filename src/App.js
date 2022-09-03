import React, { useState, useEffect, createContext } from "react";
import axios from 'axios';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Nav from "./version_1/components/Nav";
import Login from "./version_1/pages/Login";
import Register from "./version_1/pages/Register";
import Groups from "./version_1/pages/Groups";
import ProtectedRoutes from "./version_1/components/ProtectedRoutes";
import Group from "./version_1/pages/Group";
import Post from "./version_1/pages/Post";

export const AppContext = createContext({});
function App() {
  const [currentUser, setCurrentUser] = useState(true); // Used for authorization when the user is logged in
  const [open, setOpen] = useState(false); // For opening and closing group modal form <GroupFormModal/>

  return(
    <AppContext.Provider value={{currentUser, setCurrentUser, open, setOpen}}>
      {currentUser && <Nav/> /* Show Nav when user is logged in */}
      <BrowserRouter>
        <Routes>
          {!currentUser && <Route path="/" element={<Login/>}/>}
          {!currentUser && <Route path="/register" element={<Register/>}/>}
          <Route element={<ProtectedRoutes/> /* Routes beneath can only be accessed when ProtectedRoutes returns true */}>
            <Route path="/" element={<Groups />}/>
            <Route path="/group/:id" element={<Group />}/>
            <Route path="/post/:id" element={<Post />}/>
          </Route>
        </Routes>
      </BrowserRouter>
    </AppContext.Provider>
  )
}

export default App;


{/* <BrowserRouter>
      <Routes>
      </Routes>
    </BrowserRouter>
     */}
        {/* <Route path="/" element={<LayoutComponent/>} />
        <Route path="/group/:id" element={<UseStateComponent/>} />
        <Route path="/post/:id" element={<UseStateComponent/>} /> */}
        {/* <Route element={<ProtectedRoutes/>}>
          <Route path="/user" element={<User />} />
          <Route path="/account" element={<Account />} />
        </Route> */}



//,
// {headers: {'Authorization': 'Bearer 39b290146bea6ce975c37cfc23'}})
// fetch("http://localhost:3000/account-login", {
//   credentials: 'same-origin',
//   method: 'POST',
//   headers: {
//     'Accept': 'application/json',
//     'Content-Type': 'application/json'
//   },
//   body: JSON.stringify({password: "mypassword", username: "$a3e7f559a95cfd"}),
// })

// const [user, setUser] = useState({});

  // useEffect(() => {
  //   axios.post("http://localhost:3000/api/v1/account-login",
  //     {password: "111111", accountname: "$a3e7f559a95cfd"}
  //   ).then((response) => {
  //     const holdData = response;
  //     setUser(holdData);
  //     console.log(user, holdData);
  //   });
  // }, []);

  // return (
  //   <div className="App h-screen flex items-center bg-gray-50 flex-col justify-center">
  //     <h1 className='font-mono font-medium'>Assignment</h1>
  //     <h1 className='font-mono font-medium'>...</h1>
  //   </div>
  // );
