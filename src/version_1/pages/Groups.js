import React, { createContext, createRef, useContext, useLayoutEffect, useState } from 'react'
import { useRef } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { AppContext } from '../../App';
import GroupFormModal from '../components/GroupFormModal';
import Nav from '../components/Nav';
import { get } from '../helpers/apiCallsHelper';

export default function Groups() {
  const {setCurrentUser, setuserLoggedIn, setAlerts} = useContext(AppContext);
  const navigate = useNavigate();
  const filterButtonRefs = useRef([]);
  const location = useLocation();
  filterButtonRefs.current = [0,1,2].map((_, index) => filterButtonRefs.current[index] ?? createRef());
  const [open, setOpen] = useState(false); // for group modal form

  useLayoutEffect(() => {
    console.log('---', localStorage.getItem('token'));
    get({
      url: "http://localhost:3000/api/v1/current-user",
      headers: {headers: {'Authorization': `Bearer ${localStorage.getItem("token")}`}},
    }).then(response => {
      console.log(response, response.status);
      if(response.status == 200) {
        setCurrentUser(response.data);
        setuserLoggedIn(true);
      } else {
        setAlerts(arr => response.data.errors);
        localStorage.removeItem("token")
        navigate('/login', {replace: true});
      }
    });
  }, []);


  const filterByNavigation = (event, path) => {
    navigate(path, {replace: true});
    console.log('search', location.search, path);
    filterButtonRefs.current.map(button =>{
      button.current.classList.remove('border-gray-300', 'bg-gray-200', 'hover:bg-gray-100', 'hover:text-gray', 'text-gray-500')
    });
    event.target.classList.add('border-gray-300', 'bg-gray-200', 'hover:bg-gray-100', 'hover:text-gray', 'text-gray-500');
    event.preventDefault();
  }

  return (
    <AppContext.Provider value={{open, setOpen}}>
      <Nav/>
      <GroupFormModal/>
      <div className="max-w-4xl mx-auto  px-4 sm:px-6 lg:px-8 flex">
        <div className="w-full mx-auto pt-6">
          <h1 className="font-bold text-4xl">Groups </h1>
          <div className="w-full flex justify-between items-center pt-6" data-controller="buttons">
            <span className="relative z-0 inline-flex shadow-sm rounded-sm" data-buttons-target="parent">
              <button onClick={(event) => filterByNavigation(event, '/')} ref={filterButtonRefs.current[0]} className="-ml-px border-gray-300 bg-gray-200 hover:bg-gray-100 hover:text-gray text-gray-500 relative inline-flex items-center px-4 py-2 border text-xs font-medium focus:z-10 focus:outline-none focus:ring-0  rounded-l-[4px]">All groups </button>
              <button onClick={(event) => filterByNavigation(event, '/?q=by-me')} ref={filterButtonRefs.current[1]} className="-ml-px relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-xs font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-0 ">Created by me</button>
              <button onClick={(event) => filterByNavigation(event, '/?q=where-am-member')} ref={filterButtonRefs.current[2]} className="-ml-px relative inline-flex items-center px-4 py-2 rounded-r-[4px] border border-gray-300 bg-white text-xs font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-0 ">Where I am member</button>
            </span>

            <button onClick={() => setOpen(true)} className="rounded-[4px]  px-4 py-2 bg-green-600 hover:bg-green-700 border-green-800 text-white block text-sm font-medium shadow-sm">+ New Group </button>
          </div>

          <div className="bg-white shadow-xs overflow-hidden border rounded-md mt-6 border-gray-302">
            <ul role="list" className='w-full divide-y divide-gray-200'>
              <li id="dfdf" className="flex hover:bg-gray-50 flex-row items-center justify-between flex-basis pr-6">
                <a href="/group/sfsfsfds" className="block hover:bg-gray-50 w-full">
                  <div className="px-4 py-6 sm:px-6">
                    <div className="flex items-center justify-between">
                      <h1 className="font-semibold text-2xl inline-block mb-2 text-gray-600">
                        My private Group is here
                        <span className="px-2 ml-2 inline-flex text-xs rounded-full bg-green-100 text-green-800 mt-1">Created by You</span>
                      </h1>
                    </div>
                    <div className="mt-1 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-xs text-gray-500 mr-2">2 Members</p>
                        <p className="flex items-center text-xs text-gray-500 mr-2">4 Posts</p>
                        <p className="flex items-center text-xs text-gray-500">Last activity 4 days ago</p>
                      </div>
                    </div>
                  </div>
                </a>
                <button className="rounded-[4px] shadow-sm border border-gray-300 hover:text-gray-600 bg-white px-4 py-2 text-gray-600 block text-sm font-medium flex-none">Request to Join</button>
              </li>
              <li id="dfdf" className="flex hover:bg-gray-50 flex-row items-center justify-between flex-basis pr-6">
                <a href="/group/sfsfsfds" className="block hover:bg-gray-50 w-full">
                  <div className="px-4 py-6 sm:px-6">
                    <div className="flex items-center justify-between">
                      <h1 className="font-semibold text-2xl inline-block mb-2 text-gray-600">
                        Juliana funs group
                      </h1>
                    </div>
                    <div className="mt-1 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-xs text-gray-500 mr-2">26 Members</p>
                        <p className="flex items-center text-xs text-gray-500 mr-2">51 Posts</p>
                        <p className="flex items-center text-xs text-gray-500">Last activity 4 days ago</p>
                      </div>
                    </div>
                  </div>
                </a>
                <button className="rounded-[4px] shadow-sm border border-gray-300 hover:text-gray-600 bg-white px-4 py-2 text-gray-600 block text-sm font-medium flex-none">Join Group</button>
              </li>
              <li id="dfdf" className="flex hover:bg-gray-50 flex-row items-center justify-between flex-basis pr-6">
                <a href="/group/sfsfsfds" className="block hover:bg-gray-50 w-full">
                  <div className="px-4 py-6 sm:px-6">
                    <div className="flex items-center justify-between">
                      <h1 className="font-semibold text-2xl inline-block mb-2 text-gray-600">
                        My secret Group is here
                        <span className="px-2 ml-2 inline-flex text-xs rounded-full bg-orange-100 text-orange-800 -mt-1">Secret Group</span>
                      </h1>
                    </div>
                    <div className="mt-1 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-xs text-gray-500 mr-2">2 Members</p>
                        <p className="flex items-center text-xs text-gray-500 mr-2">4 Posts</p>
                        <p className="flex items-center text-xs text-gray-500">Last activity 4 days ago</p>
                      </div>
                    </div>
                  </div>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </AppContext.Provider>
  )
}
