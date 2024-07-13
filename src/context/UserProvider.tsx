"use client"
import React, { useEffect, useState, ReactNode } from 'react'

import { apiGet } from '@/helpers/axiosRequest'
import toast from 'react-hot-toast'
import UserContext from './userContext';

interface UserProviderProps {
  children: ReactNode;
}


const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState(undefined)

  const fetchUserDetails = async () => {
    try {
      const response = await apiGet('/api/user/userdetails')
      if (response.success) {
        const userInfo = response.data 
        setUser({...userInfo});
      }else{
        toast.error("Invalid user")
        setUser(undefined);
      }
      
    } catch (error) {
      console.log(error);
      toast.error("Error in loading current user")
      setUser(undefined);
    }
  }

  useEffect(() => {
    fetchUserDetails()
  }, [])

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  )
}

export default UserProvider
