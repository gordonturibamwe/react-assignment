import React, { useContext, useRef, useState,  } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSadCry } from '@fortawesome/free-solid-svg-icons'
import { AppContext } from '../../App';

// NotFound.js page displays when the url is not found in the routes
// It is setup in the App.js
export default function NotFound() {
  return (
    <div  className="h-screen bg-gray-50">
      <div className="flex min-h-full max-w-[400px] items-center justify-center py-12 px-4 sm:px-6 lg:px-8 mx-auto">
        <div className="w-full max-w-md space-y-8 pb-10 mb-10">
          <div className='text-center'>
            <FontAwesomeIcon icon={faSadCry} className="text-4xl text-green-600" />
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
              Page Not Found
            </h2>
          </div>

        </div>
      </div>
    </div>
  );
}
