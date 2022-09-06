import React, { useEffect, useState } from 'react'
import { useContext } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { AppContext } from '../../App';
import { get } from '../helpers/apiCallsHelper';
import Login from '../pages/Login'
import { saveCookie } from '../helpers/storage';
import LoadingComponent from './LoadingComponent';

export default function ProtectedRoutes() {
  const {currentUser, setCurrentUser, userLoggedIn, setuserLoggedIn} = useContext(AppContext);
  const [loading, doneLoading] = useState(false);
  const navigate = useNavigate();

  return userLoggedIn ? <Outlet/> : <Login/>
}
