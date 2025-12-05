import { useContext, useState } from 'react';
import SpinnerButton from '../../common/spinner-button/SpinnerButton';
import './Login.css';
import { useForm } from 'react-hook-form';
import type LoginModel from '../../../models/login';
import authService from '../../../services/auth';
import AuthContext from '../auth/AuthContext';

export default function Login() {

    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const { register, handleSubmit, formState: { errors }, setError } = useForm<LoginModel>();

    const authContext = useContext(AuthContext);

    async function submit(login: LoginModel) {
        try {
            setIsSubmitting(true);
            const { jwt } = await authService.login(login);
            authContext?.newJwt(jwt);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (e: any) {
            setError("root", { message: e?.response?.data || "Invalid username or password" });
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className='Login'>
            <form onSubmit={handleSubmit(submit)}>

                {errors.root?.message && (
                    <div className="error-box">{errors.root.message}</div>
                )}

                <input
                    placeholder='username'
                    {...register('username', { required: "username is required" })}
                />
                {errors.username?.message && (
                    <div className="error-box">{errors.username.message}</div>
                )}

                <input
                    placeholder='password'
                    type="password"
                    {...register('password', { required: "password is required" })}
                />
                {errors.password?.message && (
                    <div className="error-box">{errors.password.message}</div>
                )}

                <SpinnerButton
                    buttonText='Login'
                    loadingText='logging in'
                    isSubmitting={isSubmitting}
                />
            </form>
        </div>
    );
}
