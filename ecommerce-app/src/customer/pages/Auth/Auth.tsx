import { Button } from '@mui/material';
import React,{useState} from 'react'
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

const Auth = () => {
  const [isLogin, setIsLogin]=useState(true);
  return (
    <div className='flex justify-center h-[90vh] items-center'>
      <div className='max-w-md h-[85vh] rounded-md  shodow-lg'>
        <img className='w-full rounded-t-md'
        src="https://giitsss.com/images/login_banner.jpg" 
        alt="" />

        <div className='mt-4 px-10'>
          {isLogin ? <LoginForm/> : <RegisterForm/>}

        <div className='flex items-center gap-1 justify-center mt-5'>
        <p>{isLogin && "Don't"} have Account</p>  
        <Button size='small' onClick={()=>setIsLogin(!isLogin)}>{isLogin ? "Create Account" : "login"}</Button>
        </div> 
          </div>       

      </div>
    </div>
  )
}

export default Auth