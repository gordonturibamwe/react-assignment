import React, { useContext } from 'react'
import { AppContext } from '../../App';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLayerGroup } from '@fortawesome/free-solid-svg-icons'

export default function Nav() {
  const {setCurrentUser} = useContext(AppContext);

  const logout = (event) => {
    setCurrentUser(false);
    event.preventDefault();
  }

  return (
    <header className="bg-green-600">
      <nav className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div className="flex w-full items-center justify-between border-b border-green-500 py-6 lg:border-none">
          <div className="flex items-center">
            <a href="/">
              <span className="sr-only">Logo</span>
              <FontAwesomeIcon icon={faLayerGroup} className="text-4xl text-white" />
              {/* <img className="h-10 w-auto" src="https://tailwindui.com/img/logos/workflow-mark.svg?color=white" alt=""/> */}
            </a>

          </div>
          <div className="ml-10 space-x-4">
            <span className="inline-block border border-transparent py-1 px-1 text-xs font-medium text-white opacity-30 hover:bg-opacity-75">Gordon</span>
            <a href="/" className="inline-block border border-transparent py-1 px-1 text-base font-medium text-white opacity-70 hover:bg-opacity-75">Groups</a>
            <a href="/logout" onClick={logout} className="inline-block border border-transparent py-1 text-base font-medium text-white hover:bg-opacity-75">Logout</a>
          </div>
        </div>
      </nav>
    </header>
  )
}
