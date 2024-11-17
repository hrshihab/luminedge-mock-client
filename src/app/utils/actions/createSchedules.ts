///api/v1/admin/create-schedule
export const createSchedules = async (formData: FormData) => {
  console.log(formData);
  const res = await fetch(  
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/create-schedule`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    }
  );
  const data = await res.json();
  return data;
  console.log(data);
};
