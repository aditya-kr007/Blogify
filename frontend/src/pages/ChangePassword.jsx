import React, { useState } from 'react'
import AnimationWrapper from '../common/PageAnimation'
import useChangePassword from '../hooks/useChangePassword'
import toast from 'react-hot-toast'

const ChangePassword = () => {
    const [input, setInput] = useState({
        currentPassword: "",
        newPassword: ""
    })
    const {changePassword,loading}=useChangePassword()
    const handleSubmit = async (e) => {
        e.preventDefault()
        await changePassword(input)
        

    }
    return (
        <AnimationWrapper>
            <form onSubmit={handleSubmit}>
                <h1 className='max-md:hidden text-2xl'>Change Password</h1>
                <div className='w-full md:max-w-[400px]'>
                    <div className='relative w-[100%} mt-6 mb-6'>
                        <label className="input input-bordered flex items-center gap-2 rounded-full py-8 px-6">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-6 h-6 opacity-70"><path fillRule="evenodd" d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z" clipRule="evenodd" /></svg>
                            <input value={input.currentPassword} onChange={(e) => setInput({ ...input, currentPassword: e.target.value })} style={{ fontSize: "16px" }} type="password"  placeholder="Current Password" className="grow" />
                        </label>
                    </div>
                    <div className='relative w-[100%} mt-4 mb-6'>
                        <label className="input input-bordered flex items-center gap-2 rounded-full py-8 px-6">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-6 h-6 opacity-70"><path fillRule="evenodd" d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z" clipRule="evenodd" /></svg>
                            <input value={input.newPassword} onChange={(e) => setInput({ ...input, newPassword: e.target.value })} style={{ fontSize: "16px" }} type="password" placeholder="New Password" className="grow" />
                        </label>
                    </div>
                    <button className='btn-light center mt-8 px-12'>
                        Change Password
                    </button>
                </div>

            </form>

        </AnimationWrapper>
    )
}

export default ChangePassword
