import React, { useContext, useLayoutEffect, useRef, useState } from 'react'
import Trix from "trix";
import { ReactTrixRTEInput, ReactTrixRTEToolbar } from "react-trix-rte";
import { TOOLBAR_ACTION_OPTS } from '../helpers/constantsHelper';
import Picker from 'emoji-picker-react';
import '../../App.css'
import { AppContext } from '../../App';
import { get, post } from '../helpers/apiCallsHelper';

export default function PostForm({...props}) {
  const [usernameRange, setUsernameRange] = useState({begin: 0, end: 0}); // tracking
  const emojiRef = useRef(null); // for emojis in trixEditor input
  const imgRef = useRef(null); // uploading images to server
  const usernameRef = useRef(null); // Used to update username list on search
  const titleRef = useRef(null); // updating title in the post form title
  let trixEditor = null; // trixEditor input element
  const [mentions, setMentions] = useState([]);

  const {
    setUserLoggedIn, // boolean true if user logged in
    setAlerts, setNotices, // setting alerts and notices, takes an array of strings
    groupMembers, setGroupMembers, // group members with request_accepted == true
    searchUsers, setUserchUsers // holds
  } = useContext(AppContext); // application context to hold global app info

  useLayoutEffect(() => { // add click event listener to emoji toolbar button
    trixEditor = document.querySelector('trix-editor');
    const trixEmojiButton = document.querySelector('[data-trix-action="emoji"]');
    trixEmojiButton.addEventListener('click', () => emojiRef.current.classList.remove('hidden'));
  }, []);

  function trixEditorOnChange(event) {
    if(event.target.value.includes('@')) {
      const range = trixEditor.editor.getSelectedRange();
      if(usernameRange.begin == 0) usernameRange.begin = range[0] - 1;
      usernameRange.end = range[1];
      usernameRef.current.classList.remove('hidden');
    } else {
      usernameRef.current.classList.add('hidden');
    }
  }

  function taggingUsername(event) {
    console.log('::;', usernameRange)
    const trixEditor = document.querySelector('trix-editor');
    trixEditor.editor.setSelectedRange([usernameRange.begin, usernameRange.end]);
    trixEditor.editor.deleteInDirection("backward");
    // trixEditor.value = trixEditor.value.replaceAll(`@${tagUsernameToSearch}`, '');
    trixEditor.editor.insertHTML(` <pre>${event.target.textContent}</pre> <div>, </div>`);
    usernameRange.begin = 0;
    usernameRange.end = 0;
    console.log(event.target.textContent);
    // var attachment = new Trix.Attachment({ content: `<span class="rounded-full bg-red-600 text-white px-2 py-1 text-xs inline">${event.target.textContent}</span>` })
    // trixEditor.editor.insertAttachment(attachment)
    setMentions([...mentions, event.target.getAttribute('id')]);
    usernameRef.current.classList.add('hidden');
    console.log('mentions', mentions);
  }

  const onEmojiClick = (event, emojiObject) => {
    const trixEditor = document.querySelector('trix-editor');
    // const cursorPosition = trixEditor.editor.getSelectedRange();
    emojiRef.current.classList.add('hidden');
    // trixEditor.editor.setSelectedRange(cursorPosition);
    trixEditor.editor.insertString(` ${emojiObject.emoji} `);
  };

  const submitForm = (event) => {
    event.preventDefault();
    const trixEditor = document.querySelector('trix-editor');
    if (true)
      post({
        path: "create-post",
        headers: {headers: {
          'Authorization': `Bearer ${localStorage.getItem("token")}`,
          'Content-Type': 'application/json',
          'Content-Type':'multipart/form-data'
        }},
        formData: {
          id: props.id,
          title: titleRef.current.value,
          mentions: mentions.join(','),
          content: trixEditor.value,
        }
      }).then(response => {
        if(response.status == 200){
          setNotices(['Post successfuly saved.']);
          trixEditor.value = ''
          titleRef.current.value = ''
          setMentions([]);
        } else {
          setAlerts(response.data?.errors); // Display errors if registration is unsuccessful
        }
      });
  }

  const attachment = (event) => {
    // imgRef.current.src = event['attachment'].attachment.fileObjectURL; // <~ Add image to this. Push it to cloud.
    const trixEditor = document.querySelector('trix-editor');
    console.log(trixEditor.editor);
  }

  const inviteUser = (event) => {
    const value = event.target.value;
    if (value == '') setUserchUsers([]);
    if(!value.match(/[a-zA-Z0-9]/)) return;
    else {
      get({
        path: `search-user/${value.replace('@', '')}`,
        headers: {headers: {'Authorization': `Bearer ${localStorage.getItem("token")}`}},
      }).then(response => {
        console.log(response.data)
        if(response.status == 200) {
          setUserchUsers([...response.data.users]);
          console.log('sss', searchUsers);
          setGroupMembers([...groupMembers]);
          setUserLoggedIn(true);
        } else {
          setUserchUsers([]);
        }
      });
    }
  }

  return (
    <div>
      <form className='block w-full mt-6 relative' onSubmit={submitForm}>
        <div className='mb-4'>
          <label htmlFor="title" className="sr-only">
            Email address
          </label>
          <input
            id="title"
            name="title"
            ref={titleRef}
            type="text"
            autoComplete="Title"
            required
            className="relative block w-full appearance-none rounded-[4px] border border-gray-300 px-3 py-3 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-green-500 focus:outline-none focus:ring-green-500 sm:text-sm"
            placeholder="Title"
          />
        </div>
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
          <button type="submit" className='rounded-[4px]  px-6 py-2 bg-green-600 hover:bg-green-700 border-green-800 text-white block text-sm font-medium shadow-sm '>{props.buttonTitle}</button>
        </div>

        <div className="overflow-y-hidden bg-white absolute w-[184px] z-10 hidden top-[50%] left-[30px]" ref={usernameRef}>
          <ul role="list" className="divide-y divide-gray-200 border sm:rounded-[4px]">
            <li className="cursor-pointer">
              <span onClick={taggingUsername} id="cfdd2959-c400-43d6-8a17-603f4d61890e" className="block hover:bg-gray-50 px-3 py-2 truncate text-sm font-medium text-green-600">
                Gordon
              </span>
            </li>
            <li className="cursor-pointer">
              <span onClick={taggingUsername} id="8be84640-9cfb-42e6-934f-8e2e2d5fb3e5" className="block hover:bg-gray-50 px-3 py-2 truncate text-sm font-medium text-green-600">
                Zhedra
              </span>
            </li>
            <li className="cursor-pointer">
              <span onClick={taggingUsername} id="785773d4-e7a6-4d59-8065-f93032b84e74" className="block hover:bg-gray-50 px-3 py-2 truncate text-sm font-medium text-green-600">
                Jessica
              </span>
            </li>
            {searchUsers.map(user => (
              <li key={user.id} className="cursor-pointer">
                <span href="#" key={user.id} onClick={(event) => inviteUser(event, user)} className="block hover:bg-gray-50 px-3 py-2 truncate text-sm font-medium text-green-600">
                  {user.username}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </form>
      <img src="" alt="" ref={imgRef} className="rounded max-w-100"/>
      {/* {searchUsers.length > 0 && */}

    </div>
  )


  // if(usernameRange.length == 0) setUsernameRange(range);
  // console.log('====', range, usernameRange);
  // if(tagUsernameToSearch.length == 0) tagUsernameToSearch[0] = trixEditor.editor.getSelectedRange()[0] - 2;
  // else tagUsernameToSearch[1] = trixEditor.editor.getSelectedRange()[1] + 1;
  // console.log('---', tagUsernameToSearch, trixEditor.editor.getSelectedRange());
  // trixEditor.onkeypress = function(e) {
  //   const char = String.fromCharCode(e.keyCode);
  //   if (char != ' ') {
  //     tagUsernameToSearch += char
  //   // } else {
  //   //   trixEditor.value = event.target.value.replaceAll(`@${tagUsernameToSearch}`, '');
  //   }
  // }
}
    // console.log(trixEditor.editor, titleRef.current);
    // console.log(trixEditor.editor?.composition?.attachments);
    // console.log(trixEditor.editor);
    // console.log(JSON.stringify(trixEditor.editor));
    // console.log('-')
    // console.log(JSON.stringify(trixEditor.editor.document));
    // console.log('+++');
    // console.log(trixEditor.value);
    // console.log('PROPS', props);


      // trixEditor.editor.deleteInDirection("backward");
      // const pos = trixEditor.editor.getClientRectAtPosition(0);
      // const ppp = trixEditor.editor.getSelectedRange();
      // usernameRef.current.style.left = `${parseInt(125)}px` //`${parseInt(pos.x + ppp[0])}px`;
      // usernameRef.current.style.top = `${parseInt(125)}px` //`${parseInt(pos.y + ppp[1] + 20)}px`;
      // console.log('--', trixEditor.editor.getClientRectAtPosition(0), `${parseInt(pos.x + ppp[0])}px`);
      // console.log('-->>', ppp);
      // trixEditor.editor.insertHTML('<div>HERE IS UL</div>');
      // trixEditor.editor.insertHTML(` <pre>${event.target.textContent}</pre> <div>, </div>`);
      // console.log('--++',trixEditor.selectionStart, window.getSelection());
