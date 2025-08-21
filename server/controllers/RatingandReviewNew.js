const RatingAndReview = require("../models/RatingandReview")
const Course = require("../models/Course")
const User = require("../models/User")
const mongoose = require("mongoose")

// Create a new rating and review - FRESH VERSION
exports.createRating = async (req, res) => {
  console.log('✨ NEW CONTROLLER: createRating called')
  try {
    const userId = req.user.id
    const { rating, review, courseId } = req.body

    console.log(`📥 Request data: userId=${userId}, courseId=${courseId}, rating=${rating}`)

    // Validate input
    if (!courseId || !mongoose.Types.ObjectId.isValid(courseId)) {
      console.log(`❌ Invalid courseId: ${courseId}`)
      return res.status(400).json({ success: false, message: "Invalid courseId" })
    }
    const numericRating = Number(rating)
    if (Number.isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
      console.log(`❌ Invalid rating: ${rating}`)
      return res.status(400).json({ success: false, message: "Rating must be a number between 1 and 5" })
    }
    if (!review || typeof review !== "string" || review.trim().length === 0) {
      console.log(`❌ Invalid review: ${review}`)
      return res.status(400).json({ success: false, message: "Review text is required" })
    }

    // Enrollment check
    console.log(`🔍 Checking enrollment for user ${userId} in course ${courseId}`)
    const courseDoc = await Course.findById(courseId).select("_id studentsEnroled").lean()
    console.log(`📚 Course found:`, !!courseDoc)
    
    let isEnrolled = false
    if (courseDoc && Array.isArray(courseDoc.studentsEnroled)) {
      console.log(`👥 Students enrolled:`, courseDoc.studentsEnroled.map(id => id.toString()))
      isEnrolled = courseDoc.studentsEnroled.some((id) => id && id.toString() === String(userId))
      console.log(`✅ User enrolled in course:`, isEnrolled)
    }
    
    if (!isEnrolled) {
      const userDoc = await User.findById(userId).select("_id courses").lean()
      console.log(`👤 User found:`, !!userDoc)
      if (userDoc && Array.isArray(userDoc.courses)) {
        console.log(`📖 User courses:`, userDoc.courses.map(id => id.toString()))
        isEnrolled = userDoc.courses.some((id) => id && id.toString() === String(courseId))
        console.log(`✅ Course enrolled in user:`, isEnrolled)
      }
    }
    
    if (!isEnrolled) {
      console.log(`❌ Enrollment check failed - returning 404`)
      return res.status(404).json({ success: false, message: "Student is not enrolled in this course" })
    }

    console.log(`✅ Enrollment check passed`)

    // Check for existing review
    const alreadyReviewed = await RatingAndReview.findOne({ user: userId, course: courseId })
    if (alreadyReviewed) {
      console.log(`🔄 Review already exists: ${alreadyReviewed._id} - Updating existing review`)
      
      // Update the existing review
      const updatedReview = await RatingAndReview.findByIdAndUpdate(
        alreadyReviewed._id,
        {
          rating: numericRating,
          review: review.trim(),
          updatedAt: new Date()
        },
        { new: true }
      )

      console.log(`✅ Review updated successfully: ${updatedReview._id}`)

      return res.status(200).json({
        success: true,
        message: "Rating and review updated successfully",
        data: updatedReview,
        updated: true
      })
    }

    // Create the rating and review
    console.log(`📝 Creating new review...`)
    const ratingReview = await RatingAndReview.create({
      user: userId,
      rating: numericRating,
      review: review.trim(),
      course: courseId,
    })

    // Update course with the new rating and review
    await Course.findByIdAndUpdate(courseId, {
      $push: { ratingAndReviews: ratingReview._id },
    })

    console.log(`✅ Review created successfully: ${ratingReview._id}`)

    return res.status(200).json({
      success: true,
      message: "Rating and review created successfully",
      data: ratingReview,
    })
  } catch (error) {
    console.error(`❌ Error in createRating:`, error.message)
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    })
  }
}

