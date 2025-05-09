'use client'

import { LoginForm } from "@/components/login-form"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { AuthTokenStore } from "@/service/AuthTokenStore";
import { UserService } from "@/service/UserService";
import { toast } from "sonner";
import { RequestError } from "@/service/request/base/RequestError";
export default function Page() {
  const router = useRouter();
  const authTokenStore = new AuthTokenStore();
  const userService = new UserService();
  const [username, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const onLoginClicked = async (e:any)=>{
    e.preventDefault();
    userService.createUserRegistration(username, password).then((response)=>{
      toast.success('Successful login')
      authTokenStore.set(response.token);
      router.push('dashboard');
    }).catch((e:RequestError)=>{
      if(e.status === 401){
        toast.error('Please check your username and password');
      }
      toast.error('Something went wrong');
    })
  }
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm  onSubmit={onLoginClicked} setUserId={setUserId} setPassword={setPassword}/>
      </div>
    </div>
  )
}