import { Fragment, useContext, useEffect, useRef, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { AppContext } from '../../App';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons'
import { post } from '../helpers/apiCallsHelper';

export default function GroupFormModal({...props}) {
  const {open, setOpen, setAlerts, setNotices, setuserLoggedIn, setCurrentUser, currentUser, group, setGroup} = useContext(AppContext);
  const groupNameRef = useRef(null);
  const isPublicRef = useRef(null);
  const isPrivateRef = useRef(null);
  const isSecretRef = useRef(null);
  const [groupAccess, setGroupAccess] = useState('');

  useEffect(() => {
    setGroupAccess(group.group_access || 'is_public');
    setGroup({...group});
    if(!open) {
      groupNameRef.current = '';
    }
  }, [open]);

  const radioIput = (event) => {
    const radioBtns = document.querySelectorAll('#radioBtns label');
    for (const lb of radioBtns) {
      if(lb.classList.contains('bg-gray-100')) {
        lb.classList.remove('border-gray-300', 'bg-gray-100', 'text-gray-500');
        lb.classList.add('border-gray-300', 'bg-white', 'text-gray-500', 'hover:text-gray-500');
      }
    }
    event.target.nextSibling.classList.add('border-gray-300', 'bg-gray-100', 'text-gray-500');
    event.target.nextSibling.classList.remove('border-gray-300', 'bg-white', 'text-gray-500', 'hover:text-gray-500');
    setGroupAccess(event.target.value);
  }

  function isGroupAccess(isActive) {
    return isActive ? 'border-gray-300 bg-gray-100 text-gray-500' : 'border-gray-300 bg-white text-gray-500 hover:text-gray-500'
  }

  const updateGroupName = (event) => {
    group.name = event.target.value
    setGroup({...group});
  }

  const submitForm = (event) => {
    event.preventDefault();
    post({
      path: props.action == 'update' ? `update-group/${group.id}` : 'create-group',
      headers: {headers: {
        'Content-Type': 'application/json',
        'Content-Type':'multipart/form-data',
        'Authorization': `Bearer ${localStorage.getItem("token")}`
      }},
      formData: {
        name: groupNameRef.current.value,
        group_access: groupAccess
      }
    }).then(response => {
      if(response.status == 200){
        group.name = groupNameRef.current.value
        group.group_access = groupAccess
        setGroup({...group});
        setuserLoggedIn(true);
        setNotices(arr => [props.action == 'update' ? 'Group successfully update.' : 'Group successfully created.']);
        setOpen(false);
      } else {
        setAlerts(arr => response.data.errors); // Display errors if registration is unsuccessful
      }
    });
  }

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <form className="fixed inset-0 z-10 overflow-y-auto" onSubmit={submitForm}>
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl sm:p-10">
                <div className="absolute top-0 right-0 hidden pt-4 pr-4 sm:block">
                  <button type='button'
                    className="rounded-md text-2xl bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-0 focus:ring-offset-0"
                    onClick={() => setOpen(false)}
                  >
                    <span className="sr-only">Close</span>
                    <FontAwesomeIcon icon={faTimesCircle} />
                  </button>
                </div>
                <div className=" w-full">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left">
                    <Dialog.Title as="h3" className="text-3xl font-medium leading-6 text-gray-900">
                      Create/Edit Group
                    </Dialog.Title>
                    <div className="my-5 w-full flex flex-row items-start mt-8">
                      <div className="mr-6 pr-6 max-w-200">
                        <h1 className=" text-2xl mb-3">Group name:</h1>
                        <p className="font-light mb-3 text-sm text-gray-400">People will see this name before joining your group</p>
                      </div>
                      <input
                        id="group-name"
                        name="name"
                        type="text"
                        ref={groupNameRef}
                        value= {group.name || ''}
                        autoComplete="name"
                        onChange={updateGroupName}
                        required
                        className="relative flex-grow block w-full appearance-none rounded-[3px] border border-gray-300 px-3 py-3 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-green-500 focus:outline-none focus:ring-green-500 sm:text-sm"
                        placeholder="Group name"
                      />
                    </div>
                    <div className="my-5 w-full flex flex-row items-start mt-8">
                      <div className="mr-6 pr-6 max-w-200">
                        <h1 className=" text-2xl mb-3">Access control</h1>
                        <p className="font-light mb-3 text-sm text-gray-400">Open means anyone can join. Private means you have to accept their requests. Secret means that you have invited them to join.</p>
                      </div>
                      <div className="block w-full">
                        <div className="flex flex-row justify-between plan group w-full" id="radioBtns"  onChange={radioIput}>
                          <input type="radio" name="group_access" id="is_public" value="is_public" className='hidden'/>
                          <label htmlFor="is_public" ref={isPublicRef} className={isGroupAccess(groupAccess == 'is_public') + ' cursor-pointer inline-flex w-full mx-3 justify-center rounded-[3px] border px-4 py-2 text-base text-gray-500 shadow-sm hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 sm:mt-0'}>Public</label>
                          <input type="radio" name="group_access" id="is_private" value="is_private" className='hidden'/>
                          <label htmlFor="is_private" ref={isPrivateRef} className={isGroupAccess(groupAccess == 'is_private') + ' cursor-pointer inline-flex w-full mx-3 justify-center rounded-[3px] border px-4 py-2 text-base text-gray-500 shadow-sm hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 sm:mt-0'}>Private</label>
                          <input type="radio" name="group_access" id="is_secret" value="is_secret" className='hidden'/>
                          <label htmlFor="is_secret" ref={isSecretRef} className={isGroupAccess(groupAccess == 'is_secret') + ' cursor-pointer inline-flex w-full mx-3 justify-center rounded-[3px] border px-4 py-2 text-base text-gray-500 shadow-sm hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 sm:mt-0'}>Secret</label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="inline-flex w-full justify-center rounded-[3px] border border-transparent bg-green-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    {props.action == 'update' ? 'Update/Save' : 'Create/Save'}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </form>
      </Dialog>
    </Transition.Root>
  )
}
