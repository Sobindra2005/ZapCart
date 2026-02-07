"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { wishListApi } from "@/utils/api";

export function useWishlist(productId: string) {
    const queryClient = useQueryClient();

    // Check if product is in wishlist
    const { data: wishlistData, isLoading: isCheckingWishlist } = useQuery({
        queryKey: ['wishlist-check', productId],
        queryFn: () => wishListApi.checkWishlistItem(productId),
        enabled: !!productId,
        retry: false,
    });

    const isFavorite = wishlistData?.inWishlist || false;

    // Toggle wishlist mutation with optimistic updates
    const toggleWishlistMutation = useMutation({
        mutationFn: (productId: string) => wishListApi.toggleWishListItem(productId),
        // Optimistic update
        onMutate: async (productId: string) => {
            // Cancel any outgoing refetches to avoid overwriting optimistic update
            await queryClient.cancelQueries({ queryKey: ['wishlist-check', productId] });
            await queryClient.cancelQueries({ queryKey: ['wishlist'] });

            // Snapshot the previous value
            const previousWishlistCheck = queryClient.getQueryData(['wishlist-check', productId]);
            const previousWishlist = queryClient.getQueryData(['wishlist']);

            // Optimistically update the wishlist check
            queryClient.setQueryData(['wishlist-check', productId], (old: any) => {
                return {
                    ...old,
                    inWishlist: !isFavorite
                };
            });

            // Return context with the previous values to rollback on error
            return { previousWishlistCheck, previousWishlist };
        },
        onError: (error, productId, context) => {
            // Rollback to previous state on error
            if (context?.previousWishlistCheck) {
                queryClient.setQueryData(['wishlist-check', productId], context.previousWishlistCheck);
            }
            if (context?.previousWishlist) {
                queryClient.setQueryData(['wishlist'], context.previousWishlist);
            }
            console.error('Failed to toggle wishlist item:', error);
            // You can add toast notification here
        },
        onSettled: (data, error, productId) => {
            // Always refetch after error or success to ensure we're in sync with the server
            queryClient.invalidateQueries({ queryKey: ['wishlist-check', productId] });
            queryClient.invalidateQueries({ queryKey: ['wishlist'] });
        },
    });

    const toggleWishlist = () => {
        if (!productId) return;
        toggleWishlistMutation.mutate(productId);
    };

    return {
        isFavorite,
        isCheckingWishlist,
        isUpdatingWishlist: toggleWishlistMutation.isPending,
        toggleWishlist,
        toggleWishlistMutation, // Export the mutation itself for more control
    };
}
