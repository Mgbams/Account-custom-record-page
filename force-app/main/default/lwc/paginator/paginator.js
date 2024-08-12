
import { LightningElement, api } from 'lwc';

export default class Paginator extends LightningElement {
    @api totalRecords = 0;
    @api pageSize = 4; // 20
    @api pageNumber = 1;
    @api itemsPerPageOptions = [5, 10, 20, 50, 100];

    get getItemsPerPage() {
        let options = this.itemsPerPageOptions?.map(a => {return {label: a, value: a}});
        return options;
    }

    get totalPages() {
        return Math.ceil(this.totalRecords / this.pageSize);
    }

    get enablePreviousPageButton() {
        return this.pageNumber <= 1;
    }

    get enableNextPageButton() {
        return this.pageNumber >= this.totalPages;
    }

    get previousButtonsStyle() {
        return `slds-m-left_x-small custom-button ${this.enablePreviousPageButton ? 'custom-button-disabled' : ''}`;
    }

    get nextButtonsStyle() {
        return `slds-m-left_x-small custom-button ${this.enableNextPageButton ? 'custom-button-disabled': '' }`;
    }

    get pageNumbersForPicklist() {
        console.log('Page Toal ' + this.totalPages);
        let options = [];
        for (let i = 1; i <= this.totalPages; i++) {
            options.push({label: i, value: i, selected: this.pageNumber == i});
        }

        return options;
    }

    get recordsFrom() {
        return (this.pageNumber - 1) * this.pageSize + 1;
    }

    get recordsTo() {
        let total = this.pageNumber * this.pageSize;
        return total > this.totalRecords ? this.totalRecords : total;
    }

    previousPageHandler() {
        let number = this.pageNumber > 1 ? this.pageNumber - 1 : this.pageNumber;
        this.reloadData(number);
    }
    
    nextPageHandler() {
        let number = this.pageNumber < this.totalPages ? this.pageNumber + 1 : this.pageNumber;
        this.reloadData(number);
    }

    goToFirstPageHandler(event) {
        this.reloadData(1);
    }

    goToLastPageHandler(event) {
        this.reloadData(this.totalPages);
    }

    // Called when page number is changed from dropdown
    goToPageHandler(event) {
        this.reloadData(parseInt(event.target?.value));
    }

    // Called when page size is changed
    handlePageSizeChange(event) {
        this.pageSize = parseInt(event.target?.value) ?? this.pageSize;
        this.reloadData(1);
    }

    // Notify parent component about change
    reloadData(pageNumber) {
        let operationType = this.getOperationType(pageNumber);
        let newPageNumber = pageNumber > this.totalPages ? this.totalPages : pageNumber;
        this.pageNumber = newPageNumber;
        console.log('this.pageNumber*********' + this.pageNumber);
        console.log('this.pageSize***********' + this.pageSize);
        console.log('operationType ' + operationType);
        let customEvent = new CustomEvent('paginationchange', {
            detail: {
                pageNumber: this.pageNumber,
                pageSize: this.pageSize,
                operationType: operationType
            }
        });
        console.log('EVENT DISPATCHED');
        this.dispatchEvent(customEvent);
    }

    getOperationType(newPageNumber) {
        return (newPageNumber == 1 || newPageNumber > this.pageNumber ) ? 'NEXT' : 'PREV';
    }

}