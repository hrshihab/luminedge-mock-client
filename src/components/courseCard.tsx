"use client";

import Image from "next/image";
import { Course } from "@/app/types";
import { FaLongArrowAltRight } from "react-icons/fa";
import Link from "next/link";

const CourseCard = ({ course }: { course: Course }) => {
  // console.log(course);
  return (
    <div className="card bg-base-100 w-[280px] h-[300px] shadow-xl rounded-lg text-white hover:text-black">
      <figure>
        <Image src={course.image} alt={course.name} width={308} height={268} />
      </figure>
      <Link href={`/dashboard/booking/${course._id}`}>
        <div className="card-body bg-black text-gray-400 hover:text-black hover:bg-[#FACE39] rounded-b-lg">
          <p className="text-xs  ">
            Very different from conventional <br />
            agency, this one is easier, easier to learn and easy to remember
          </p>
          <div className="card-actions justify-start ">
            <div className="flex items-center gap-2 mt-3 ">
              Book Now <FaLongArrowAltRight />
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default CourseCard;
