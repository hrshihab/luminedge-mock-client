
export const forgetPassword = async (email: string) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/forget-password`,
    {
    
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
      cache: "no-store",
    }
  );
  const data = await response.json();
  console.log("forgetPassword", data);
  return data;
};