// Export other functions as placeholders
exports.updateRating = async (req, res) => {
  try {
    const userId = req.user.id
    const { rating, review, courseId } = req.body

    console.log(`🔄 Update rating called for user ${userId} in course ${courseId}`)

    // Validate input
    if (!courseId || !mongoose.Types.ObjectId.isValid(courseId)) {
      console.log(`❌ Invalid courseId: ${courseId}`)
      return res.status(400).json({ success: false, message: "Invalid courseId" })
    }
    const numericRating = Number(rating)
    if (Number.isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
      console.log(`❌ Invalid rating: ${rating}`)
      return res.status(400).json({ success: false, message: "Rating must be a number between 1 and 5" })
    }
    if (!review || typeof review !== "string" || review.trim().length === 0) {
      console.log(`❌ Invalid review: ${review}`)
      return res.status(400).json({ success: false, message: "Review text is required" })
    }

    // Find existing review
    const existingReview = await RatingAndReview.findOne({ user: userId, course: courseId })
    if (!existingReview) {
      console.log(`❌ No existing review found`)
      return res.status(404).json({
        success: false,
        message: "No review found to update. Please create a review first.",
      })
    }

    // Update the review
    const updatedReview = await RatingAndReview.findByIdAndUpdate(
      existingReview._id,
      {
        rating: numericRating,
        review: review.trim(),
        updatedAt: new Date()
      },
      { new: true }
    )

    console.log(`✅ Review updated successfully: ${updatedReview._id}`)

    return res.status(200).json({
      success: true,
      message: "Rating and review updated successfully",
      data: updatedReview,
    })
  } catch (error) {
    console.error(`❌ Error in updateRating:`, error.message)
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    })
  }
}

exports.getUserReview = async (req, res) => {
  try {
    const userId = req.user.id
    const { courseId } = req.body

    console.log(`🔍 Getting user review for user ${userId} in course ${courseId}`)

    // Validate courseId
    if (!courseId || !mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ success: false, message: "Invalid courseId" })
    }

    // Get user's review for the course
    const userReview = await RatingAndReview.findOne({ user: userId, course: courseId })
      .populate({
        path: "course",
        select: "courseName",
      })

    if (!userReview) {
      console.log(`❌ No review found for user`)
      return res.status(404).json({
        success: false,
        message: "No review found for this course",
      })
    }

    console.log(`✅ Found user review: ${userReview._id}`)

    return res.status(200).json({
      success: true,
      message: "User review fetched successfully",
      data: userReview,
    })
  } catch (error) {
    console.error(`❌ Error in getUserReview:`, error.message)
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    })
  }
}

exports.deleteRating = async (req, res) => {
  res.status(501).json({ success: false, message: "Not implemented yet" })
}

exports.getAverageRating = async (req, res) => {
  res.status(501).json({ success: false, message: "Not implemented yet" })
}

exports.getAllRatingReview = async (req, res) => {
  try {
    console.log(`🔍 Getting all reviews`)

    const reviews = await RatingAndReview.find({})
      .populate({
        path: "user",
        select: "firstName lastName image",
      })
      .populate({
        path: "course",
        select: "courseName",
      })
      .sort({ createdAt: -1 })

    console.log(`✅ Found ${reviews.length} total reviews`)

    return res.status(200).json({
      success: true,
      message: "All reviews fetched successfully",
      data: reviews,
    })
  } catch (error) {
    console.error(`❌ Error in getAllRatingReview:`, error.message)
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    })
  }
}

exports.getCourseReviews = async (req, res) => {
  try {
    const { courseId } = req.body

    console.log(`🔍 Getting reviews for course: ${courseId}`)

    // Validate courseId
    if (!courseId || !mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ success: false, message: "Invalid courseId" })
    }

    // Get all reviews for the course
    const reviews = await RatingAndReview.find({ course: courseId })
      .populate({
        path: "user",
        select: "firstName lastName image",
      })
      .populate({
        path: "course",
        select: "courseName",
      })
      .sort({ createdAt: -1 })

    console.log(`✅ Found ${reviews.length} reviews for course`)

    return res.status(200).json({
      success: true,
      message: "Course reviews fetched successfully",
      data: reviews,
    })
  } catch (error) {
    console.error(`❌ Error in getCourseReviews:`, error.message)
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    })
  }
}
