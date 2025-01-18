"use client";
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import LoadingPage from '@/components/common/loadingPage/LoadingPage';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'; // Import eye icons
import Link from 'next/link'
import Image from 'next/image';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_TOKEN_URL;

const LoginForm = () => {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
    const [error, setError] = useState('');
    const { t, i18n } = useTranslation("common");
    const [isLoaded, setIsLoaded] = useState(false);

    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleRememberMeChange = (event) => {
        setRememberMe(event.target.checked);
      };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        const loginData = {
            username: username,
            password: password,
            RememberMe: rememberMe,
        };

        try {
            const response = await fetch(`${API_BASE_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'same-origin',
                body: JSON.stringify(loginData),
            });

            if (response.ok) {
                const data = await response.json();
                if (isClient) {
                    Cookies.set('token', data.Token, { path: '/' });
                    Cookies.set('refreshToken', data.RefreshToken, { path: '/' });
                    localStorage.setItem('username', data.first_name + ' ' + data.last_name);
                    localStorage.setItem('company_name', data.CompanyName);
                }

                // Navigate based on user role
                if (data.is_root === true) {
                    router.push('/root/dashboard');
                } else if (data.is_admin === true) {
                    router.push('/admin/dashboard');
                } else {
                    router.push('/user/dashboard');
                }
            } else {
                const errorData = await response.json();
                if (errorData.error === 'user not found') {
                    setError(t('error.user_not_found'));
                } else  {  
                    setError(t('error.not_match'));
                }
            }
        } catch (error) {
            console.error('Login failed:', error);
            setError(t('error.login_fail'));
        }
    };

    // Load translations
    useEffect(() => {
        const loadTranslations = async () => {
            await i18n.loadNamespaces('common');
            setIsLoaded(true);
        };

        loadTranslations();
    }, [i18n]);

    if (!isLoaded) {
        return <LoadingPage />;
    }

    return (
        <div>
            <section className="bg-gray-50 w-full h-screen" style={{ backgroundImage: "url('/images/login/backgound.jpeg')", 
                backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat'}}>
                <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                    <Link href="/" className="flex items-center mb-6 text-2xl font-semibold text-gray-900">
                        <Image
                            className="w-40 h-14 mr-2" 
                            src="/images/common/logo_main.png"
                            alt="logo"
                            width={160}
                            height={56}
                        />
                    </Link>
                    <div className="w-full bg-opacity-80 bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
                        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
                                {t('login.title')}
                            </h1>
                            <form className="space-y-4 md:space-y-6" onSubmit={handleLogin}>
                                <div>
                                    <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900">{t('login.user-name')}</label>
                                    <input
                                        type="text"
                                        name="username"
                                        id="username"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                        placeholder={t('login.user-name')}
                                        required
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                    />
                                </div>
                                <div className="relative">
                                    <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">{t('login.password')}</label>
                                    <input
                                        type={showPassword ? "text" : "password"} // Conditionally change input type
                                        name="password"
                                        id="password"
                                        placeholder="••••••••"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-center top-[39px] right-0 flex items-center px-2"
                                        onClick={togglePasswordVisibility}
                                    >
                                        {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
                                    </button>
                                </div>
                                {error && <p className="text-sm text-red-500">{error}</p>}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-start">
                                        <div className="flex items-center h-5">
                                            <input
                                                id="remember"
                                                type="checkbox"
                                                checked={rememberMe}
                                                onChange={handleRememberMeChange}
                                                className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300"
                                            />
                                        </div>
                                        <div className="ml-3 text-sm">
                                            <label htmlFor="remember" className="text-gray-500">{t('login.save-password')}</label>
                                        </div>
                                    </div>
                                    <Link href="/contact" className="text-sm font-medium text-primary-600 hover:underline">{t('login.forgot-password')}?</Link>
                                </div>
                                <button type="submit" className="w-full text-white bg-primary hover:bg-primary-700 hover:bg-primary-hover focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">{t('login.login')}</button>
                                <p className="text-sm font-light text-gray-500">
                                    {t('login.not-have-account')}? <Link href="/quotes" className="font-medium text-primary-600 hover:underline">{t('login.contact')}</Link>
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default LoginForm;
