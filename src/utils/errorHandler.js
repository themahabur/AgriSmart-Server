const formatValidationErrors = (error) => {
  const errors = {};

  if (error.name === "ValidationError") {
    // Handle mongoose validation errors
    Object.keys(error.errors).forEach((key) => {
      errors[key] = error.errors[key].message;
    });
  } else if (error.code === 11000) {
    // Handle mongoose duplicate key errors
    const field = Object.keys(error.keyPattern)[0];
    if (field === "email") {
      errors[field] = "Email already registered";
    } else if (field === "phone") {
      errors[field] = "Phone number already registered";
    } else {
      errors[field] = `${
        field.charAt(0).toUpperCase() + field.slice(1)
      } already exists`;
    }
  }

  return errors;
};

const handleError = (error, res) => {
  console.error(error);

  // Handle mongoose validation errors and duplicate key errors
  if (error.name === "ValidationError" || error.code === 11000) {
    const validationErrors = formatValidationErrors(error);
    return res.status(400).json({
      status: false,
      message: "Validation failed",
      errors: validationErrors,
    });
  }

  // Handle other unexpected errors
  return res.status(500).json({
    status: false,
    message: "Server error",
    errors: {
      general: "An unexpected error occurred. Please try again.",
    },
  });
};

module.exports = {
  formatValidationErrors,
  handleError,
};
