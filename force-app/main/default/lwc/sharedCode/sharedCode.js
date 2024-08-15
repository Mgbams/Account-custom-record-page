const preparePageDataUtil = (context, response) => {
    context.isLoading = false;
    context.data = [...context.data, ...response];
    let from = (context.pageNumber - 1) * context.pageSize;
    let to = context.pageSize * context.pageNumber;
    context.recordsToDisplay = context.data?.slice(from, to);
};

const paginationChangeHandlerUtil = (event, context) => {
    if (event.detail) {
        if (context.pageSize !== event.detail.pageSize) {
            context.data = []; // reset records array on page size change
            context.pageSize = event.detail.pageSize;
            console.log('PageSize is set here: ', context.pageSize);
        }
        context.pageNumber = event.detail.pageNumber;
        console.log('PageSize: ', context.pageSize);
        console.log('PageNumber: ', context.pageNumber);
        if (context.data?.length < (context.pageSize * context.pageNumber)) {
            console.log('Fetching more data...');
            context.lastRecordId = context.data[context.data.length - 1]?.Id;
            context.isLoading = true;
            context.fetchRecordsFromServer();
        } else {
            let from = (context.pageNumber - 1) * context.pageSize;
            let to = context.pageSize * context.pageNumber;
            context.recordsToDisplay = context.data?.slice(from, to);
        }
    }
};

export { preparePageDataUtil, paginationChangeHandlerUtil };
