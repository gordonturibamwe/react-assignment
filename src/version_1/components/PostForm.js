import React, { createContext, useLayoutEffect, useRef, useState } from 'react'
import Trix from "trix";
import { ReactTrixRTEInput, ReactTrixRTEToolbar } from "react-trix-rte";
import { TOOLBAR_ACTION_OPTS } from '../helpers/constantsHelper';
import Picker from 'emoji-picker-react';
import '../../App.css'

export default function PostForm({...props}) {
  let [value, setValue] = useState();
  let [users, setUsers] = useState([]);
  const emojiRef = useRef(null);
  const imgRef = useRef(null);
  const usernameRef = useRef(null);

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
    <div>
      <form className='block w-full mt-6 relative' onSubmit={submitForm}>
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

        <div ref={usernameRef} className="overflow-hidden bg-white w-40 absolute hidden">
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

      </form>
      <img src="" alt="" ref={imgRef} className="rounded max-w-100"/>

    </div>
  )
}