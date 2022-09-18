import React, { useContext, useEffect, useRef } from 'react'
import { AppContext } from '../../App';
import { useAutoAnimate } from '@formkit/auto-animate/react'

export default function NoticeComponent() {
  const {notices, setNotices} = useContext(AppContext);
  const noticeRef = useRef(null);
  const [animate] = useAutoAnimate(/* optional config */)

  useEffect(() => {
    const interval = setTimeout(function(){
      setNotices([]);
      clearTimeout(interval);
    }, 8000);
  }, [setNotices]);

  function closeAlert(event) {
    setNotices([]);
  }

  return (
    <div ref={animate}>
      <div className="alert-toast fixed z-[100] top-0 right-0 m-8 max-w-[300px] w-full" ref={noticeRef}>
        <label className="close cursor-pointer flex flex-col items-center justify-between w-full p-6 bg-green-500 rounded shadow-md text-white" title="close" htmlFor="footertoast">
          {notices.map((alert, index) => (
            <>
              <p key={index}>{alert}</p>
              <svg onClick={closeAlert} className="fill-current text-white absolute right-4 top-4 h-5" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
                <path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"></path>
              </svg>
            </>
          ))}
        </label>
      </div>
    </div>
  )
}
