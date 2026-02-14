import { AlertCircle, Inbox, SearchX } from "lucide-react";
import { TableCell, TableRow } from "./table";
import { Skeleton } from "./skeleton";
import { Button } from "./button";

interface TableLoadingStateProps {
    rowCount?: number;
    columnCount?: number;
}

export function TableLoadingState({
    rowCount = 10,
    columnCount = 5,
}: TableLoadingStateProps) {
    return (
        <>
            {Array.from({ length: rowCount }).map((_, i) => (
                <TableRow key={i} className="hover:bg-transparent">
                    {Array.from({ length: columnCount }).map((_, j) => (
                        <TableCell key={j}>
                            <Skeleton className="h-6 w-full" />
                        </TableCell>
                    ))}
                </TableRow>
            ))}
        </>
    );
}

interface TableErrorStateProps {
    title?: string;
    message?: string;
    onRetry?: () => void;
    colSpan?: number;
}

export function TableErrorState({
    title = "Something went wrong",
    message = "There was an error loading the data. Please try again.",
    onRetry,
    colSpan = 1,
}: TableErrorStateProps) {
    return (
        <TableRow>
            <TableCell colSpan={colSpan} style={{height:'500px'}} className=" text-center">
                <div className="flex flex-col items-center justify-center space-y-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
                        <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-lg font-medium text-foreground">{title}</h3>
                        <p className="text-sm text-muted-foreground">{message}</p>
                    </div>
                    {onRetry && (
                        <Button variant="outline" onClick={onRetry} className="mt-4">
                            Try Again
                        </Button>
                    )}
                </div>
            </TableCell>
        </TableRow>
    );
}

interface TableEmptyStateProps {
    title?: string;
    message?: string;
    icon?: React.ReactNode;
    action?: React.ReactNode;
    colSpan?: number;
    isSearch?: boolean;
}

export function TableEmptyState({
    title = "No data found",
    message = "There are no records to display at this time.",
    icon,
    action,
    colSpan = 1,
    isSearch = false,
}: TableEmptyStateProps) {
    const Icon = icon ? (
        <>{icon}</>
    ) : isSearch ? (
        <SearchX className="h-10 w-10 text-muted-foreground" />
    ) : (
        <Inbox className="h-10 w-10 text-muted-foreground" />
    );

    return (
        <TableRow>
            <TableCell style={{height:'500px'}} colSpan={colSpan} className="h-[600px] text-center">
                <div className="flex flex-col items-center justify-center space-y-3">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted/50">
                        {Icon}
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-lg font-medium text-foreground">{title}</h3>
                        <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                            {message}
                        </p>
                    </div>
                    {action && <div className="mt-4">{action}</div>}
                </div>
            </TableCell>
        </TableRow>
    );
}
