export interface User
{
    username: string;
    email: string;
    token: string;
}

export interface LoginForm
{
    email: string;
    password: string;
}

export interface RegisterForm
{
    username: string;
    email: string;
    password: string;
    confirmPassword?: string;
}

export class RegisterDto
{
    username: string;
    email: string;
    password: string;
    
    constructor(registerForm: RegisterForm)
    {
        this.username = registerForm.username;
        this.email = registerForm.email;
        this.password = registerForm.password;
    }
}

export interface ChangePasswordForm
{
    oldPassword: string;
    newPassword: string;
    repeatPassword: string;
}
