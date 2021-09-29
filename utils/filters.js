export const filters = ({ router, page, category, search, sort }) => {
    const path = router.pathname;
    const query = router.query;

    if (category) query.category = category;
    if (page) query.page = page;
    if (search) query.search = search;
    if (sort) query.sort = sort;

    return router.push({
        pathname: path,
        query
    })
}