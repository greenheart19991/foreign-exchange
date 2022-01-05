const ascendingComparator = (a, b) => {
    if (a > b) {
        return 1;
    }

    if (a < b) {
        return -1;
    }

    return 0;
};

const descendingComparator = (a, b) => -ascendingComparator(a, b);

const stableSort = (array, comparator) => {
    const sorted = array
        .map((el, index) => [el, index])
        .sort((a, b) => {
            const order = comparator(a[0], b[0]);
            if (order !== 0) {
                return order;
            }

            return a[1] - b[1];
        })
        .map((el) => el[0]);

    return sorted;
};

const createComparatorFromOrder = (orderArr) => (a, b) => {
    const aIndex = orderArr.indexOf(a);
    const bIndex = orderArr.indexOf(b);

    return aIndex - bIndex;
};

export {
    ascendingComparator,
    descendingComparator,
    stableSort,
    createComparatorFromOrder
};
