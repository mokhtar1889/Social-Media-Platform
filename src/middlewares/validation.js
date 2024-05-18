export let validation = (schema)=>{
    return (req , res , next)=>{
        let data = {...req.body , ...req.params , ...req.query}
        let validationResult = schema.validate(data , {abortEarly:false}) 

        if(validationResult.error)  return next(new Error(validationResult.error, {cause:400}))

        return next()
    }

}