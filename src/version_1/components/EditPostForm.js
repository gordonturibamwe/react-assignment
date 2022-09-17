import React, { useContext, useEffect, useRef, useState } from 'react'
import Trix from "trix";
import { ReactTrixRTEInput, ReactTrixRTEToolbar } from "react-trix-rte";
import { TOOLBAR_ACTION_OPTS } from '../helpers/constantsHelper';
import Picker from 'emoji-picker-react';
import '../../App.css'
import { AppContext } from '../../App';
import { get, patch } from '../helpers/apiCallsHelper';


export default function EditPostForm({...props}) {
  let [value, setValue] = useState();
  let nameTagStartPoint;
  let [users, setUsers] = useState([]);
  const emojiRef = useRef(null);
  const imgRef = useRef(null);
  const usernameRef = useRef(null);
  const titleRef = useRef(null);
  const editorRef = useRef(null);

  const {
    setuserLoggedIn,
    setAlerts, setNotices,
    groupMembers, setGroupMembers,
    searchUsers, setUserchUsers,
    CableApp
  } = useContext(AppContext);

  useEffect(() => {
    // const trixEditor = document.querySelector(props.id);
    const trixEmojiButton = document.querySelector('[data-trix-action="emoji"]');
    trixEmojiButton.addEventListener('click', (event) => emojiRef.current.classList.remove('hidden'));
    // titleRef.current.value = props.title;
    // // trixEditor.editor.value = props.content;
    // trixEditor.editor.loadHTML(props.content)
    // console.log('---', editorRef.current, titleRef.current.value, trixEditor.editor.value)
  }, []);

  function trixEditorOnChange(event) {
    setValue(event.target.value);
    if(event.target.value.includes('@')) {
      const trixEditor = document.querySelector(`[input="${props.id}"]`);
      const v = trixEditor.editor.getSelectedRange()
      console.log(v, nameTagStartPoint === null, value)
      if(!nameTagStartPoint) nameTagStartPoint = v;
      console.log('VALUE', nameTagStartPoint);
      console.log('++=', trixEditor.editor.setSelectedRange([0, 4]))
      // trixEditor.editor.deleteInDirection("backward");
      // const pos = trixEditor.editor.getClientRectAtPosition(0);
      // const ppp = trixEditor.editor.getSelectedRange();
      // usernameRef.current.style.left = `${parseInt(125)}px` //`${parseInt(pos.x + ppp[0])}px`;
      // usernameRef.current.style.top = `${parseInt(125)}px` //`${parseInt(pos.y + ppp[1] + 20)}px`;
      usernameRef.current.classList.remove('hidden');
      // console.log('--', trixEditor.editor.getClientRectAtPosition(0), `${parseInt(pos.x + ppp[0])}px`);
      // console.log('-->>', ppp);
      // trixEditor.editor.insertHTML('<div>HERE IS UL</div>');
      // trixEditor.editor.insertHTML(` <pre>${event.target.textContent}</pre> <div>, </div>`);
      // console.log('--++',trixEditor.selectionStart, window.getSelection());
    } else {
      usernameRef.current.classList.add('hidden');
    }
  }

  const onEmojiClick = (event, emojiObject) => {
    const trixEditor = document.querySelector(`[input="${props.id}"]`);
    // const cursorPosition = trixEditor.editor.getSelectedRange();
    emojiRef.current.classList.add('hidden');
    // trixEditor.editor.setSelectedRange(cursorPosition);
    trixEditor.editor.insertString(` ${emojiObject.emoji} `);
  };

  function submitForm(event) {
    console.log('----', props.id)
    event.preventDefault();
    const trixEditor = document.querySelector(`[input="${props.postId}"]`)
    console.log(trixEditor, titleRef.current);
    console.log(trixEditor.editor?.composition?.attachments);
    console.log(trixEditor.editor);
    console.log(JSON.stringify(trixEditor.editor));
    console.log('-')
    console.log(JSON.stringify(trixEditor.editor.document));
    console.log('+++');
    console.log(trixEditor.value);
    console.log('PROPS', props);
    if (true)
      patch({
        path: "update-post/" + props.postId,
        headers: {headers: {
          'Authorization': `Bearer ${localStorage.getItem("token")}`,
          'Content-Type': 'application/json',
          'Content-Type':'multipart/form-data'
        }},
        formData: {
          title: titleRef.current.value,
          content: trixEditor.value,
        }
      }).then(response => {
        if(response.status == 200){
          setNotices(arr => ['Post successfuly saved.']);
          trixEditor.value = ''
          titleRef.current.value = ''
          document.querySelector(`div#form-${props.prostId}`).classList.add('hidden');
        } else {
          setAlerts(arr => response.data?.errors); // Display errors if registration is unsuccessful
        }
      });
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
    // var attachment = new Trix.Attachment({ content: `<span class="rounded-full bg-red-600 text-white px-2 py-1 text-xs inline">${event.target.textContent}</span>` })
    // trixEditor.editor.insertAttachment(attachment)
    usernameRef.current.classList.add('hidden');
  }

  function inviteUser(event) {
    const value = event.target.value;
    if (value == '') setUserchUsers([]);
    if(!value.match(/[a-zA-Z0-9]/)) return
    else
      get({
        path: `search-user/${value.replace('@', '')}`,
        headers: {headers: {'Authorization': `Bearer ${localStorage.getItem("token")}`}},
      }).then(response => {
        console.log(response.data)
        if(response.status == 200) {
          setUserchUsers([...response.data.users]);
          console.log('sss', searchUsers);
          setGroupMembers([...groupMembers]);
          setuserLoggedIn(true);
        } else {
          setUserchUsers([]);
        }
      });
  }

  return (
    <div>
      <form className='block w-full mt-6 relative' onSubmit={submitForm}>
        <div className='mb-4'>
          <label htmlFor="title" className="sr-only">
            Email address
          </label>
          <input
            id={`title-${props.postId}`}
            name="title"
            ref={titleRef}
            type="text"
            autoComplete="Title"
            required
            className="relative block w-full appearance-none rounded-[4px] border border-gray-300 px-3 py-3 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-green-500 focus:outline-none focus:ring-green-500 sm:text-sm"
            placeholder="Title"
          />
        </div>
        <ReactTrixRTEToolbar toolbarId={props.postId} customToolbarActions={TOOLBAR_ACTION_OPTS} disableGroupingAction='false' toolbarActions={["attachImage", "emoji", "bold", "italic", "strike"]}/>
        <div className='relative w-full'>
          <div className='absolute hidden' ref={emojiRef}>
            <Picker onEmojiClick={onEmojiClick} />
          </div>
        </div>
        <ReactTrixRTEInput id={props.postId} {...{
          onChange: (event) => trixEditorOnChange(event),
          onEditor: (editor) => {console.log(`Editor callback: `, editor)},
          placeholder: 'Start typing...',
          onAttachmentAdd: (event) => attachment(event),
          railsBlobUrl: (url) => console.log('URL', url),
          toolbarId: props.postId,
          toolbarActions: ["attachFiles"]
        }}/>
        <div className='flex w-full justify-end pt-3'>
          <button type="submit" className='rounded-[4px]  px-6 py-2 bg-green-600 hover:bg-green-700 border-green-800 text-white block text-sm font-medium shadow-sm '>{props.buttonTitle}</button>
        </div>

        <div className="overflow-y-hidden bg-white absolute w-[184px] z-10 hidden top-[50%] left-[30px]" ref={usernameRef}>
          <ul role="list" className="divide-y divide-gray-200 border sm:rounded-[4px]">
            <li className="cursor-pointer">
              <span onClick={taggingUsername} className="block hover:bg-gray-50 px-3 py-2 truncate text-sm font-medium text-green-600">
                Gordon
              </span>
            </li>
            <li className="cursor-pointer">
              <span href="#" className="block hover:bg-gray-50 px-3 py-2 truncate text-sm font-medium text-green-600">
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
}
