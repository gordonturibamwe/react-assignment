import React, { createContext, useLayoutEffect, useRef, useState } from 'react'
import Trix from "trix";
import { ReactTrixRTEInput, ReactTrixRTEToolbar } from "react-trix-rte";
import { TOOLBAR_ACTION_OPTS } from '../helpers/constants';
import Picker from 'emoji-picker-react';
import '../../App.css'
import GroupFormModal from '../components/GroupFormModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCog, faTimes, faCheck, faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { AppContext } from '../../App';

export default function Group() {
  let [value, setValue] = useState();
  let [users, setUsers] = useState([]);
  const emojiRef = useRef(null);
  const imgRef = useRef(null);
  const usernameRef = useRef(null);
  const [open, setOpen] = useState(false);

  useLayoutEffect(() => {
    const trixEmojiButton = document.querySelector('[data-trix-action="emoji"]');
    trixEmojiButton.addEventListener('click', (event) => emojiRef.current.classList.remove('hidden'));
  });

  function trixEditorOnChange(event) {
    setValue(event.target.value);
    if(event.target.value.includes('@')) {
      const trixEditor = document.querySelector('trix-editor');
      const pos = trixEditor.editor.getClientRectAtPosition(0);
      usernameRef.current.style.left = `${parseInt(pos.x)}px`;
      usernameRef.current.style.top = `${parseInt(pos.y + 30)}px`;
      usernameRef.current.classList.remove('hidden');
      console.log('--', trixEditor.editor.getClientRectAtPosition(0), `${parseInt(pos.x)}px`);
    } else {
      usernameRef.current.classList.add('hidden');
    }
  }

  const onEmojiClick = (event, emojiObject) => {
    const trixEditor = document.querySelector('trix-editor');
    // const cursorPosition = trixEditor.editor.getSelectedRange();
    emojiRef.current.classList.add('hidden');
    // trixEditor.editor.setSelectedRange(cursorPosition);
    trixEditor.editor.insertString(` ${emojiObject.emoji} `);
  };

  function submitForm(event) {
    console.log(event.target)
    event.preventDefault();
  }

  function attachment(event) {
    // imgRef.current.src = event['attachment'].attachment.fileObjectURL; // <~ Add image to this. Push it to cloud.
    const trixEditor = document.querySelector('trix-editor');
    console.log(trixEditor.editor);
  }

  function taggingUsername(event) {
    const trixEditor = document.querySelector('trix-editor');
    trixEditor.editor.deleteInDirection("backward");
    trixEditor.editor.insertHTML(` <pre>${event.target.textContent}</pre> <div>, </div>`);
    console.log(event.target.textContent);
  }

  return (
    <>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className='grid grid-cols-4 gap-x-8 pt-6'>
          <div className='col-span-3 min-h-[350px]'>
            <AppContext.Provider value={{open, setOpen}}>
              <GroupFormModal groupName="My group Name Here"/>
              <div className="flex flex-row w-full mb-6 mt-6 items-center">
                <h1 className="font-semibold text-4xl mr-4 capitalize text-gray-600">My group</h1>
                <button onClick={() => setOpen(true)} className="text-3xl inline-block text-green-600"><FontAwesomeIcon icon={faCog} /></button>
              </div>
            </AppContext.Provider>

            <form className='block w-full' onSubmit={submitForm}>
              <ReactTrixRTEToolbar toolbarId="react-trix-rte-editor" customToolbarActions={TOOLBAR_ACTION_OPTS} disableGroupingAction='false' toolbarActions={["attachImage", "emoji", "bold", "italic", "strike"]}/>
              <div className='relative w-full'>
                <div className='absolute hidden' ref={emojiRef}>
                  <Picker onEmojiClick={onEmojiClick} />
                </div>
              </div>
              <ReactTrixRTEInput {...{
                onChange: (event) => trixEditorOnChange(event),
                onEditor: (editor) => {console.log(`Editor callback: `, editor)},
                placeholder: 'Start typing...',
                onAttachmentAdd: (event) => attachment(event),
                railsBlobUrl: (url) => console.log('URL', url),
                toolbarId: 'react-trix-rte-editor',
                toolbarActions: ["attachFiles"]
              }}/>
              <div className='flex w-full justify-end pt-3'>
                <button type="submit" className='rounded-[4px]  px-6 py-2 bg-green-600 hover:bg-green-700 border-green-800 text-white block text-sm font-medium shadow-sm '>+ Post</button>
              </div>
            </form>
            <img src="" alt="" ref={imgRef} className="rounded max-w-100"/>

            <div ref={usernameRef} className="overflow-hidden bg-white w-40 absolute hidden" style={{left: '110px', top: '277px'}}>
              <ul role="list" className="divide-y divide-gray-200 border sm:rounded-[4px]">
                <li key="ddd1">
                  <a href="#" onClick={taggingUsername} className="block hover:bg-gray-50 px-3 py-2 truncate text-sm font-medium text-green-600">
                    gordon
                  </a>
                </li>
                <li key="ddd2">
                  <a href="#" onClick={taggingUsername} className="block hover:bg-gray-50 px-3 py-2 truncate text-sm font-medium text-green-600">
                    Kalanzi
                  </a>
                </li>
                <li key="ddd3">
                <a href="#" onClick={taggingUsername} className="block hover:bg-gray-50 px-3 py-2 truncate text-sm font-medium text-green-600">
                  fortunate
                  </a>
                </li>
                <li key="ddd4">
                  <a href="#" onClick={taggingUsername} className="block hover:bg-gray-50 px-3 py-2 truncate text-sm font-medium text-green-600">
                    loving
                  </a>
                </li>
              </ul>
            </div>

            <div className='w-full pb-10'>
              <h1 className="font-semibold text-3xl mr-4 capitalize text-gray-600 mt-4">All Posts</h1>
              <div className="mt-6 border rounded-[4px] shadow-sm" id="dfdfdf">
                <div className='p-5 pb-2'>
                  <h1 className="font-medium text-3xl inline-block mb-3 text-gray-600 w-4/5 font-serif">For a More Creative Brain Follow These 5 Steps</h1>
                  <div className="mt-0 post text-sm text-gray-600"> early all great ideas follow a similar creative process and this article explains how this process works. Understanding this is important because creative thinking is one of the most useful skills you can possess. Nearly every problem you face in work and in life can benefit from innovative solutions, lateral thinking, and creative ideas..</div>
                  <span className="mt-4 block text-xs text-gray-400 font-normal" id="_<%= post.id %>">
                    <span>Last comment 4 mins ago</span> .
                    <span className="mr-1 ml-1 inline-block"><a href='/'>Edit</a></span> .
                    <span className="mr-1 ml-1 inline-block"><a href='/'>Delete</a></span> .
                    <span className="mr-1 ml-1 inline-block">Created by Username</span>
                  </span>
                </div>
                <a href='/post/dsfsfs' className='bg-gray-50 block w-full px-5 py-3 mt-3 text-gray-400 hover:text-gray-500 rounded-b-[4px] border-t'>
                  <p className='truncate text-sm font-medium text-green-600'>View Post <span className='inline-block ml-2 text-xs'><FontAwesomeIcon icon={faArrowRight} /></span></p>
                </a>
              </div>

              <div className="mt-6 border rounded-[4px] shadow-sm" id="dfdfdf">
                <div className='p-5 pb-2'>
                  <h1 className="font-medium text-3xl inline-block mb-3 text-gray-600 w-4/5 font-serif">The Surprising Benefits of Journaling One Sentence Every Day</h1>
                  <div className="mt-0 post text-sm text-gray-600">Throughout the 1980s and 1990s, the “Queen of All Media” built a brand that stretched far beyond the television screen. She went on to become a billionaire, a well-regarded philanthropist, and a recipient of the Presidential Medal of Freedom. And as she was busy working toward these otherworldly accomplishments, Oprah relied on a simple habit: journaling..</div>
                  <span className="mt-4 block text-xs text-gray-400 font-normal" id="_<%= post.id %>">
                    <span>Last comment 29 days ago</span> .
                    <span className="mr-1 ml-1 inline-block">Created by Kalanzi</span>
                  </span>
                </div>
                <a href='/post/dsfsfs' className='bg-gray-50 block w-full px-5 py-3 mt-3 text-gray-400 hover:text-gray-500 rounded-b-[4px] border-t'>
                  <p className='truncate text-sm font-medium text-green-600'>View Post <span className='inline-block ml-2 text-xs'><FontAwesomeIcon icon={faArrowRight} /></span></p>
                </a>
              </div>

              <div className="mt-6 border rounded-[4px] shadow-sm" id="dfdfdf">
                <div className='p-5 pb-2'>
                  <h1 className="font-medium text-3xl inline-block mb-3 text-gray-600 w-4/5 font-serif">The true story of the fake US embassy in Ghana</h1>
                  <div className="mt-0 post text-sm text-gray-600">The story was an immediate hit. “In less than an hour we were getting 20,000 views on the website for that story alone,” Emmanuel Dogbevi, the website’s managing editor, told me. Two days later, the news agency Reuters picked up the story and it swiftly became an international sensation.</div>
                  <span className="mt-4 block text-xs text-gray-400 font-normal" id="_<%= post.id %>">
                    <span>Last comment 4 mins ago</span> .
                    <span className="mr-1 ml-1 inline-block"><a href='/'>Edit</a></span> .
                    <span className="mr-1 ml-1 inline-block"><a href='/'>Delete</a></span> .
                    <span className="mr-1 ml-1 inline-block">Created by Username</span>
                  </span>
                </div>
                <a href='/post/dsfsfs' className='bg-gray-50 block w-full px-5 py-3 mt-3 text-gray-400 hover:text-gray-500 rounded-b-[4px] border-t'>
                  <p className='truncate text-sm font-medium text-green-600'>View Post <span className='inline-block ml-2 text-xs'><FontAwesomeIcon icon={faArrowRight} /></span></p>
                </a>
              </div>
            </div>


          </div>
          <div className='col-span-1 min-h-[50px] mt-6'>
            <input
              id="email-address"
              name="groupName"
              type="text"
              autoComplete="name"
              className="mb-4 relative flex-grow block w-full appearance-none rounded-[3px] border border-gray-300 px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:z-10 focus:border-green-500 focus:outline-none focus:ring-green-500 sm:text-sm"
              placeholder="Invite @user"
            />

            <div className="felx flex-row w-full">
              <h1 className="font-bold text-2xl inline-block mr-3">Members</h1>
              <div className="flex justify-between space-x-3 pt-2">
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-gray-400 truncate">Gordon</p>
                </div>
              </div>
              <div className="flex justify-between space-x-3 pt-4">
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-gray-400 truncate">Jessica</p>
                </div>
                <button className='flex-shrink-0 text-red-500 whitespace-nowrap text-sm'><FontAwesomeIcon icon={faTimes} /></button>
              </div>
            </div>

            <div className="flex flex-col w-full mt-8 mb-4">
              <h1 className="font-bold text-2xl inline-block mr-3">Requests</h1>
              <div className="flex justify-between space-x-3 pt-4">
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-light text-gray-400 truncate">Nakku</p>
                </div>
                <span className="flex flex-row">
                  <button className='flex-shrink-0 text-red-500 whitespace-nowrap mr-4 text-sm'><FontAwesomeIcon icon={faTimes} /></button>
                  <button className='flex-shrink-0 text-green-500 whitespace-nowrap text-sm'><FontAwesomeIcon icon={faCheck} /></button>
                </span>
              </div>
              <div className="flex justify-between space-x-3 pt-4">
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-light text-gray-400 truncate">Hezel</p>
                </div>
                <span className="flex flex-row">
                  <button className='flex-shrink-0 text-red-500 whitespace-nowrap mr-4 text-sm'><FontAwesomeIcon icon={faTimes} /></button>
                  <button className='flex-shrink-0 text-green-500 whitespace-nowrap text-sm'><FontAwesomeIcon icon={faCheck} /></button>
                </span>
              </div>
              <div className="flex justify-between space-x-3 pt-4">
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-light text-gray-400 truncate">Mabilizi</p>
                </div>
                <span className="flex flex-row">
                  <button className='flex-shrink-0 text-red-500 whitespace-nowrap mr-4 text-sm'><FontAwesomeIcon icon={faTimes} /></button>
                  <button className='flex-shrink-0 text-green-500 whitespace-nowrap text-sm'><FontAwesomeIcon icon={faCheck} /></button>
                </span>
              </div>
              <div className="flex justify-between space-x-3 pt-4">
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-light text-gray-400 truncate">Jesus</p>
                </div>
                <span className="flex flex-row">
                  <button className='flex-shrink-0 text-red-500 whitespace-nowrap mr-4 text-sm'><FontAwesomeIcon icon={faTimes} /></button>
                  <button className='flex-shrink-0 text-green-500 whitespace-nowrap text-sm'><FontAwesomeIcon icon={faCheck} /></button>
                </span>
              </div>
            </div>


          </div>
        </div>
      </div>
    </>
  )
}

// Toolbar editor
// https://github.com/abhaynikam/react-trix-rte/blob/master/src/components/ReactTrixRTEToolbar/constants.js

// ReactTrixRTEInput
// https://github.com/abhaynikam/react-trix-rte/blob/master/src/components/ReactTrixRTEInput/ReactTrixRTEInput.jsx
