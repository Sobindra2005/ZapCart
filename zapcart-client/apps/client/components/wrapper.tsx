interface MainContainerProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    spacing?: boolean;
    spacingClassName?: string;
}

// Consistent section spacing: py-12 (48px top/bottom) for all sections
export const MainContainer = ({ children, className = "", spacing = false, spacingClassName = "", ...props }: MainContainerProps) => {
    return (
        <div 
            className={`mx-auto px-4 sm:px-6 lg:px-8 ${spacing ? 'py-12' : ''} ${spacingClassName} ${className}`}
            {...props}
        >
            {children}
        </div>
    );
};
