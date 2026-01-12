export const catchAsyncError = (func) => {
  // logs///
  return (req, res, next) => {
    Promise.resolve(func(req, res, next)).catch(next);
  };
};

export default catchAsyncError;
