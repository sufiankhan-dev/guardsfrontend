import React from "react";
import { Link } from "react-router-dom";
import LoginForm from "./common/login-form";
import Social from "./common/social";
import useDarkMode from "@/hooks/useDarkMode";

// image import
import LogoWhite from "@/assets/images/logo/logo-white.svg";
import Logo from "@/assets/images/logo/logo.svg";
import Illustration from "@/assets/images/auth/ils1.svg";
import Logo2 from "@/assets/images/logo/spalsh.png";
import Logo4 from "@/assets/images/logo/HomePageImg.jpg";
import Logo3 from "@/assets/images/logo/logooos.jpg";

const login = () => {
  const [isDark] = useDarkMode();
  return (
    <div className="loginwrapper overflow-x-hidden">
      <div className="lg-inner-column">
        <div className="left-column relative">
          {/* <div className="max-w-[520px] pt-20 ltr:pl-20 rtl:pr-20">
            <div className="flex justify-center mt-[-50px]">
            <img src={Logo2} alt=""  />
            
            </div>
            <div className="flex text-center justify-center">
            <h3 className="text-slate-800 dark:text-slate-400 font-bold text-[26px] mt-[-57px] ">
              WE DELIVERED EVERYTHING
             
                
            </h3>
            </div>
          </div> */}
          <div className="relative w-full h-screen">
            <img
              src={Logo4}
              alt="Background"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black opacity-5"></div>
            <div className="absolute top-[10%] left-[20%] flex flex-col items-center text-center z-10">
              <div className="flex text-center justify-center"></div>
            </div>
          </div>
        </div>
        <div className="right-column relative">
          <div className="inner-content h-full flex flex-col bg-white dark:bg-slate-800">
            <div className="auth-box h-full flex flex-col justify-center">
              <div className="mobile-logo text-center mb-6 lg:hidden block">
                <Link to="/">
                  <img
                    src={isDark ? LogoWhite : Logo}
                    alt=""
                    className="mx-auto"
                  />
                </Link>
              </div>
              <div className="text-center 2xl:mb-10 mb-4">
                <h4 className="font-medium">Sign in</h4>
                <div className="text-slate-500 text-base">
                  Sign in to your account to start using DashCart
                </div>
              </div>
              <LoginForm />
              <div className="relative border-b-[#9AA2AF] border-opacity-[16%] border-b pt-6">
                <div className="absolute inline-block bg-white dark:bg-slate-800 dark:text-slate-400 left-1/2 top-1/2 transform -translate-x-1/2 px-4 min-w-max text-sm text-slate-500 font-normal">
                  Or continue with
                </div>
              </div>
              <div className="max-w-[242px] mx-auto mt-8 w-full">
                <Social />
              </div>
              <div className="md:max-w-[345px] mx-auto font-normal text-slate-500 dark:text-slate-400 mt-12 uppercase text-sm">
                Don’t have an account?{" "}
                <Link
                  to="/register"
                  className="text-slate-900 dark:text-white font-medium hover:underline"
                >
                  Sign up
                </Link>
              </div>
            </div>
            <div className="auth-footer text-center">
              Copyright 2024, DashCart All Rights Reserved.
            </div>
          </div>
        </div>
      </div>
    </div>
    // <div className="w-full h-screen flex item start">
    //   <div className="relative w-1/2 h-full flex flex-col">
    //     <div className="absolute top-[20%] left-[10%] flex flex-col">
    //       <h1 className="text-4xl text-white font-extrabold my-4">
    //       WE DELIVERED EVERYTHING
    //       </h1>
    //     </div>
    //     <img src={Logo3} alt="" className="w-full h-full object-cover" />
    //   </div>
    //   <div className="right-column relative">
    //       <div className="inner-content h-full flex flex-col bg-white dark:bg-slate-800">
    //         <div className="auth-box h-full flex flex-col justify-center">
    //           <div className="mobile-logo text-center mb-6 lg:hidden block">
    //             <Link to="/">
    //               <img
    //                 src={isDark ? LogoWhite : Logo}
    //                 alt=""
    //                 className="mx-auto"
    //               />
    //             </Link>
    //           </div>
    //           <div className="text-center 2xl:mb-10 mb-4">
    //             <h4 className="font-medium">Sign in</h4>
    //             <div className="text-slate-500 text-base">
    //               Sign in to your account to start using Dashcode
    //             </div>
    //           </div>
    //           <LoginForm />
    //           <div className="relative border-b-[#9AA2AF] border-opacity-[16%] border-b pt-6">
    //             <div className="absolute inline-block bg-white dark:bg-slate-800 dark:text-slate-400 left-1/2 top-1/2 transform -translate-x-1/2 px-4 min-w-max text-sm text-slate-500 font-normal">
    //               Or continue with
    //             </div>
    //           </div>
    //           <div className="max-w-[242px] mx-auto mt-8 w-full">
    //             <Social />
    //           </div>
    //           <div className="md:max-w-[345px] mx-auto font-normal text-slate-500 dark:text-slate-400 mt-12 uppercase text-sm">
    //             Don’t have an account?{" "}
    //             <Link
    //               to="/register"
    //               className="text-slate-900 dark:text-white font-medium hover:underline"
    //             >
    //               Sign up
    //             </Link>
    //           </div>
    //         </div>
    //         <div className="auth-footer text-center">
    //           Copyright 2021, Dashcode All Rights Reserved.
    //         </div>
    //       </div>
    //     </div>

    //   </div>
  );
};

export default login;
