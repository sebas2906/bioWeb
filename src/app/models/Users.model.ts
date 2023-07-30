export interface User{
    email?:string,
    patients?:User[],
    id?:string,
    username?:string,
    rol?:boolean
}

export interface Token{
    value:string
}