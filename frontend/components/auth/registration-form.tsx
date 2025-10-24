"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterSchema } from "@/schemas/index";
import { AuthCardWrapper } from "@/components/auth/auth-card-wrapper";
import { EvoFormInputError } from "@/components/error/form-input-error";
import { z } from "zod";
import { ShowFormError } from "@/components/ui/form-error";
import { ShowFormSuccess } from "@/components/ui/form-success";
import { register as registerUser } from "@/actions/register";


const RegistrationForm = () => {
    const [formerror, setFormError] = useState<string>("");
    const [formsuccess, setFormSuccess] = useState<string>("");
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<z.infer<typeof RegisterSchema>>({
        resolver: zodResolver(RegisterSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    });

    const onSubmit = async (data: z.infer<typeof RegisterSchema>) => {
        setFormError(""); // Reset error message
        setFormSuccess(""); // Reset success message

        await registerUser(data)
            .then((res?: { success?: string; error?: string }) => {
                if (res && typeof res === "object") {
                    if (res.error) setFormError(res.error);
                    if (res.success) setFormSuccess(res.success);
                }
            });
    };

    return (
        <AuthCardWrapper
            headerLabel="Create an account"
            headerDescription="Fill in the fields to get started"
            bottomText="Already have an account?"
            bottomButtonLabel="Sign in"
            bottomButtonHref="/login"
        >
            <form id="userregform" className="flex flex-col gap-3 w-full" onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col relative w-full h-fit pt-1.5">
                    <input type="text"
                        id="firstName"
                        {...register("firstName")}
                        autoCorrect="off"
                        autoComplete="off"
                        spellCheck="false"
                        placeholder="John"
                        className="custom-input-style1 peer w-full h-[40px]"
                    />
                    <label htmlFor="firstName" className="custom-floating-label1 text-[11px] sm:text-[12px] font-[600] leading-3 text-stone-500 before:border-stone-400 peer-focus:before:border-[#0866FF] after:border-stone-400 peer-focus:after:border-[#0866FF] peer-focus:text-[#0866FF] peer-disabled:before:border-stone-300 peer-disabled:after:border-stone-300">
                        {`First Name*`}
                    </label>
                    {errors.firstName && <EvoFormInputError>{errors.firstName.message}</EvoFormInputError>}
                </div>

                <div className="flex flex-col relative w-full h-fit pt-1.5">
                    <input type="text"
                        id="lastName"
                        {...register("lastName")}
                        autoCorrect="off"
                        autoComplete="off"
                        spellCheck="false"
                        placeholder="Doe"
                        className="custom-input-style1 peer w-full h-[40px]"
                    />
                    <label htmlFor="lastName" className="custom-floating-label1 text-[11px] sm:text-[12px] font-[600] leading-3 text-stone-500 before:border-stone-400 peer-focus:before:border-[#0866FF] after:border-stone-400 peer-focus:after:border-[#0866FF] peer-focus:text-[#0866FF] peer-disabled:before:border-stone-300 peer-disabled:after:border-stone-300">
                        {`Last Name`}
                    </label>
                    {errors.lastName && <EvoFormInputError>{errors.lastName.message}</EvoFormInputError>}
                </div>

                <div className="flex flex-col relative w-full h-fit pt-1.5">
                    <input
                        type="text"
                        id="email"
                        {...register("email")}
                        autoCorrect="off"
                        autoComplete="email"
                        spellCheck="false"
                        inputMode="email"
                        placeholder="johndoe@example.com"
                        className="custom-input-style1 peer w-full h-[40px]"
                    />
                    <label htmlFor="email" className="custom-floating-label1 text-[11px] sm:text-[12px] font-[600] leading-3 text-stone-500 before:border-stone-400 peer-focus:before:border-[#0866FF] after:border-stone-400 peer-focus:after:border-[#0866FF] peer-focus:text-[#0866FF] peer-disabled:before:border-stone-300 peer-disabled:after:border-stone-300">
                        {`Email*`}
                    </label>
                    {errors.email && <EvoFormInputError>{errors.email.message}</EvoFormInputError>}
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
                    <label htmlFor="password" className="custom-floating-label1 text-[11px] sm:text-[12px] font-[600] leading-3 text-stone-500 before:border-stone-400 peer-focus:before:border-[#0866FF] after:border-stone-400 peer-focus:after:border-[#0866FF] peer-focus:text-[#0866FF] peer-disabled:before:border-stone-300 peer-disabled:after:border-stone-300">
                        {`Password*`}
                    </label>
                    {errors.password && <EvoFormInputError>{errors.password.message}</EvoFormInputError>}
                </div>

                <div className="flex flex-col relative w-full h-fit pt-1.5">
                    <input
                        type="password"
                        id="confirmPassword"
                        {...register("confirmPassword")}
                        autoCorrect="off"
                        autoComplete="off"
                        spellCheck="false"
                        placeholder="********"
                        className="custom-input-style1 peer w-full h-[40px]"
                    />
                    <label htmlFor="confirmPassword" className="custom-floating-label1 text-[11px] sm:text-[12px] font-[600] leading-3 text-stone-500 before:border-stone-400 peer-focus:before:border-[#0866FF] after:border-stone-400 peer-focus:after:border-[#0866FF] peer-focus:text-[#0866FF] peer-disabled:before:border-stone-300 peer-disabled:after:border-stone-300">
                        {`Confirm Password*`}
                    </label>
                    {errors.confirmPassword && <EvoFormInputError>{errors.confirmPassword.message}</EvoFormInputError>}
                </div>

                {formerror && <ShowFormError message={formerror} />}
                {formsuccess && <ShowFormSuccess message={formsuccess} />}

                <button type="submit"
                    aria-label="sign-up button"
                    disabled={isSubmitting}
                    className="w-full h-fit px-4 py-2.5 sm:py-3 mt-3 text-center bg-stone-800 text-stone-50 text-[13px] font-[500] leading-4 rounded-[6px] hover:bg-stone-900 transition-colors ease-linear duration-200">
                    {isSubmitting ? "Processing..." : "Sign up"}
                </button>
            </form>
        </AuthCardWrapper>
    );
}

export default RegistrationForm;
