const RatingAndReview = require("../models/RatingandReview")
const Course = require("../models/Course")
const mongoose = require("mongoose")

// Create a new rating and review
exports.createRating = async (req, res) => {
  try {
    const userId = req.user.id
    const { rating, review, courseId, helpfulMessage } = req.body

    // Check if the user is enrolled in the course
    const course = await Course.findOne({
      _id: courseId,
      studentsEnrolled: { $elemMatch: { $eq: userId } },
    })

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Student is not enrolled in this course",
      })
    }

    // Check if the user has already reviewed this course
    const alreadyReviewed = await RatingAndReview.findOne({
      user: userId,
      course: courseId,
    })

    if (alreadyReviewed) {
      return res.status(403).json({
        success: false,
        message: "Course already reviewed by the user",
      })
    }

    // Create a new rating and review
    const ratingReview = await RatingAndReview.create({
      rating,
      review,
      course: courseId,
      user: userId,
      helpfulMessage: helpfulMessage || "",
    })

    // Update the course with this rating/review
    await Course.findByIdAndUpdate(courseId, {
      $push: {
        ratingAndReviews: ratingReview._id,
      },
    })

    return res.status(200).json({
      success: true,
      message: "Rating and review created successfully",
      data: ratingReview,
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    })
  }
}

// Update a rating and review
exports.updateRating = async (req, res) => {
  try {
    const userId = req.user.id
    const { rating, review, courseId, helpfulMessage } = req.body

    // Find the existing rating and review
    const existingRating = await RatingAndReview.findOne({
      user: userId,
      course: courseId,
    })

    if (!existingRating) {
      return res.status(404).json({
        success: false,
        message: "Rating and review not found",
      })
    }

    // Update the rating and review
    existingRating.rating = rating
    existingRating.review = review
    existingRating.helpfulMessage = helpfulMessage || existingRating.helpfulMessage
    existingRating.updatedAt = new Date()

    await existingRating.save()

    return res.status(200).json({
      success: true,
      message: "Rating and review updated successfully",
      data: existingRating,
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    })
  }
}

// Get user's review for a specific course
exports.getUserReview = async (req, res) => {
  try {
    const userId = req.user.id
    const { courseId } = req.body

    const userReview = await RatingAndReview.findOne({
      user: userId,
      course: courseId,
    }).populate({
      path: "course",
      select: "courseName",
    })

    if (!userReview) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      })
    }

    return res.status(200).json({
      success: true,
      data: userReview,
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    })
  }
}

// Delete a rating and review
exports.deleteRating = async (req, res) => {
  try {
    const userId = req.user.id
    const { courseId } = req.body

    // Find and delete the rating and review
    const deletedRating = await RatingAndReview.findOneAndDelete({
      user: userId,
      course: courseId,
    })

    if (!deletedRating) {
      return res.status(404).json({
        success: false,
        message: "Rating and review not found",
      })
    }

    // Remove the rating/review from the course
    await Course.findByIdAndUpdate(courseId, {
      $pull: {
        ratingAndReviews: deletedRating._id,
      },
    })

    return res.status(200).json({
      success: true,
      message: "Rating and review deleted successfully",
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    })
  }
}

// Get the average rating for a course
exports.getAverageRating = async (req, res) => {
  try {
    const courseId = req.body.courseId

    // Calculate the average rating using MongoDB aggregation
    const result = await RatingAndReview.aggregate([
      {
        $match: {
          course: new mongoose.Types.ObjectId(courseId),
        },
      },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
          reviewCount: { $sum: 1 },
        },
      },
    ])

    if (result.length > 0) {
      return res.status(200).json({
        success: true,
        averageRating: result[0].averageRating,
        reviewCount: result[0].reviewCount,
      })
    }

    // If no rating/review exists
    return res.status(200).json({
      success: true,
      message: "Average rating is 0, no rating given till now",
      averageRating: 0,
      reviewCount: 0,
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve the rating for the course",
      error: error.message,
    })
  }
}

// Get all rating and reviews
exports.getAllRatingReview = async (req, res) => {
  try {
    const allReviews = await RatingAndReview.find({})
      .sort({ rating: "desc" })
      .populate({
        path: "user",
        select: "firstName lastName email image",
      })
      .populate({
        path: "course",
        select: "courseName",
      })
      .exec()

    res.status(200).json({
      success: true,
      data: allReviews,
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    })
  }
}

// Get all reviews for a specific course
exports.getCourseReviews = async (req, res) => {
  try {
    const { courseId } = req.body

    const courseReviews = await RatingAndReview.find({
      course: courseId,
    })
      .sort({ createdAt: "desc" })
      .populate({
        path: "user",
        select: "firstName lastName email image",
      })
      .populate({
        path: "course",
        select: "courseName",
      })
      .exec()

    return res.status(200).json({
      success: true,
      data: courseReviews,
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve course reviews",
      error: error.message,
    })
  }
}
