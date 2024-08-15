import { LightningElement, wire } from 'lwc';
import getOpportunities from '@salesforce/apex/PaginationDemoController.getOpportunities'; 
import getTotalOpportunitiesCount from '@salesforce/apex/PaginationDemoController.getTotalOpportunitiesCount';
import { preparePageDataUtil, paginationChangeHandlerUtil } from 'c/sharedCode';

const actions = [
    { label: 'Show details', name: 'show_details' },
    { label: 'Delete', name: 'delete' },
];

const columns = [
    { label: 'Stage Name', fieldName: 'StageName' },
    { label: 'Amount', fieldName: 'Amount' },
    { label: 'AccountId', fieldName: 'AccountId', type: 'url'},
    {
        type: 'action',
        typeAttributes: { rowActions: actions },
    },
];

export default class OpportunitiesList extends LightningElement {
    data = [];
    columns = columns;
    record = {};
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
    @wire(getTotalOpportunitiesCount)
    wiredGetTotalOpportunitiesCount(result) {
        if (result.data) {
             this.totalRecords = parseInt(result.data);
             this.showPaginator = (this.totalRecords > this.pageSize);
        } else if(result.error) {
             //
        }
    }

    fetchRecordsFromServer() {
        getOpportunities({pageSize: this.pageSize, lastRecordId: this.lastRecordId}).then(response => {
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

    handleRowAction(event) {
        const actionName = event.detail.action.name;
        const row = event.detail.row;
        switch (actionName) {
            case 'delete':
                this.deleteRow(row);
                break;
            case 'show_details':
                this.showRowDetails(row);
                break;
            default:
        }
    }

    deleteRow(row) {
        const { id } = row;
        const index = this.findRowIndexById(id);
        if (index !== -1) {
            this.data = this.data
                .slice(0, index)
                .concat(this.data.slice(index + 1));
        }
    }

    findRowIndexById(id) {
        let ret = -1;
        this.data.some((row, index) => {
            if (row.id === id) {
                ret = index;
                return true;
            }
            return false;
        });
        return ret;
    }

    showRowDetails(row) {
        this.record = row;
    }
}
