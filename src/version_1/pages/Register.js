import React, { useContext, useRef, useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLayerGroup } from '@fortawesome/free-solid-svg-icons'
import { AppContext } from '../../App';
import { post } from '../helpers/apiCallsHelper';
import { Link, useNavigate } from 'react-router-dom';

// Register.js page registers new user.
// If user registration is successful, user is redirected to the groups page
// else user alert inforamtion  is displayed
export default function Register() {
  const usernameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const repeatPasswordRef = useRef(null);
  const {setAlerts, setNotices, setuserLoggedIn, setCurrentUser} = useContext(AppContext);
  const navigate = useNavigate();

  const registerAccount = (event) => {
    event.preventDefault();
    if(passwordRef.current.value !== repeatPasswordRef.current.value) {
      setAlerts(arr => ['Password does not match']);
      return;
    }
    post({
      path: "user-registration",
      headers: {headers: {'Content-Type': 'application/json', 'Content-Type':'multipart/form-data'}},
      formData: {
        username: usernameRef.current.value,
        email: emailRef.current.value,
        password: passwordRef.current.value
      }
    }).then(response => {
      if(response.status == 200){
        localStorage.setItem('token', response.headers['authorization'].split('Bearer ')[1]);
        setCurrentUser(response.data);
        setuserLoggedIn(true);
        setNotices(arr => ['Registered sucessfully.']);
        navigate('/', {replace: true}); // redirect to <Groups/> after registration
      } else {
        setAlerts(arr => response.data?.errors); // Display errors if registration is unsuccessful
      }
    });
  }

  return (
    <div  className="h-screen bg-gray-50">
      <div className="flex min-h-full max-w-[400px] items-center justify-center py-12 px-4 sm:px-6 lg:px-8 mx-auto">
        <div className="w-full max-w-md space-y-8 pb-10 mb-10">
          <div className='text-center'>
            <FontAwesomeIcon icon={faLayerGroup} className="text-4xl text-green-600" />
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
              Register
            </h2>
          </div>
          <form className="mt-8 space-y-6" onSubmit={registerAccount}>
            <div className="-space-y-px rounded-[4px] shadow-sm">
              <div>
                <label htmlFor="email-address" className="sr-only">
                  Email address
                </label>
                <input
                  id="email-address"
                  name="username"
                  ref={usernameRef}
                  type="text"
                  autoComplete="username"
                  required
                  className="relative block w-full appearance-none rounded-none rounded-t-[4px] border border-gray-300 px-3 py-4 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-green-500 focus:outline-none focus:ring-green-500 sm:text-sm"
                  placeholder="Username"
                />
              </div>
              <div>
                <label htmlFor="email-address" className="sr-only">
                  Email address
                </label>
                <input
                  id="email-address"
                  name="email"
                  ref={emailRef}
                  type="email"
                  autoComplete="email"
                  required
                  className="relative block w-full appearance-none rounded-none border border-gray-300 px-3 py-4 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-green-500 focus:outline-none focus:ring-green-500 sm:text-sm"
                  placeholder="Email address"
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  ref={repeatPasswordRef}
                  type="password"
                  autoComplete="current-password"
                  required
                  className="relative block w-full appearance-none rounded-none border border-gray-300 px-3 py-4 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-green-500 focus:outline-none focus:ring-green-500 sm:text-sm"
                  placeholder="Password"
                />
              </div>
              <div>
                <label htmlFor="repeat-password" className="sr-only">
                  Repeat Password
                </label>
                <input
                  id="repeatPassword"
                  name="repeat-password"
                  ref={passwordRef}
                  type="password"
                  autoComplete="repeat-password"
                  required
                  className="relative block w-full appearance-none rounded-none rounded-b-[4px] border border-gray-300 px-3 py-4 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-green-500 focus:outline-none focus:ring-green-500 sm:text-sm"
                  placeholder="Repeat Password"
                />
              </div>
            </div>

            <div>
              <button type="submit"
                className="group relative flex w-full justify-center rounded-[4px] border border-transparent bg-green-600 py-4 px-4 text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                Sign up
              </button>
              <div className="relative mt-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200 mx-6" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-gray-50 px-2 text-gray-400">OR</span>
                </div>
              </div>
              <Link to='/login' className="font-normal text-gray-500 hover:text-green-500 w-full text-center block mt-4">Login to your Account</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}


      // .then(response => console.log(response))
    // console.log('---', resp);


//   {
//     "id": "98fcd573-d73b-486e-86b3-af6fff212cd6",
//     "year": 2022,
//     "month": 9,
//     "username": "turibamwessss",
//     "email": "turibamwe@outlook.comss"
// }

//   {data: {…}, status: 200, statusText: 'OK', headers: {…}, config: {…}, …}
// config
// :
// {transitional: {…}, transformRequest: Array(1), transformResponse: Array(1), timeout: 0, adapter: ƒ, …}
// data
// :
// {id: '98fcd573-d73b-486e-86b3-af6fff212cd6', year: 2022, month: 9, username: 'turibamwessss', email: 'turibamwe@outlook.comss'}
// headers
// :
// {cache-control: 'max-age=0, private, must-revalidate', content-type: 'application/json; charset=utf-8'}
// request
// :
// XMLHttpRequest {onreadystatechange: null, readyState: 4, timeout: 0, withCredentials: false, upload: XMLHttpRequestUpload, …}
// status
// :
// 200
// statusText
// :
// "OK"
