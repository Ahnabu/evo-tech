
const EvoFormInputError = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="flex flex-col w-full h-fit text-red-500 text-[11px] sm:text-[12px] leading-4 tracking-tight font-[500] mt-1">
            {children}
        </div>
    );
}

export { EvoFormInputError };
