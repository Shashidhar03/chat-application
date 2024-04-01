import React from 'react'
import { Link } from 'react-router-dom'

import chatImage from "../assets/chat.jpg"

function Welcome() {
  return (
    <div className='w-screen h-[100vh] flex'>
      <div className='w-[65%] h-[100vh]' style={{ backgroundImage: `url(${chatImage})`, backgroundSize: 'cover',opacity:'0.8' }}>
      <h1 className='text-7xl font-serif text-center mt-60 ml-20 text-white'>Welcome to Chat App</h1>
      </div>

      <div className='w-[35%] h-[100vh]'>
        <div className='flex flex-col justify-center items-center h-full shadow-lg bg-purple-200'>
          <h1 className='text-4xl font-serif text-center mb-10'>Join Chat App</h1>
          <Link to='/login' className='bg-blue-500 text-white px-4 py-2 rounded-md text-center mb-5 hover:bg-blue-600 '>Login</Link>
          <Link to='/signup' className='bg-blue-500 text-white px-4 py-2 rounded-md text-center hover:bg-blue-600'>Signup</Link>
        </div>
      </div>
    </div>
    )
}

export default Welcome
