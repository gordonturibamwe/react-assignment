import React from 'react'

export default function Post() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className='grid grid-cols-4 gap-x-8 pt-6'>
        <div className='col-span-3 min-h-[350px]'>
          <div className="mt-6 border rounded-[4px] shadow-sm" id="dfdfdf">
            <div className='p-5'>
              <h1 className="font-medium text-3xl inline-block mb-3 text-gray-600 w-4/5 font-serif">For a More Creative Brain Follow These 5 Steps</h1>
              <div className="mt-0 post text-sm text-gray-600"> early all great ideas follow a similar creative process and this article explains how this process works. Understanding this is important because creative thinking is one of the most useful skills you can possess. Nearly every problem you face in work and in life can benefit from innovative solutions, lateral thinking, and creative ideas..</div>
            </div>
          </div>
        </div>

        <div className='col-span-1 min-h-[50px] mt-6'>
          <div className='p-3 bg-green-500 rounded-[4px]'>
            <p>Adam s replied to your comment</p>
            <p>View comment</p>
          </div>
        </div>
      </div>
    </div>
  )
}
