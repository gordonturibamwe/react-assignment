import React from 'react'
import { useContext } from 'react';
import { Outlet } from 'react-router-dom';
import { AppContext } from '../../App';
import Login from '../pages/Login'

export default function ProtectedRoutes() {
  const {userLoggedIn} = useContext(AppContext); //
  return userLoggedIn ? <Outlet/> : <Login/> // return children if userLoggedIn or login page form
}
