"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const HomePage = () => {
  const router = useRouter();

  useEffect(() => {
    router.push("/login"); // Automatically redirects to the sign-in page
  }, [router]);

  return (
    <div>
      <h1 className="text-4xl text-center mt-10">Welcome To Home Page</h1>
    </div>
  );
};

export default HomePage;
