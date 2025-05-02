export const handleSuccessResponse = (msg, data = null) => {
    const response = {
      code: 200,
      desc: "success",
      message: msg
    };
    if (data) response.data = data;
    return { response };
  };
  
  export const handleErrorResponse = (error_code, msg) => {
    return {
      response: {
        code: error_code,
        desc: "Failed to process request",
        message: msg
      }
    };
  };  