import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBell } from '@fortawesome/free-solid-svg-icons'
import PostForm from '../components/PostForm'

export default function Post() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className='grid grid-cols-8 gap-x-8 pt-6'>
        <div className='col-span-6 min-h-[350px]'>
          <div className='p-'>
            <h1 className="font-medium text-3xl inline-block mb-6 text-gray-600 w-4/5 font-serif">For a More Creative Brain Follow These 5 Steps</h1>
            <div className="mt-0 post text-gray-600 mb-4 leading-relaxed"> Early all great ideas follow a similar creative process and this article explains how this process works. Understanding this is important because creative thinking is one of the most useful skills you can possess. Nearly every problem you face in work and in life can benefit from innovative solutions, lateral thinking, and creative ideas.</div>
            <div className="mt-0 post text-gray-600 mb-4 leading-relaxed"> Journaling is simply the act of thinking about your life and writing it down. That’s it. Nothing more is needed. But despite its simplicity, the daily journal has played a key role in the careers of many prolific people.</div>
            <div className="mt-0 post text-gray-600 mb-4 leading-relaxed"> As you might expect, journaling is a favorite habit of many writers. From Mark Twain to Virginia Woolf, Francis Bacon to Joan Didion, John Cheever to Vladimir Nabokov. A journal was rarely far from any of these artists. Susan Sontag once claimed that her journal was where she “created herself.”</div>
            <img className='mb-4 rounded' src="https://images.unsplash.com/photo-1657664065728-4ee40c444171?ixlib=rb-1.2.1&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1374&q=80" alt=""/>
            <div className="mt-0 post text-gray-600 mb-4 leading-relaxed"> Early all great ideas follow a similar creative process and this article explains how this process works. Understanding this is important because creative thinking is one of the most useful skills you can possess. Nearly every problem you face in work and in life can benefit from innovative solutions, lateral thinking, and creative ideas.</div>
            <div className="mt-0 post text-gray-600 mb-4 leading-relaxed"> Journaling is simply the act of thinking about your life and writing it down. That’s it. Nothing more is needed. But despite its simplicity, the daily journal has played a key role in the careers of many prolific people.</div>
            <div className="mt-0 post text-gray-600 mb-4 leading-relaxed"> As you might expect, journaling is a favorite habit of many writers. From Mark Twain to Virginia Woolf, Francis Bacon to Joan Didion, John Cheever to Vladimir Nabokov. A journal was rarely far from any of these artists. Susan Sontag once claimed that her journal was where she “created herself.”</div>
          </div>

          <div className='w-full pb-10'>
            <h1 className="font-semibold text-3xl mr-4 capitalize text-gray-600 mt-8">Comments</h1>
            <div className="mt-6 space-y-2" id="dfdfdf">
              <div className='p-6 bg-gray-50 rounded border'>
                <div className="mt-0 post text-sm text-gray-500"> Commentarly all great ideas follow a similar creative process and this article explains how this process works. Understanding this is important because creative thinking is one of the most useful skills you can possess.</div>
                <span className="mt-3 block text-xs text-gray-400 font-normal" id="_<%= post.id %>">
                  <span>Adam S commented 3 days ago</span> .
                  <span className="mr-1 ml-1 inline-block font-semibold"><a href='/'>Reply</a></span>
                </span>

                <div className="space-y-4 mt-4 divide-y" id="dfdfdf">
                  <div className='ml-6 pt-3 bg-gray-50'>
                    <div className="mt-0 post text-sm text-gray-500"> Creative process and this article explains how this process works. Understanding this is important because creative thinking is one of the most useful skills you can possess.</div>
                    <span className="mt-3 block text-xs text-gray-400 font-normal" id="_<%= post.id %>">
                      <span>You replied 3 days ago</span> .
                      <span className="mr-1 ml-1 inline-block font-semibold"><a href='/'>Edit</a></span> .
                      <span className="mr-1 ml-1 inline-block font-semibold"><a href='/'>Delete</a></span> .
                      <span className="mr-1 ml-1 inline-block font-semibold"><a href='/'>Reply</a></span>
                    </span>
                  </div>
                  <div className='ml-6 pt-3 bg-gray-50'>
                    <div className="mt-0 post text-sm text-gray-500"> Creative process and this article explains how this process works. Understanding this is important because creative thinking is one of the most useful skills you can possess.</div>
                    <span className="mt-3 block text-xs text-gray-400 font-normal" id="_<%= post.id %>">
                      <span>Calvin C. commented 3 days ago</span> .
                      <span className="mr-1 ml-1 inline-block font-semibold"><a href='/'>Reply</a></span>
                    </span>
                  </div>
                </div>
              </div>
              <div className='p-6 bg-gray-50 rounded border'>
                <div className="mt-0 post text-sm text-gray-500"> Creative process and this article explains how this process works. Understanding this is important because creative thinking is one of the most useful skills you can possess.</div>
                <span className="mt-3 block text-xs text-gray-400 font-normal" id="_<%= post.id %>">
                  <span>Adam S commented 3 days ago</span> .
                  <span className="mr-1 ml-1 inline-block font-semibold"><a href='/'>Edit</a></span> .
                  <span className="mr-1 ml-1 inline-block font-semibold"><a href='/'>Delete</a></span> .
                  <span className="mr-1 ml-1 inline-block font-semibold"><a href='/'>Reply</a></span>
                </span>
              </div>

            </div>

            <PostForm buttonTitle="Comment"/>
          </div>
        </div>

        <div className='col-span-2 min-h-[50px] mt-6'>
          <a href='/' className='p-4 bg-green-500 rounded-[4px] mb-3 -ml-6 shadow block relative'>
            <span className='text-white font-normal text-sm mr-1'>
              <FontAwesomeIcon icon={faBell} className="pr-1 text-md text-white opacity-60"/> Adam s replied to your comment.
            </span>
            <span className='text-green-900 text-xs font-medium'>View comment</span>
          </a>
          <div className='p-6 pl-10 bg-green-500 rounded-[4px] mb-3 -ml-6 shadow relative'>
            <FontAwesomeIcon icon={faBell} className="pr-1 text-md text-white absolute left-3 top-3 opacity-60"/>
            <p className='text-white font-medium text-sm'> Adam s replied to your comment.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
