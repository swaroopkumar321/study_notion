import React, { useEffect, useState } from "react"
import ReactStars from "react-rating-stars-component"
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react"

// Import Swiper styles
import "swiper/css"
import "swiper/css/free-mode"
import "swiper/css/pagination"
import "../../App.css"
// Icons
import { FaStar } from "react-icons/fa"
// Import required modules
import { Autoplay, FreeMode, Pagination } from "swiper"

// Get apiFunction and the endpoint
import { apiConnector } from "../../services/apiConnector"
import { ratingsEndpoints } from "../../services/apis"

function ReviewSlider() {
  const [reviews, setReviews] = useState([])
  const truncateWords = 15

  useEffect(() => {
    ;(async () => {
      const { data } = await apiConnector(
        "GET",
        ratingsEndpoints.REVIEWS_DETAILS_API
      )
      if (data?.success) {
        setReviews(data?.data)
      }
    })()
  }, [])

  // console.log(reviews)

  return (
    <div className="text-white w-full">
      <div className="my-[50px] max-w-maxContentTab lg:max-w-maxContent mx-auto">
        {reviews && reviews.length > 0 ? (
          <Swiper
            slidesPerView={1}
            spaceBetween={25}
            loop={true}
            freeMode={true}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            breakpoints={{
              640: {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              768: {
                slidesPerView: 3,
                spaceBetween: 25,
              },
              1024: {
                slidesPerView: 4,
                spaceBetween: 30,
              },
            }}
            modules={[FreeMode, Pagination, Autoplay]}
            className="w-full"
          >
            {reviews.map((review, i) => {
              // Only render if review has required data
              if (!review?.user || !review?.course || !review?.rating) {
                return null;
              }
              
              return (
              <SwiperSlide key={i}>
                <div className="flex flex-col gap-4 bg-richblack-800 p-6 text-sm text-richblack-25 rounded-xl shadow-lg border border-richblack-700 hover:bg-richblack-700 transition-all duration-300 h-[280px]">
                  <div className="flex items-center gap-4">
                    <img
                      src={
                        review?.user?.image
                          ? review?.user?.image
                          : `https://api.dicebear.com/5.x/initials/svg?seed=${review?.user?.firstName} ${review?.user?.lastName}`
                      }
                      alt={`${review?.user?.firstName} ${review?.user?.lastName}`}
                      className="h-12 w-12 rounded-full object-cover border-2 border-richblack-600"
                    />
                    <div className="flex flex-col min-w-0 flex-1">
                      <h1 className="font-semibold text-richblack-5 text-base truncate">{`${review?.user?.firstName} ${review?.user?.lastName}`}</h1>
                      <h2 className="text-xs font-medium text-richblack-400 truncate">
                        {review?.course?.courseName}
                      </h2>
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-richblack-25 leading-relaxed text-sm">
                      {review?.review && review.review.split(" ").length > truncateWords
                        ? `${review.review
                            .split(" ")
                            .slice(0, truncateWords)
                            .join(" ")}...`
                        : `${review?.review || "No review text provided"}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 mt-auto">
                    <h3 className="font-semibold text-yellow-100 text-base">
                      {review.rating.toFixed(1)}
                    </h3>
                    <ReactStars
                      count={5}
                      value={review.rating}
                      size={18}
                      edit={false}
                      activeColor="#ffd700"
                      emptyIcon={<FaStar />}
                      fullIcon={<FaStar />}
                    />
                  </div>
                </div>
              </SwiperSlide>
              )
            })}
          </Swiper>
        ) : (
          <div className="flex items-center justify-center h-[280px] bg-richblack-800 rounded-xl border border-richblack-700">
            <p className="text-richblack-300 text-lg">No reviews available at the moment.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ReviewSlider
