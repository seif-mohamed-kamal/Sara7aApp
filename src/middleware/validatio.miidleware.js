import { BadException } from "../common/utils/index.js";

export const validation=(schema)=>{
    return(req,res,next)=>{
        // console.log(schema);
        // console.log(Object.keys(schema));
        const errors=[];
        for (const key of Object.keys(schema)) {
            // console.log({key , schema:schema[key] ,data:req[key] });
            const validateData = schema[key].validate(req[key] ,{abortEarly:false});
            if(validateData.error){
                errors.push({
                    key , details:validateData.error.details.map(ele=>{
                        return {path:ele.path , message:ele.message}
                    })
                })
            }
        }
        if(errors.length){
            throw BadException({message:"validation error" , extra:errors})
        }
        next()
    }
}