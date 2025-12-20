import { AccountSidebar } from "@/components/account/AccountSidebar";

export default function AccountLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row gap-8">
                <aside className="w-full md:w-64 flex-shrink-0 h-fit">
                    <AccountSidebar />
                </aside>

                <main className="flex-1 min-w-0">
                    <div className="bg-card border rounded-lg p-6 min-h-[500px]">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
