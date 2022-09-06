import React, { useContext, useEffect, useRef } from 'react'
import { AppContext } from '../../App';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLayerGroup } from '@fortawesome/free-solid-svg-icons'
import { post } from '../helpers/apiCallsHelper';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
  const usernameEmailRef = useRef(null);
  const rememberMeRef = useRef(null);
  const passwordRef = useRef(null);
  const {setAlerts, setNotices, setuserLoggedIn, setCurrentUser} = useContext(AppContext);
  const navigate = useNavigate();

  const login = (event) => {
    event.preventDefault();
    if(passwordRef.current.value.length < 4) {
      setAlerts(arr => ['Password is too short. Minimum 4 characters.']);
      return;
    }
    post({
      path: "user-login",
      headers: {headers: {'Content-Type': 'application/json', 'Content-Type':'multipart/form-data'}},
      formData: {
        login: usernameEmailRef.current.value,
        password: passwordRef.current.value
      }
    }).then(response => {
      console.log(response);
      if(response.status == 200){
        localStorage.setItem('token', response.headers['authorization'].split('Bearer ')[1]);
        setCurrentUser(response.data);
        setuserLoggedIn(true);
        setNotices(arr => ['Logged in sucessfully.']);
        navigate('/', {replace: true}); // redirect to <Groups/> after registration
      } else {
        setAlerts(arr => response.data.errors); // Display errors if registration is unsuccessful
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
              Login
            </h2>
          </div>
          <form className="mt-8 space-y-6" onSubmit={login}>
            <input type="hidden" name="remember" defaultValue="true" />
            <div className="-space-y-px rounded-[4px] shadow-sm">
              <div>
                <label htmlFor="email-or-username" className="sr-only">
                  Email address
                </label>
                <input
                  id="email-or-username"
                  name="usernameEmail"
                  ref={usernameEmailRef}
                  type="text"
                  autoComplete="email"
                  required
                  className="relative block w-full appearance-none rounded-none rounded-t-[4px] border border-gray-300 px-3 py-4 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-green-500 focus:outline-none focus:ring-green-500 sm:text-sm"
                  placeholder="Username or Email"
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  ref={passwordRef}
                  type="password"
                  autoComplete="current-password"
                  required
                  className="relative block w-full appearance-none rounded-none rounded-b-[4px] border border-gray-300 px-3 py-4 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-green-500 focus:outline-none focus:ring-green-500 sm:text-sm"
                  placeholder="Password"
                />
              </div>
            </div>

            <div>
              <button type="submit"
                className="group relative flex w-full justify-center rounded-[4px] border border-transparent bg-green-600 py-4 px-4 text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                Sign in
              </button>
              <div className="relative mt-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200 mx-6" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-gray-50 px-2 text-gray-400">OR</span>
                </div>
              </div>
              <Link to='/register' className="font-normal text-gray-500 hover:text-green-500 w-full text-center block mt-4">Register Account</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
