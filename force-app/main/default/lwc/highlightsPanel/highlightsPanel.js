import { LightningElement, api, track, wire } from "lwc";
import { NavigationMixin } from "lightning/navigation";

export default class HighlightsPanel extends LightningElement {
  @api _createContact = false;
  @api _isCreateContactGl = false;
  @api _isOpportunity = false;
  @api _isEvent = false;
  @api _isCreateModify = false;

  navigateToList() {
    this[NavigationMixin.Navigate]({
        type: "standard__objectPage",
          attributes: {
            objectApiName: "Case",
            actionName: "list"
          },
          state: {
            filterName: "Demandes_de_modification_de_comptes_Case"
          }
    });
  }

  handleCreate() {
    //
  }

  handleMenuItem(event) {
    console.log("selected menu => " + event.detail.value);
    switch (event.detail.value) {
      case "opportunity":
        // do logic
        break;
      case "evenement":
        //do logic
        break;
    }
  }

  handleClick() {}

  @api get isCreateContact() {
    return this._createContact;
  }

  set isCreateContact(value) {
    if (value) {
      this._createContact = value;
    }
  }

  //_isCreateContactGl
  @api get isCreateContactGl() {
    return this._isCreateContactGl;
  }

  set isCreateContactGl(value) {
    if (value) {
      this._isCreateContactGl = value;
    }
  }

  //_isOpportunity 
  @api get isOpportunity () { 
  return this._isOpportunity;
  }

  set isOpportunity(value) {
    if (value) {
      this._isOpportunity = value;
    }
  }

   //_isEvent 
  @api get isEvent() { 
    return this._isEvent;
  }
  
  set isEvent(value) {
    if (value) {
      this._isEvent = value;
    }
  }

  //_isCreateModify
  @api get isCreateModify() { 
    return this._isCreateModify;
  }
  
  set isCreateModify(value) {
    if (value) {
      this._isCreateModify = value;
    }
  }
}
  