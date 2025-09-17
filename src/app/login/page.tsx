"use client"
import { GalleryVerticalEnd } from "lucide-react"

import { LoginForm } from "@/components/login-form"
import { useRouter } from "next/navigation";
import { AuthTokenStore } from "@/service/AuthTokenStore";
import { UserService } from "@/service/UserService";
import { useState } from "react";
import { toast } from "sonner";
import { RequestError } from "@/service/request/base/RequestError";
import { CreateUserResponse } from "@/service/request/api/CreateUserRequest";

export default function LoginPage() {
    const router = useRouter();
  const authTokenStore = new AuthTokenStore();
  const userService = new UserService();
  const [username, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const onLoginClicked = async (e:any)=>{
    e.preventDefault();
    userService.createUserRegistration(username, password).then((response: CreateUserResponse)=>{
      toast.success('Successful login')
      authTokenStore.set(response.token);
      router.push('dashboard');
    }).catch((e:RequestError)=>{
      if(e.status === 401){
        toast.error('Please check your username and password');
        return;
      }
      toast.error(
        "Error!",{
        description: "Something went wrong.",
        className: "!bg-[var(--color-destructive)]",
      });
    })
  }
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <GalleryVerticalEnd className="size-4" />
            </div>
            Logo
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
          <LoginForm onSubmit={onLoginClicked} setUserId={setUserId} setPassword={setPassword}/>
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <img
          src="/login.png"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.6]"
        />
      </div>
    </div>
  )
}
