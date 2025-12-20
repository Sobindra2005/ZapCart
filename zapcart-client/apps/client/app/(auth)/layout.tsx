import Image from "next/image"

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="w-full lg:grid lg:grid-cols-2">
            {/* Left Side - Form Area */}
            <div className="flex flex-col justify-center px-8 py-12 md:px-12 lg:px-16 xl:px-24">
                <div className="mx-auto w-full max-w-[440px]">


                    {children}

                    <p className="mt-8 text-center text-xs text-muted-foreground/60">
                        Join the millions of satisfied shoppers who trust ZapCart.
                        Log in to manage your orders and discover new products. {/* Updated text for ecommerce */}
                    </p>
                </div>
            </div>

            {/* Right Side - Visual Area */}
            <div className="relative hidden bg-gradient-to-t from-blue-50 to-blue-100 lg:flex lg:flex-col lg:items-center lg:justify-center p-12">
                {/* Background elements if any */}
                <div className="relative aspect-square w-full max-w-[600px]">
                    <Image
                        src="/assets/auth-safe.png"
                        alt="Secure Vault Illustration"
                        fill
                        priority
                        className="object-contain drop-shadow-2xl"
                    />
                </div>
            </div>
        </div>
    )
}
