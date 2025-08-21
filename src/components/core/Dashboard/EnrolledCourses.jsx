import { useEffect, useState } from "react"
import ProgressBar from "@ramonak/react-progress-bar"
import { BiDotsVerticalRounded } from "react-icons/bi"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import { getUserEnrolledCourses } from "../../../services/operations/profileAPI"

export default function EnrolledCourses() {
  const { token } = useSelector((state) => state.auth)
  const navigate = useNavigate()

  const [enrolledCourses, setEnrolledCourses] = useState(null)

  useEffect(() => {
    ;(async () => {
      try {
        const res = await getUserEnrolledCourses(token) // Getting all the published and the drafted courses

        // Filtering the published course out
        const filterPublishCourse = res.filter((ele) => ele.status !== "Draft")
        // console.log(
        //   "Viewing all the couse that is Published",
        //   filterPublishCourse
        // )

        setEnrolledCourses(filterPublishCourse)
      } catch (error) {
        console.log("Could not fetch enrolled courses.")
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <div className="text-3xl text-richblack-50">Enrolled Courses</div>
      {!enrolledCourses ? (
        <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
          <div className="spinner"></div>
        </div>
      ) : !enrolledCourses.length ? (
        <div className="grid h-[40vh] w-full place-content-center text-richblack-5">
          <div className="text-center">
            <div className="text-6xl mb-4">📖</div>
            <p className="text-xl mb-2">No enrolled courses yet</p>
            <p className="text-richblack-300">Browse our catalog to find courses you love!</p>
          </div>
        </div>
      ) : (
        <div className="my-8 text-richblack-5">
          {/* Headings */}
          <div className="flex rounded-t-lg bg-richblack-500 ">
            <p className="w-[45%] px-5 py-3">Course Name</p>
            <p className="w-1/4 px-2 py-3">Duration</p>
            <p className="w-[30%] px-2 py-3">Progress</p>
          </div>
          {/* Course Names */}
          {enrolledCourses.map((course, i, arr) => (
            <div
              className={`flex items-center border border-richblack-700 ${
                i === arr.length - 1 ? "rounded-b-lg" : "rounded-none"
              }`}
              key={i}
            >
              <div
                className="flex w-[45%] cursor-pointer items-center gap-4 px-5 py-3"
                onClick={() => {
                  navigate(
                    `/view-course/${course?._id}/section/${course.courseContent?.[0]?._id}/sub-section/${course.courseContent?.[0]?.subSection?.[0]?._id}`
                  )
                }}
              >
                <img
                  src={course.thumbnail}
                  alt="course_img"
                  className="h-14 w-14 rounded-lg object-cover flex-shrink-0"
                />
                <div className="flex max-w-xs flex-col gap-2 overflow-hidden">
                  <p className="font-semibold truncate">{course.courseName}</p>
                  <p className="text-xs text-richblack-300 line-clamp-2">
                    {course.courseDescription.length > 50
                      ? `${course.courseDescription.slice(0, 50)}...`
                      : course.courseDescription}
                  </p>
                </div>
              </div>
              <div className="w-1/4 px-2 py-3 truncate">{course?.totalDuration}</div>
              <div className="flex w-[30%] flex-col gap-2 px-2 py-3 overflow-hidden">
                <p className="text-sm">Progress: {course.progressPercentage || 0}%</p>
                <div className="w-full">
                  <ProgressBar
                    completed={course.progressPercentage || 0}
                    height="8px"
                    isLabelVisible={false}
                    containerStyles={{
                      width: '100%',
                      maxWidth: '100%',
                      overflow: 'hidden'
                    }}
                    fillerStyles={{
                      transition: 'width 0.2s ease-in-out'
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
