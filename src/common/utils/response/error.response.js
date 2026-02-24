export const ErrorException = ({message = "Fail",status = 400,extra = undefined,} = {}) => {
  throw new Error(message, { cause: { status, extra } });
};

export const ConflictException = ({message = "Coflict" , status = 409 , extra = undefined } = {}) => {
    return ErrorException({message, status:409 , extra})
};

export const NotFoundException = ({message = "Not Found" , status = 404 , extra = undefined } = {}) => {
    return ErrorException({message, status:404 , extra})
};
  
  