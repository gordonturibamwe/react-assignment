import React, { useState } from 'react'
import { useContext } from 'react';
import { Outlet } from 'react-router-dom';
import { AppContext } from '../../App';
import Login from '../pages/Login'

export default function ProtectedRoutes() {
  const {currentUser} = useContext(AppContext);
  const [loading, doneLoading] = useState(false);

  return loading ? (
    <div id="login" className="loadin text-center w-100 justify-center">
      <div className="spinner-border text-gray-500" role="status"> <span className="sr-only"></span> </div>
    </div>
  ) : currentUser ? <Outlet/> : <Login/>
}
