import Image from "next/image"

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="w-full lg:grid lg:grid-cols-2 min-h-screen">
            {/* Left Side - Form Area */}
            <div className="flex flex-col justify-center px-8 py-12 md:px-12 lg:px-16 xl:px-24">
                <div className="mx-auto w-full max-w-110">
                    {children}

                    <p className="mt-8 text-center text-xs text-muted-foreground/60">
                        Secure admin access for ZapCart management.
                        Log in to manage products, orders, and customers.
                    </p>
                </div>
            </div>

            {/* Right Side - Visual Area */}
            <div className="relative hidden bg-gradient-to-br from-blue-600 to-blue-800 lg:flex lg:flex-col lg:items-center lg:justify-center p-12">
                {/* Background elements */}
                <div className="relative aspect-square w-full max-w-150">
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-white text-center space-y-6">
                            <div className="text-6xl font-bold">ZapCart</div>
                            <div className="text-2xl font-light">Admin Dashboard</div>
                            <div className="text-base opacity-80">Manage your e-commerce platform</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
