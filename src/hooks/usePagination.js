import { useState, useMemo } from "react";

export const usePagination = (items = [], itemsPerPage = 10) => {
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = useMemo(() => {
        return Math.ceil(items.length / itemsPerPage);
    }, [items, itemsPerPage]);

    const paginatedItems = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        return items.slice(start, end);
    }, [items, currentPage, itemsPerPage]);

    const nextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

    return {
        currentPage,
        setCurrentPage,
        totalPages,
        paginatedItems,
        nextPage,
        prevPage,
    };
};
