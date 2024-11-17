'use server'

import { formatData } from "@/app/register/page"

export const registerUser = async (formData:formatData) => {
    console.log(process.env.NEXT_PUBLIC_BACKEND_URL)
   const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/register`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(formData),
    cache: 'no-store',
   })
   const data = await res.json()
   return data
}
