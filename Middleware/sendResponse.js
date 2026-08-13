const statusMessages = {
    200: { message: 'Success' },
    400: { message: 'Bad Request' },
    401: { message: 'Unauthorized' },
    403: { message: 'Forbidden' },
    404: { message: 'Not Found' },
    500: { message: 'Internal Server Error' }
};

function isEmpty(value) {
    if (value === null || value === undefined) {
        return true;
    }
    if (typeof value === 'string') {
        return value.trim().length === 0;
    }
    if (typeof value === 'object') {
        return Object.keys(value).length === 0 && value.constructor === Object;
    }
    return false;
}

exports.sendResponse = (res, statusCode, data = {}, err = {}) => {
    const response = statusMessages[statusCode] || { message: 'Unknown Status' };
    const message = data.info || response.message;

    if (!isEmpty(err)) {
        console.log('💀 Error : ', err)
    }

    if (statusCode >= 400 && !isEmpty(data.info)) {
        console.log('💀 Error : ', data.info)
    }

    return res.status(statusCode).json({
        status: statusCode,
        message,
        data: {
            ...data,
            info: data.info || response.message
        }
    });
};
