import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import ReactStars from "react-rating-stars-component"
import { getCourseReviews } from "../../../services/operations/courseDetailsAPI"
import { formatDate } from "../../../services/formatDate"

const CourseReviews = () => {
  const { courseId } = useParams()
  const { token } = useSelector((state) => state.auth)
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState({
    averageRating: 0,
    totalReviews: 0,
    ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  })

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true)
      try {
        const reviewsData = await getCourseReviews({ courseId })
        setReviews(reviewsData)
        
        // Calculate statistics
        if (reviewsData.length > 0) {
          const totalRating = reviewsData.reduce((sum, review) => sum + review.rating, 0)
          const avgRating = totalRating / reviewsData.length
          
          const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
          reviewsData.forEach(review => {
            distribution[review.rating]++
          })
          
          setStats({
            averageRating: avgRating,
            totalReviews: reviewsData.length,
            ratingDistribution: distribution
          })
        }
      } catch (error) {
        console.error("Error fetching reviews:", error)
      }
      setLoading(false)
    }

    if (courseId) {
      fetchReviews()
    }
  }, [courseId])

  if (loading) {
    return (
      <div className="grid min-h-[200px] place-items-center">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Reviews Statistics */}
      <div className="rounded-md bg-richblack-800 p-6">
        <h2 className="text-xl font-semibold text-richblack-5 mb-4">Review Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Overall Rating */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold text-yellow-50">
                {stats.averageRating.toFixed(1)}
              </span>
              <ReactStars
                count={5}
                value={stats.averageRating}
                size={24}
                edit={false}
                activeColor="#ffd700"
              />
            </div>
            <p className="text-richblack-300">
              Based on {stats.totalReviews} review{stats.totalReviews !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Rating Distribution */}
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-richblack-5">Rating Distribution</h3>
            {[5, 4, 3, 2, 1].map((rating) => (
              <div key={rating} className="flex items-center gap-2">
                <span className="text-sm text-richblack-300 w-8">{rating}★</span>
                <div className="flex-1 bg-richblack-600 rounded-full h-2">
                  <div
                    className="bg-yellow-50 h-2 rounded-full"
                    style={{
                      width: stats.totalReviews > 0 
                        ? `${(stats.ratingDistribution[rating] / stats.totalReviews) * 100}%`
                        : '0%'
                    }}
                  ></div>
                </div>
                <span className="text-sm text-richblack-300 w-8">
                  {stats.ratingDistribution[rating]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Individual Reviews */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-richblack-5">Student Reviews</h2>
        
        {reviews.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">📝</div>
            <p className="text-xl text-richblack-5">No reviews yet</p>
            <p className="text-richblack-300">Be patient! Reviews will appear as students complete your course.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review._id} className="rounded-md bg-richblack-800 p-6">
                <div className="flex items-start gap-4">
                  <img
                    src={review.user.image}
                    alt={`${review.user.firstName} ${review.user.lastName}`}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="flex-1 space-y-2">
                    {/* User Info and Rating */}
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-richblack-5">
                          {review.user.firstName} {review.user.lastName}
                        </h3>
                        <p className="text-sm text-richblack-300">
                          {formatDate(review.createdAt)}
                          {review.updatedAt !== review.createdAt && (
                            <span className="ml-2 text-xs text-richblack-400">(Updated)</span>
                          )}
                        </p>
                      </div>
                      <ReactStars
                        count={5}
                        value={review.rating}
                        size={20}
                        edit={false}
                        activeColor="#ffd700"
                      />
                    </div>

                    {/* Review Text */}
                    <div className="space-y-3">
                      <div>
                        <h4 className="text-sm font-medium text-richblack-200 mb-1">Review:</h4>
                        <p className="text-richblack-100">{review.review}</p>
                      </div>
                      
                      {/* Helpful Message */}
                      {review.helpfulMessage && (
                        <div className="bg-richblack-700 rounded-md p-3">
                          <h4 className="text-sm font-medium text-caribbeangreen-100 mb-1">
                            💡 Message to Instructor:
                          </h4>
                          <p className="text-richblack-100 italic">{review.helpfulMessage}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default CourseReviews
