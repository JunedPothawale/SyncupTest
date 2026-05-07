export const formatSalary = (salary) => {

    if (!salary) return "";

    const min =
        Number(salary.min);

    const max =
        Number(salary.max);

    const currency =
        salary.currency || "INR";

    // INR → LPA
    if (currency === "INR") {

        const minLPA =
            (min / 100000)
                .toFixed(0);

        const maxLPA =
            (max / 100000)
                .toFixed(0);

        return `${minLPA}-${maxLPA} LPA`;
    }

    // USD
    if (currency === "USD") {

        const minK =
            (min / 1000)
                .toFixed(0);

        const maxK =
            (max / 1000)
                .toFixed(0);

        return `$${minK}K-$${maxK}K`;
    }

    return `${min}-${max}`;
};