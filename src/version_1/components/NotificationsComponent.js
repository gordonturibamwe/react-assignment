import React, { useContext, useEffect, useRef } from 'react'
import { AppContext } from '../../App';
import { useAutoAnimate } from '@formkit/auto-animate/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBell } from '@fortawesome/free-solid-svg-icons'

export default function NotificationsComponent() {
  const {notifications, setNotifications} = useContext(AppContext);
  const [animate] = useAutoAnimate(/* optional config */)

  useEffect(() => {
    const interval = setTimeout(function(){
      setNotifications([]);
      clearTimeout(interval);
    }, 3000);
  }, [setNotifications]);

  function closeAlert(event) {
    setNotifications([]);
  }

  return (
    <div ref={animate}>
      <div className="alert-toast fixed z-[100] top-[80px] right-[13px] max-w-[250px] w-full">
        {notifications.map((notification, index) => (
          <span key={index} className="close cursor-pointer mb-3 flex flex-row items-center justify-start w-full p-6 bg-orange-500 rounded shadow-md text-white" title="close" htmlFor="footertoast">
            <FontAwesomeIcon icon={faBell} className="mr-4 mt-[5px] text-lg" />
            <p className="opacity-80 text-sm">{notification.message}</p>
            <svg onClick={closeAlert} className="fill-current text-white absolute right-4 top-4 h-5" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
              <path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"></path>
            </svg>
          </span>
        ))}
      </div>
    </div>
  )
}
