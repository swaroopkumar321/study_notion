import { useEffect, useRef, useState } from "react"
import { useDropzone } from "react-dropzone"
import { FiUploadCloud } from "react-icons/fi"

import "video-react/dist/video-react.css"
import { Player } from "video-react"

export default function Upload({
  name,
  label,
  register,
  setValue,
  errors,
  video = false,
  viewData = null,
  editData = null,
}) {
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewSource, setPreviewSource] = useState(
    viewData ? viewData : editData ? editData : ""
  )
  const [error, setError] = useState("")
  const inputRef = useRef(null)
  const fallbackInputRef = useRef(null)

  const onDrop = (acceptedFiles, rejectedFiles) => {
    setError("")
    if (rejectedFiles.length > 0) {
      const rejection = rejectedFiles[0]
      if (rejection.errors.some((e) => e.code === "file-too-large")) {
        setError(`File is too large. Maximum size is ${video ? "50MB" : "5MB"}`)
      } else if (rejection.errors.some((e) => e.code === "file-invalid-type")) {
        setError(
          `Invalid file type. Please upload ${video ? "MP4 video" : "JPG, JPEG, or PNG image"} files only`
        )
      } else {
        setError("File upload failed. Please try again.")
      }
      return
    }

    const file = acceptedFiles[0]
    if (file) {
      const maxSize = video ? 50 * 1024 * 1024 : 5 * 1024 * 1024
      if (file.size > maxSize) {
        setError(`File is too large. Maximum size is ${video ? "50MB" : "5MB"}`)
        return
      }

      const isValidType = video
        ? file.type && file.type.startsWith("video/")
        : ["image/jpeg", "image/jpg", "image/png"].includes(file.type)
      if (!isValidType) {
        setError(
          `Invalid file type. Please upload ${video ? "MP4 video" : "JPG, JPEG, or PNG image"} files only`
        )
        return
      }

      previewFile(file)
      setSelectedFile(file)
    }
  }

  const handleBrowseClick = (e) => {
    if (e && typeof e.stopPropagation === "function") e.stopPropagation()
    try {
      setError("")
      // Always use the fallback input for consistency
      if (fallbackInputRef.current) {
        fallbackInputRef.current.click()
      } else {
        setError("File picker not available. Please try drag and drop.")
      }
    } catch (err) {
      console.error("Browse button error:", err)
      setError("File picker error. Please try drag and drop.")
    }
  }

  const handleFileChange = (event) => {
    const file = event.target.files[0]
    if (file) {
      setError("")
      const maxSize = video ? 50 * 1024 * 1024 : 5 * 1024 * 1024
      if (file.size > maxSize) {
        setError(`File is too large. Maximum size is ${video ? "50MB" : "5MB"}`)
        return
      }
      const isValidType = video
        ? file.type && file.type.startsWith("video/")
        : ["image/jpeg", "image/jpg", "image/png"].includes(file.type)
      if (!isValidType) {
        setError(
          `Invalid file type. Please upload ${video ? "MP4 video" : "JPG, JPEG, or PNG image"} files only`
        )
        return
      }
      previewFile(file)
      setSelectedFile(file)
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: !video
      ? { "image/*": [".jpeg", ".jpg", ".png"] }
      : { "video/*": [] },
    onDrop,
    maxSize: video ? 50 * 1024 * 1024 : 5 * 1024 * 1024,
    multiple: false,
    noKeyboard: true,
    onError: (error) => {
      console.error("Dropzone error:", error)
      setError("File picker error. Please try the alternative browse option.")
    },
  })

  const previewFile = (file) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onloadend = () => {
      setPreviewSource(reader.result)
    }
  }

  useEffect(() => {
    register(name, { required: true })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [register])

  useEffect(() => {
    setValue(name, selectedFile)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFile, setValue])

  return (
    <div className="flex flex-col space-y-2">
      <label className="text-sm text-richblack-5" htmlFor={name}>
        {label} {!viewData && <sup className="text-pink-200">*</sup>}
      </label>
      <div
        className={`${
          isDragActive ? "bg-richblack-600" : "bg-richblack-700"
        } flex min-h-[250px] cursor-pointer items-center justify-center rounded-md border-2 border-dotted border-richblack-500`}
      >
        {previewSource ? (
          <div className="flex w-full flex-col p-6">
            {!video ? (
              <img
                src={previewSource}
                alt="Preview"
                className="h-full w-full rounded-md object-cover"
              />
            ) : (
              <Player aspectRatio="16:9" playsInline src={previewSource} />
            )}
            {!viewData && (
              <button
                type="button"
                onClick={() => {
                  setPreviewSource("")
                  setSelectedFile(null)
                  setValue(name, null)
                }}
                className="mt-3 text-richblack-400 underline"
              >
                Cancel
              </button>
            )}
          </div>
        ) : (
          <div className="flex w-full flex-col items-center p-6" {...getRootProps()}>
            <input {...getInputProps()} ref={inputRef} />
            <div className="grid aspect-square w-14 place-items-center rounded-full bg-pure-greys-800">
              <FiUploadCloud className="text-2xl text-yellow-50" />
            </div>
            <p className="mt-2 max-w-[200px] text-center text-sm text-richblack-200">
              Drag and drop an {!video ? "image" : "video"}, or click anywhere to {" "}
              <span className="font-semibold text-yellow-50">Browse</span> a file
            </p>
            <button
              type="button"
              onClick={handleBrowseClick}
              className="mt-4 rounded-md bg-yellow-50 px-4 py-2 text-richblack-900 font-semibold hover:bg-yellow-25 transition-colors"
            >
              Browse Files
            </button>
            {/* Fallback file input */}
            <input
              type="file"
              ref={fallbackInputRef}
              onChange={handleFileChange}
              accept={video ? "video/*" : ".jpeg,.jpg,.png"}
              style={{ position: "absolute", left: "-9999px", width: 0, height: 0, opacity: 0 }}
              id={`fallback-${name}`}
            />
            <ul className="mt-10 flex list-disc justify-between space-x-12 text-center  text-xs text-richblack-200">
              <li>Aspect ratio 16:9</li>
              <li>Recommended size 1024x576</li>
              <li>Max size: {video ? "50MB" : "5MB"}</li>
            </ul>
          </div>
        )}
      </div>
      {error && (
        <span className="ml-2 text-xs tracking-wide text-pink-200">{error}</span>
      )}
      {errors[name] && (
        <span className="ml-2 text-xs tracking-wide text-pink-200">{label} is required</span>
      )}
    </div>
  )
}
