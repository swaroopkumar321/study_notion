import { toast } from "react-hot-toast"

import { resetCart } from "../../slices/cartSlice"
import { apiConnector } from "../apiConnector"
import { studentEndpoints } from "../apis"

const {
  COURSE_PAYMENT_API,
  COURSE_VERIFY_API,
  SEND_PAYMENT_SUCCESS_EMAIL_API,
} = studentEndpoints

// Stripe is mocked in development; no client-side Stripe usage here.

// Buy the Course
export async function BuyCourse(
  token,
  courses,
  user_details,
  navigate,
  dispatch
) {
  const toastId = toast.loading("Processing Payment...")
  
  try {
    // Create payment intent in backend
    const orderResponse = await apiConnector(
      "POST",
      COURSE_PAYMENT_API,
      {
        courses,
      },
      {
        Authorization: `Bearer ${token}`,
      }
    )

    if (!orderResponse.data.success) {
      throw new Error(orderResponse.data.message)
    }
    
    console.log("PAYMENT RESPONSE FROM BACKEND............", orderResponse.data)

  const { payment_intent_id, coursesToEnroll, amount } = orderResponse.data.data

    // Test payment simulation with better UX
  const displayAmount = (amount || orderResponse.data.data.amount) / 100
    
    toast.dismiss(toastId)
    
    const confirmPayment = window.confirm(
      `🔒 TEST PAYMENT SIMULATION 🔒\n\n` +
  `Amount: ₹${displayAmount}\n` +
      `Currency: INR\n` +
      `Payment Intent ID: ${payment_intent_id}\n\n` +
      `Click OK to simulate successful payment.\n` +
      `In production, this would redirect to Stripe checkout.`
    )

  if (confirmPayment) {
      // Verify payment immediately
  await verifyPayment({ payment_intent_id, courses: coursesToEnroll || courses }, token, navigate, dispatch)
    } else {
      toast.error("Payment cancelled by user.")
    }

  } catch (error) {
    console.log("PAYMENT API ERROR............", error)
    toast.error("Could Not make Payment.")
    toast.dismiss(toastId)
  }
}

// Verify the Payment
async function verifyPayment(bodyData, token, navigate, dispatch) {
  try {
    console.log("Sending verification request with:", bodyData)
    
    const response = await apiConnector("POST", COURSE_VERIFY_API, bodyData, {
      Authorization: `Bearer ${token}`,
    })

    console.log("VERIFY PAYMENT RESPONSE FROM BACKEND............", response)

    if (!response.data.success) {
      throw new Error(response.data.message)
    }

    toast.success("🎉 Payment Successful! You are now enrolled in the course(s)!")
    
    // Send success email after verification (use backend provided amount when available)
    await sendPaymentSuccessEmail(
      { payment_intent_id: bodyData.payment_intent_id },
      response?.data?.amount || 0,
      token
    )
    
    // Navigate to enrolled courses
    navigate("/dashboard/enrolled-courses")
    dispatch(resetCart())
    
  } catch (error) {
    console.log("PAYMENT VERIFY ERROR............", error)
    toast.error(error?.response?.data?.message || "Could Not Verify Payment.")
  }
}

// Send the Payment Success Email
async function sendPaymentSuccessEmail(response, amount, token) {
  try {
    await apiConnector(
      "POST",
      SEND_PAYMENT_SUCCESS_EMAIL_API,
      {
        payment_intent_id: response.payment_intent_id,
        amount,
      },
      {
        Authorization: `Bearer ${token}`,
      }
    )
  } catch (error) {
    console.log("PAYMENT SUCCESS EMAIL ERROR............", error)
  }
}
