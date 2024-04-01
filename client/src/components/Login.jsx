
import React from 'react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import Axios from 'axios';
import { useNavigate } from 'react-router-dom';

import { login, setUserInfo } from '../redux/userSlice.js';
import { useDispatch } from 'react-redux';



const Login = () => {

    const navigate=useNavigate();
    const dispatch = useDispatch();

    const [user, setUser] = useState({
        email: '',
        password: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUser({
            email: e.target.email.value,
            password: e.target.password.value
        });
        setUser({email: '',password:''})
        console.log(user);

        await Axios.post('http://localhost:5000/users/login', user)
        .then(async (res) => {
            console.log(res);
            dispatch(login());
            dispatch(setUserInfo(res.data))
            navigate('/home');

        })
        .catch((err) => {
            console.log(err);
            
        });
    }

    const handleChange = (e) => {
        setUser({
            ...user,
            [e.target.name]: e.target.value
        });
    }


  return (
    <div className="bg-slate-100 h-[100vh] flex align-middle justify-center">
      <div className="w-[70vh] h-[70vh] mt-24 shadow-md bg-white">
            <form className="px-3 py-5 my-16 mx-20" onSubmit={handleSubmit}>
                <p className="mb-10 font-serif text-center text-2xl text-red-400">Login to connect with friends </p>
                <input type="email"  required className="bg-slate-100 p-2  mb-8 h-18 rounded-md w-80 focus:border-cyan-600 focus:border-2" placeholder="Email" name="email" onChange={handleChange} value={user.email} autoComplete='current-password'/>
                <input type="password" required  className="bg-slate-100 p-2 mb-5 h-18 rounded-md w-80 focus:border-cyan-600 focus:border-2" placeholder="Password"  name="password" onChange={handleChange} value={user.password} autoComplete='current-password'/>
                <button type='submit' className="bg-blue-500 px-3 py-2 rounded-lg text-white w-80 ">Login</button>
                <p className="mt-3 px-2">Not a user? <Link to="/signup" className="text-blue-500 underline">Signup</Link></p>
            </form>
      </div>
    </div>
  )
}

export default Login;
