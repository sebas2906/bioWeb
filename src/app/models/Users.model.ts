export interface User{
    email?:string,
    patients?:User[],
    id?:string,
    name?:string,
    last_name:string,
    rol?:boolean,
    device_id?:string
}

export interface Token{
    value:string
}