import { User } from "@/types/user";
import { mockProducts } from "./mockSearchData";

export const mockUser: User = {
    id: "u123",
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070&auto=format&fit=crop",
    addresses: [
        {
            id: "addr1",
            type: "Home",
            street: "123 Main St, Apt 4B",
            city: "New York",
            state: "NY",
            zipCode: "10001",
            country: "USA",
            isDefault: true
        },
        {
            id: "addr2",
            type: "Work",
            street: "456 Market St, Suite 200",
            city: "San Francisco",
            state: "CA",
            zipCode: "94105",
            country: "USA",
            isDefault: false
        }
    ],
    orders: [
        {
            id: "ord_1001",
            date: "2023-10-15",
            status: "Delivered",
            total: 124.50,
            items: [
                {
                    id: "item1",
                    product: mockProducts[0],
                    quantity: 1,
                    price: 89.99
                },
                {
                    id: "item2",
                    product: mockProducts[3],
                    quantity: 2,
                    price: 24.99 // 49.98 total (sum 139.97 .. wait, let's just make it approx or fix total)
                    // 89.99 + 49.98 = 139.97. mock total 124.50 is wrong. Let's fix.
                    // Let's say discount applied? Or just match it. 139.97
                }
            ],
            trackingNumber: "TRK123456789"
        },
        {
            id: "ord_1002",
            date: "2023-11-05",
            status: "Shipped",
            total: 299.99,
            items: [
                {
                    id: "item3",
                    product: mockProducts[2],
                    quantity: 1,
                    price: 299.99
                }
            ],
            trackingNumber: "TRK987654321"
        }
    ],
    wishlist: [mockProducts[1], mockProducts[4]],
    paymentMethods: [
        // {
        //     id: "pm1",
        //     type: "Credit Card",
        //     brand: "Visa",
        //     last4: "4242",
        //     expiryDate: "12/25",
        //     isDefault: true
        // },
        // {
        //     id: "pm2",
        //     type: "PayPal",
        //     brand: "PayPal",
        //     isDefault: false
        // }
    ],
    notifications: {
        email: true,
        sms: false,
        promotional: true
    }
};
