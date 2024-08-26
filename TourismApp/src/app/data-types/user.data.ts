export interface User{
    id?: any,
    name?: string,
    email?: string,
    password?: string
    role?: Role
}
 

export enum Role{
    ADMIN="admin",
   CLIENT="client"
}