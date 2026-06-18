export const getErrorMessage = (error) => {
  const data = error.response?.data;

  if (data?.message) {
    return data.message;
  }

  if (data?.errors) {
    return Object.values(data.errors).flat().join(", ");
  }

  return error.message || "Something went wrong";
};
