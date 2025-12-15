'use client'

import Link from "next/link";
import { useState } from "react";
import axios from "axios";

const Signup = ()=>{

   const [formData, setFormData] = useState({
        email:"",
        password:"",
        confirm_password:""
   })
   const [error, setError]= useState("");



  const handleSubmit= async()=>{
       if(!formData.email || !formData.password|| !formData.confirm_password){
        setError("ALL Fields are mandetory")
        return;
       }
       if(formData.password !== formData.confirm_password){
        setError("Password and confirm password must be same")
        return;
       }
       try{
            const res= await axios.post('/api/signup', formData);
            if(res.status===201){
                setError("User Registered successfully!")
            }
       }catch (error){
            if(axios.isAxiosError(error)){
                setError(error.response?.data?.message || "something went wrong")
            }
       }


       setError("");
  }


    return(
            <div className="flex items-center justify-center h-screen">
                <div className="bg-white w-1/3 flex justify-center items-center flex-col py-10 rounded-2xl shadow-md">
                    <div className="py-5 text-left">
                        <p className="text-black-300 text-sm">Signin Here</p>
                        <h1 className="text-4xl">Signup</h1>
                    </div>
                    <span>
                        {error &&<p className="text-red-600">{error}</p>}
                    </span>
                    <div className="w-full px-5 flex gap-4 flex-col py-2">
                        <div>
                            <input 
                            onChange={ (e) => setFormData ({...formData, email: e.target.value})}
                            value={formData.email}
                            className="w-full focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-100 py-2 px-2 rounded-md" type="email" name="email" placeholder="email"/>
                        </div>
                        <div>
                            <input 
                            onChange={ (e) => setFormData ({...formData, password: e.target.value})}
                            value={formData.password}
                            className="w-full focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-100 py-2 px-2 rounded-md" type="password" name="password" placeholder="password"/>
                        </div>
                        <div>
                            <input 
                            onChange={ (e) => setFormData ({...formData, confirm_password: e.target.value})}
                            value={formData.confirm_password}
                            className="w-full focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-100 py-2 px-2 rounded-md" type="confirm password" name="confirm password" placeholder="confirm password"/>
                        </div>
                        <div className="w-full">
                            <button 
                            onClick={ handleSubmit }className="bg-blue-600 text-white w-full py-2 px-2 rounded-md cursor-pointer">Signup</button>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Already have an account? <Link href={"/login"} className="text-blue-600 cursor-pointer">Login</Link></p>
                        </div>
                    </div>
                </div>
            </div>
    )
}
export default Signup;