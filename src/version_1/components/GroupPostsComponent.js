import React, { useState, useContext, useLayoutEffect, useEffect } from 'react'
import { get, destroy } from '../helpers/apiCallsHelper';
import TimeAgo from 'react-timeago'
import englishStrings from 'react-timeago/lib/language-strings/en'
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter'
import { AppContext } from '../../App';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCog, faTimes, faCheck, faArrowRight } from '@fortawesome/free-solid-svg-icons'
import LoadingSpinnerComponent from './LoadingSpinnerComponent';
import Parser from 'html-react-parser';
import EditPostForm from './EditPostForm';
import { Link } from 'react-router-dom';
import { useRef } from 'react';

export default function GroupPostsComponent() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const {currentUser, group, setNotices, setAlerts, CableApp, setCurrentUser} = useContext(AppContext);
  const formatter = buildFormatter(englishStrings);
  const postRef = useRef(null);

  useLayoutEffect(() => {
    get({
      path: `group-posts/${group.id}`,
      headers: {headers: {'Authorization': `Bearer ${localStorage.getItem("token")}`}},
    }).then(response => {
      console.log(response.data.posts)
      if(response.status == 200) {
        setPosts([...response.data.posts]);
      }
      setLoading(false);
    });
  }, []);


  useEffect(() => { // CONNECTING ACTION CABLE TO GROUPSCHANNEL
    CableApp.cable.subscriptions.create(
      {channel: 'PostsChannel'}, {
        received: (data) => {
          console.log(data);
          setCurrentUser(currentUser);
          if(data.group_id == group.id) {
            setPosts([data, ...posts]);


            // posts.push(data);
            // setPosts([...posts, data]);
            // if(data.request_accepted && data.action == 'create') {
            //   console.log('1 created');
            //   groupMembers.push(data);
            //   setGroupMembers([...groupMembers]);
            // } else if(data.request_accepted && data.action == 'update') {
            //   setUserGroupRequests([...userGroupRequests.filter((request) => request.id != data.id)]);
            //   console.log('update');
            //   groupMembers.push(data);
            //   setGroupMembers([...groupMembers]);
            // } else if(data.request_accepted && data.action == 'destroy') {
            //   console.log('1 destroy');
            //   setGroupMembers([...groupMembers.filter((request) => request.id != data.id)]);
            // } else if(!data.request_accepted && data.action == 'destroy') {
            //   console.log('2 destroy');
            //   setUserGroupRequests([...userGroupRequests.filter((request) => request.id != data.id)]);
            // } else if(!data.request_accepted && data.action == 'create') {
            //   userGroupRequests.push(data);
            //   console.log('2 create', userGroupRequests);
            //   setUserGroupRequests([...userGroupRequests])
            // }
          }
        },
        connected: () => {console.log('USER GROUP CONNECTED');},
        disconnected: (e) => console.log('USER GROUP DISCONNECTED', e),
      },
    );
    return () => CableApp.cable.disconnect()
  }, [CableApp.subscriptions, setPosts, posts]);


  const editPost = (event, post) => {
    console.log('----', post);
    const title = document.querySelector(`input#title-${post.id}`);
    const trixEditor = document.querySelector(`[input="${post.id}"]`);
    document.querySelector(`div#form-${post.id}`).classList.toggle('hidden')
    console.log('=====', trixEditor);
    title.value = post.title;
    trixEditor.value = post.content;
  }

  function form() {
    return <input
      id="title"
      name="title"
      type="text"
      autoComplete="Title"
      required
      className="relative block w-full appearance-none rounded-[4px] border border-gray-300 px-3 py-3 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-green-500 focus:outline-none focus:ring-green-500 sm:text-sm"
      placeholder="Title"
    />
  }

  const deletePost = (event, post) => {
    destroy({
      path: `group-posts/${post.id}`,
      headers: {headers: {'Authorization': `Bearer ${localStorage.getItem("token")}`}},
    }).then(response => {
      if(response.status == 200) {
        setPosts([...posts.filter(thisPost => thisPost.id != post.id)])
        setNotices(['Post deleted successfuly.']);
      } else
        setAlerts(['Post not deleted.']);
    });
  }

  return loading ? <LoadingSpinnerComponent/> : (
    posts.length > 0 ?
      <div className='w-full pb-10'>
        <h1 className="font-semibold text-3xl mr-4 capitalize text-gray-600 mt-4">All Posts</h1>
        {posts.map(post =>
          (<div key={post.id} ref={postRef} className="mt-6 border rounded-[4px] shadow-sm" id={post.id}>
            <div className='p-5 pb-2'>
              <h1 className="font-medium text-3xl inline-block mb-3 text-gray-600 w-4/5 font-serif">{post.title}</h1>
              <div className="mt-0 post text-sm text-gray-600">{Parser(post.content)}</div>
              <span className="mt-4 block text-xs text-gray-400 font-normal">
                <span>Last comment <TimeAgo date={post.last_activity} formatter={formatter} /></span> .
                {post.user.id == currentUser.id && <><span className="mr-1 ml-1 inline-block cursor-pointer" onClick={(event) => editPost(event, post)}>Edit</span> .</>}
                {post.user.id == currentUser.id && <><span className="mr-1 ml-1 inline-block cursor-pointer" onClick={(event) => deletePost(event, post)}>Delete</span> .</>}
                <span className="mr-1 ml-1 inline-block">Created by <span className='capitalize'>{post.user.username}</span></span>
              </span>
            </div>

            <Link to={`/post/${post.id}`} state={{post: post}} className='bg-gray-50 block w-full px-5 py-3 mt-3 text-gray-400 hover:text-gray-500 rounded-b-[4px] border-t'>
              <p className='truncate text-sm font-medium text-green-600'>View Post <span className='inline-block ml-2 text-xs'><FontAwesomeIcon icon={faArrowRight} /></span></p>
            </Link>
            <div className='pt-0 p-4 hidden' id={`form-${post.id}`}>
              <EditPostForm id={group.id} postId={post.id} title={post.title} content={post.content} buttonTitle="Edit Post" />
            </div>
          </div>)
        )}
      </div> :
    <div className="mt-6 border border-gray-100 rounded-[4px] p-6 text-center">
      <h1 className="font-light text-xl mr-4 text-gray-400 mt-4">No posts to show. Start posting now.</h1>
    </div>
  )
}
