import { Divider } from '@mui/material'
import React from 'react'
import ProfileFieldCard from '../../../component/ProfileFieldCard'
import store, { useAppSelector } from '../../../State/Store'

const UserDetails = () => {
  const { auth } = useAppSelector(store=>store)
  return (
    <div className='flex justify-center py-10'>
        <div className='w-full lg:w-[80%]'>
            <div className='flex items-center pb-3 justify-between'>
                <h1 className='text-2xl font-bold text-gray-600'>Personal Details</h1>

            </div>
            <div className=''>
                <ProfileFieldCard keys="Name" value={auth.user?.fullName || ""}/>
                <Divider/>
                <ProfileFieldCard keys="Email " value={auth.user?.email || ""}/>
                <Divider/>
                <ProfileFieldCard keys="Mobile" value={auth.user?.mobile || ""}/>
            </div>
        </div>
    </div>
  )
}

export default UserDetails