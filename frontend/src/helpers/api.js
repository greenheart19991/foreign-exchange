const getAPIResponseErrorSummary = (axiosError) => {
    const status = axiosError.response
        ? axiosError.response.status
        : null;

    const message = axiosError.response
        ? axiosError.response.data.message || axiosError.response.data || axiosError.response.statusText
        : axiosError.message;

    return {
        status,
        message
    };
};

export {
    getAPIResponseErrorSummary
};
