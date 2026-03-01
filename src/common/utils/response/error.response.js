export const ErrorException = ({message = "Fail",status = 400,extra = undefined,} = {}) => {
  throw new Error(message, { cause: { status, extra } });
};

export const ConflictException = ({message = "Coflict" , status = 409 , extra = undefined } = {}) => {
    return ErrorException({message, status:409 , extra})
};

export const NotFoundException = ({message = "Not Found" , status = 404 , extra = undefined } = {}) => {
    return ErrorException({message, status:404 , extra})
};
  
export const ForbiddenException = ({message = "Forbidden Access" , status = 403 , extra = undefined } = {}) => {
  return ErrorException({message, status:403 , extra})
};

export const BadException = ({message = "Bad Exception" , status = 400 , extra = undefined } = {}) => {
  return ErrorException({message, status:400 , extra})
};

export const UnAuthrizedException = ({message = "Not Authrized Exception" , status = 401 , extra = undefined } = {}) => {
  return ErrorException({message, status:401 , extra})
};
