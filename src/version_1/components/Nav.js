import React, { useContext, useEffect } from 'react'
import { AppContext } from '../../App';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLayerGroup } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom';

export default function Nav() {
  const {currentUser, setCurrentUser, userLoggedIn, setuserLoggedIn} = useContext(AppContext);

  const logout = (event) => {
    localStorage.removeItem('token');
    setuserLoggedIn(false);
  }

  return (
    <header className="bg-green-600">
      <nav className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div className="flex w-full items-center justify-between border-b border-green-500 py-4 lg:border-none">
          <div className="flex items-center">
            <Link to='/' className="inline-block border border-transparent text-base font-medium text-white hover:bg-opacity-75"><FontAwesomeIcon icon={faLayerGroup} className="text-3xl text-white" /></Link>
          </div>
          <div className="ml-10 space-x-4">
            <span className="inline-block border border-transparent py-1 px-1 text-xs font-medium text-white opacity-30 hover:bg-opacity-75">user: {currentUser?.username}</span>
            <Link to='/' className="inline-block border border-transparent py-1 px-1 text-base font-medium text-white opacity-70 hover:bg-opacity-75">Groups</Link>
            <Link to='/logout' onClick={logout} className="inline-block border border-transparent py-1 text-base font-medium text-white hover:bg-opacity-75">Logout</Link>
          </div>
        </div>
      </nav>
    </header>
  )
}
