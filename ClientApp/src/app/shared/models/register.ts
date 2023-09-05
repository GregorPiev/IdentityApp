export interface IRegister{  
  firstName: string,
  lastName: string,
  email: string,
  password: string
}

export interface IResponse {
  value: {
    title: string,
    message: string
  }
}
