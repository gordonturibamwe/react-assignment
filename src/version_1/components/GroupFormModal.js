import { Fragment, useContext, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { AppContext } from '../../App';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons'

export default function GroupFormModal() {
  const {open, setOpen} = useContext(AppContext);

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

        <div className="fixed inset-0 z-10 overflow-y-auto">
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
                  <button
                    type="button"
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
                        <h1 className=" text-2xl mb-3">Group name</h1>
                        <p className="font-light mb-3 text-sm text-gray-400">People will see this name before joining your group</p>
                      </div>
                      <input
                        id="email-address"
                        name="groupName"
                        type="text"
                        autoComplete="name"
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
                      <div className="block w-full" data-controller="buttonssss">
                        <div className="flex flex-row justify-between plan group w-full" data-buttons-target="parent">
                          <input type="radio" name="group[group_access]" id="is_public" value="is_public" className='hidden' checked/>
                          <label htmlFor="is_public" className='inline-flex w-full m-r-1 justify-center rounded-[3px] border border-gray-300 bg-white px-4 py-2 text-base text-gray-500 shadow-sm hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0'>Public</label>
                          <input type="radio" name="group[group_access]" id="is_private" value="is_private" className='hidden'/>
                          <label htmlFor="is_private" className='inline-flex w-full mx-3 justify-center rounded-[3px] border border-gray-300 bg-white px-4 py-2 text-base text-gray-500 shadow-sm hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0'>Private</label>
                          <input type="radio" name="group[group_access]" id="is_secret" value="is_secret" className='hidden'/>
                          <label htmlFor="is_secret"className='inline-flex w-full m-l-1 justify-center rounded-[3px] border border-gray-300 bg-white px-4 py-2 text-base text-gray-500 shadow-sm hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0'>Secret</label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-[3px] border border-transparent bg-green-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={() => setOpen(false)}
                  >
                    Create/Save
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}