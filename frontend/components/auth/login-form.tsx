"use client";

import { z } from "zod";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema } from "@/schemas/index";
import { AuthCardWrapper } from "@/components/auth/auth-card-wrapper";
import { EvoFormInputError } from "@/components/error/form-input-error";
import { ShowFormError } from "@/components/ui/form-error";
import { ShowFormSuccess } from "@/components/ui/form-success";
import { login } from "@/actions/login";
import { useRouter } from "next/navigation";
import { DEFAULT_SIGNIN_REDIRECT_USER } from "@/routeslist";
import axios from "@/utils/axios/axios";

const LoginForm = () => {
  const router = useRouter();
  const [formerror, setFormError] = useState<string>("");
  const [formsuccess, setFormSuccess] = useState<string>("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof LoginSchema>) => {
    setFormError(""); // Reset error message
    setFormSuccess(""); // Reset success message

    const res = await login(data);

    if (res && typeof res === "object") {
      if (res.error) {
        setFormError(res.error);
      }
      if (res.success) {
        setFormSuccess(res.success);

        // Link any guest orders to this user account
        try {
          await axios.post("/api/order/link-guest-orders", {
            email: data.email,
          });
        } catch (error) {
          // Silently fail - linking is not critical for login success
          console.log("Failed to link guest orders:", error);
        }

        // Wait a moment for session to be fully set, then redirect
        setTimeout(() => {
          router.push(DEFAULT_SIGNIN_REDIRECT_USER);
          router.refresh();
        }, 100);
      }
    }
  };

  return (
    <AuthCardWrapper
      headerLabel="Welcome Back!"
      headerDescription="Sign-in to access your account"
      bottomText="Don't have an account?"
      bottomButtonLabel="Sign up"
      bottomButtonHref="/register"
    >
      <form
        id="userloginform"
        className="flex flex-col gap-3 w-full"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex flex-col relative w-full h-fit pt-1.5">
          <input
            type="text"
            id="email"
            {...register("email")}
            autoCorrect="off"
            autoComplete="email"
            spellCheck="false"
            inputMode="email"
            placeholder="e.g. name@example.com"
            className="custom-input-style1 peer w-full h-[40px]"
          />
          <label
            htmlFor="email"
            className="custom-floating-label1 text-[11px] sm:text-[12px] font-[600] leading-3 text-stone-500 before:border-stone-400 peer-focus:before:border-[#0866FF] after:border-stone-400 peer-focus:after:border-[#0866FF] peer-focus:text-[#0866FF] peer-disabled:before:border-stone-300 peer-disabled:after:border-stone-300"
          >
            {`Email*`}
          </label>
          {errors.email && (
            <EvoFormInputError>{errors.email.message}</EvoFormInputError>
          )}
        </div>
        <div className="flex flex-col relative w-full h-fit pt-1.5">
          <input
            type="password"
            id="password"
            {...register("password")}
            autoCorrect="off"
            autoComplete="off"
            spellCheck="false"
            placeholder="********"
            className="custom-input-style1 peer w-full h-[40px]"
          />
          <label
            htmlFor="password"
            className="custom-floating-label1 text-[11px] sm:text-[12px] font-[600] leading-3 text-stone-500 before:border-stone-400 peer-focus:before:border-[#0866FF] after:border-stone-400 peer-focus:after:border-[#0866FF] peer-focus:text-[#0866FF] peer-disabled:before:border-stone-300 peer-disabled:after:border-stone-300"
          >
            {`Password*`}
          </label>
          {errors.password && (
            <EvoFormInputError>{errors.password.message}</EvoFormInputError>
          )}
        </div>
        <div className="flex justify-end w-full">
          <Link
            href="/forgot-password"
            className="text-[12px] sm:text-[13px] leading-5 font-[500] text-stone-700 hover:text-stone-800 hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        {formerror && <ShowFormError message={formerror} />}
        {formsuccess && <ShowFormSuccess message={formsuccess} />}

        <button
          type="submit"
          aria-label="sign-in button"
          disabled={isSubmitting}
          className="w-full h-fit px-4 py-2.5 sm:py-3 text-center bg-stone-800 text-stone-50 text-[13px] font-[500] leading-4 rounded-[6px] hover:bg-stone-900 transition-colors ease-linear duration-200"
        >
          {isSubmitting ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </AuthCardWrapper>
  );
};

export default LoginForm;
