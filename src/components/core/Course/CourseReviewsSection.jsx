import React, { useEffect, useState } from "react"
import ReactStars from "react-rating-stars-component"
import { getCourseReviews } from "../../../services/operations/courseDetailsAPI"
import { formatDate } from "../../../services/formatDate"

const CourseReviewsSection = ({ courseId }) => {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(false)
  const [showAll, setShowAll] = useState(false)

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true)
      try {
        const reviewsData = await getCourseReviews({ courseId })
        setReviews(reviewsData)
      } catch (error) {
        console.error("Error fetching reviews:", error)
      }
      setLoading(false)
    }

    if (courseId) {
      fetchReviews()
    }
  }, [courseId])

  const displayedReviews = showAll ? reviews : reviews.slice(0, 3)

  if (loading) {
    return (
      <div className="mb-12 py-4">
        <p className="text-[28px] font-semibold">Student Reviews</p>
        <div className="grid min-h-[200px] place-items-center">
          <div className="spinner"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="mb-12 py-4">
      <p className="text-[28px] font-semibold">Student Reviews</p>
      
      {reviews.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-6xl mb-4">📝</div>
          <p className="text-xl text-richblack-5">No reviews yet</p>
          <p className="text-richblack-300">Be the first to review this course!</p>
        </div>
      ) : (
        <div className="space-y-6 mt-6">
          {displayedReviews.map((review) => (
            <div key={review._id} className="rounded-md bg-richblack-800 p-6">
              <div className="flex items-start gap-4">
                <img
                  src={
                    review?.user?.image
                      ? review.user.image
                      : `https://api.dicebear.com/5.x/initials/svg?seed=${review?.user?.firstName} ${review?.user?.lastName}`
                  }
                  alt={`${review?.user?.firstName} ${review?.user?.lastName}`}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1 space-y-2">
                  {/* User Info and Rating */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-richblack-5">
                        {review?.user?.firstName} {review?.user?.lastName}
                      </h3>
                      <p className="text-sm text-richblack-300">
                        {formatDate(review?.createdAt)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-yellow-50 font-semibold">
                        {review?.rating?.toFixed(1)}
                      </span>
                      <ReactStars
                        count={5}
                        value={review?.rating}
                        size={20}
                        edit={false}
                        activeColor="#ffd700"
                      />
                    </div>
                  </div>

                  {/* Review Text */}
                  <div>
                    <p className="text-richblack-100">{review?.review}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {/* Show More/Less Button */}
          {reviews.length > 3 && (
            <div className="text-center">
              <button
                onClick={() => setShowAll(!showAll)}
                className="text-yellow-50 font-semibold hover:text-yellow-25 transition-colors"
              >
                {showAll ? "Show Less Reviews" : `Show All ${reviews.length} Reviews`}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default CourseReviewsSection
