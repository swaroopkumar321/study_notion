import React from "react"

import Footer from "../components/Common/Footer"
import ReviewSlider from "../components/Common/ReviewSlider"
import ContactDetails from "../components/core/ContactUsPage/ContactDetails"
import ContactForm from "../components/core/ContactUsPage/ContactForm"

const Contact = () => {
  return (
    <div>
      <div className="mx-auto mt-20 flex w-11/12 max-w-maxContent flex-col justify-between gap-10 text-white lg:flex-row">
        {/* Contact Details */}
        <div className="lg:w-[40%]">
          <ContactDetails />
        </div>

        {/* Contact Form */}
        <div className="lg:w-[60%]">
          <ContactForm />
        </div>
      </div>
      <div className="relative mx-auto my-20 flex w-11/12 max-w-maxContent flex-col items-center justify-between gap-12 bg-richblack-900 text-white">
        {/* Reviews from Other Learners */}
        <div className="text-center">
          <h1 className="text-4xl font-semibold mt-8 mb-4 bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#FCB045] bg-clip-text text-transparent">
            Reviews from other learners
          </h1>
          <p className="text-richblack-300 text-lg max-w-2xl mx-auto">
            See what our students have to say about their learning experience with StudyNotion
          </p>
        </div>
        <ReviewSlider />
      </div>
      <Footer />
    </div>
  )
}

export default Contact
