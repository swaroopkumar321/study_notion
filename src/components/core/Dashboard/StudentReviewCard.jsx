import React, { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import ReactStars from "react-rating-stars-component"
import { FiEdit2, FiTrash2 } from "react-icons/fi"
import { getUserReview, deleteRating } from "../../../services/operations/courseDetailsAPI"
import { formatDate } from "../../../services/formatDate"
import CourseReviewModal from "../ViewCourse/CourseReviewModal"

const StudentReviewCard = ({ course }) => {
  const { token } = useSelector((state) => state.auth)
  const [userReview, setUserReview] = useState(null)
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchUserReview = async () => {
      try {
        const reviewData = await getUserReview({ courseId: course._id }, token)
        setUserReview(reviewData)
      } catch (error) {
        console.error("Error fetching user review:", error)
      }
    }

    fetchUserReview()
  }, [course._id, token])

  const handleDeleteReview = async () => {
    if (window.confirm("Are you sure you want to delete your review?")) {
      setLoading(true)
      try {
        const success = await deleteRating({ courseId: course._id }, token)
        if (success) {
          setUserReview(null)
        }
      } catch (error) {
        console.error("Error deleting review:", error)
      }
      setLoading(false)
    }
  }

  const handleReviewModalClose = () => {
    setShowReviewModal(false)
    // Refresh the review after modal closes
    setTimeout(async () => {
      try {
        const reviewData = await getUserReview({ courseId: course._id }, token)
        setUserReview(reviewData)
      } catch (error) {
        console.error("Error fetching updated review:", error)
      }
    }, 1000)
  }

  return (
    <div className="rounded-md bg-richblack-800 p-4 mt-4">
      <h3 className="text-lg font-semibold text-richblack-5 mb-3">Your Review</h3>
      
      {userReview ? (
        <div className="space-y-3">
          {/* Rating Display */}
          <div className="flex items-center gap-2">
            <ReactStars
              count={5}
              value={userReview.rating}
              size={20}
              edit={false}
              activeColor="#ffd700"
            />
            <span className="text-sm text-richblack-300">
              {formatDate(userReview.createdAt)}
              {userReview.updatedAt !== userReview.createdAt && (
                <span className="ml-2">(Updated)</span>
              )}
            </span>
          </div>

          {/* Review Text */}
          <div>
            <h4 className="text-sm font-medium text-richblack-200 mb-1">Your Review:</h4>
            <p className="text-richblack-100">{userReview.review}</p>
          </div>

          {/* Helpful Message */}
          {userReview.helpfulMessage && (
            <div>
              <h4 className="text-sm font-medium text-richblack-200 mb-1">Message to Instructor:</h4>
              <p className="text-richblack-100 italic">{userReview.helpfulMessage}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <button
              onClick={() => setShowReviewModal(true)}
              className="flex items-center gap-1 px-3 py-1 rounded-md bg-yellow-50 text-richblack-900 text-sm hover:bg-yellow-25 transition-all duration-200"
              disabled={loading}
            >
              <FiEdit2 size={14} />
              Edit Review
            </button>
            <button
              onClick={handleDeleteReview}
              className="flex items-center gap-1 px-3 py-1 rounded-md bg-pink-200 text-richblack-900 text-sm hover:bg-pink-100 transition-all duration-200"
              disabled={loading}
            >
              <FiTrash2 size={14} />
              {loading ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center py-4">
          <p className="text-richblack-300 mb-3">You haven't reviewed this course yet.</p>
          <button
            onClick={() => setShowReviewModal(true)}
            className="px-4 py-2 rounded-md bg-yellow-50 text-richblack-900 font-semibold hover:bg-yellow-25 transition-all duration-200"
          >
            Write a Review
          </button>
        </div>
      )}

      {/* Review Modal */}
      {showReviewModal && (
        <CourseReviewModal 
          setReviewModal={handleReviewModalClose}
          courseData={course}
        />
      )}
    </div>
  )
}

export default StudentReviewCard
