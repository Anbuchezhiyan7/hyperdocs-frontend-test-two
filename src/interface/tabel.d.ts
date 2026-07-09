
type TableColumn = {
    key: string;
    title: string;
    children?: React.ReactNode;
    className?: string;
    render?: (row: Record<string, any>) => React.ReactNode;
}