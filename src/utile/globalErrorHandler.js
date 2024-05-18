export let globalErrorHandler = (error , req , res , next)=>{
    let statusCode = error.cause || 500
    return res.status(statusCode).json({
        success: false ,
        message: error.message,
        stack:error.stack
    })
}