import { LightningElement, wire} from 'lwc';
//import generateData from './generateData';
import getContacts from '@salesforce/apex/PaginationDemoController.getContacts'; 
import getTotalContactsCount from '@salesforce/apex/PaginationDemoController.getTotalContactsCount';
import { preparePageDataUtil, paginationChangeHandlerUtil } from 'c/sharedCode';

const columns = [
    { label: 'FirstName', fieldName: 'FirstName' },
    { label: 'Email', fieldName: 'Email' },
    { label: 'Phone', fieldName: 'Phone', type: 'phone' },
    { label: 'Department', fieldName: 'Department'}
];

export default class ContactList extends LightningElement {
    data = [];
    columns = columns;
    isLoading = true;
    error;
    //PAGINATOR PROPERTIES
    pageSize = 1; //10
    totalRecords = 0;
    pageNumber = 1;
    enablePagination = true;
    lastRecordId = '';
    itemsPerPageOptions = [5, 10, 20, 50, 100];
    _showPaginator;
    _recordsToDisplay;

    connectedCallback() {
        this.fetchRecordsFromServer();
    }
    
    get hasRecords() {
        return this.data.length > 0;
    }

    //pagination property - check whther to show the paginator
    get showPaginator() {
        return this.enablePagination && this.hasRecords;
    }

    set showPaginator(value) {
        this._showPaginator = value;
    }

     //Get total records count
    @wire(getTotalContactsCount)
    wiredGetTotalContactsCount(result) {
        if (result.data) {
             this.totalRecords = parseInt(result.data);
             this.showPaginator = (this.totalRecords > this.pageSize);
        } else if(result.error) {
             //
        }
    }

    fetchRecordsFromServer() {
        getContacts({pageSize: this.pageSize, lastRecordId: this.lastRecordId}).then(response => {
            if (response) {
                preparePageDataUtil(this, response);
            }
        });
    }

    paginationChangeHandler(event) {
        paginationChangeHandlerUtil(event, this);
    }

    //Pagination property - calculate and return records to display
    get recordsToDisplay() {
        return this._recordsToDisplay;
    }

    set recordsToDisplay(value) {
        this._recordsToDisplay = value;
    }
}
