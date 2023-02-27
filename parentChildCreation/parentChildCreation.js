import { LightningElement,track,api,wire } from 'lwc';
	
import { NavigationMixin } from 'lightning/navigation';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import saveDataValues from '@salesforce/apex/ParentChildCreationHandler.saveDataValues'
import Name_field_P from '@salesforce/schema/Parent__c.Name';
import Email_field_P from '@salesforce/schema/Parent__c.Email__c';
import Phone_field_P from '@salesforce/schema/Parent__c.Phone_No__c';
import DOB_field_P from '@salesforce/schema/Parent__c.Date_of_Birth__c';

import Email_field_C from '@salesforce/schema/Child__c.Child_Mail__c';
import Name_field_C from '@salesforce/schema/Child__c.Name';
import DOB_field_C from '@salesforce/schema/Child__c.Date_of_Birth__c';



	
	
	



//ParentChildCreationHandler

export default class ParentChildCreation extends NavigationMixin(LightningElement) {
    @track ShowDoneButton =false
    @track ShowchildFields =false
    @track Childs = [];
    @track isLoaded = true
    
    fieldNamesParent = {
        Name: Name_field_P.fieldApiName,
        DOB: DOB_field_P.fieldApiName,
        Phone: Phone_field_P.fieldApiName,
        Email: Email_field_P.fieldApiName,
        
      };

      fieldNamesChild = {
        Name: Name_field_C.fieldApiName,
        DOB: DOB_field_C.fieldApiName,
        Email: Email_field_C.fieldApiName,
        
      };

      parentRecord = {
        [Name_field_P.fieldApiName]: "",
        [DOB_field_P.fieldApiName] :"",
        [Phone_field_P.fieldApiName]: "",
        [Email_field_P.fieldApiName]: "",
        
      };

      childRecord = {
        [Name_field_C.fieldApiName]:"",
        [DOB_field_C.fieldApiName]:"",
        [Email_field_C.fieldApiName]:"",
        rowNo : ""

      };

      onParentFieldChangeHandler(event){
        //console.log(event.target.value);
        this.parentRecord[event.target.name] = event.target.value;
      }

      onChildFieldChangeHandler(event){
        //console.log(event.target.value);
        this.childRecord[event.target.name] = event.target.value;
      }


      AddButtonClick(){
        console.log('onAddClick');
        this.childRecord.rowNo = this.Childs.length+1;
        console.log('childRecord '+JSON.stringify(this.childRecord) )
        
        
        this.Childs.push(this.childRecord)
        console.log('list'+JSON.stringify(this.Childs)  )
        this.childRecord ={}
        console.log('childRecord null'+JSON.stringify(this.childRecord))
        console.log('element class ',this.getElementsByClassName('childField'))
        console.log('element class ',this.template.querySelector('.childField'))
        //this.template.querySelector('.banner.error');
        this.template.querySelectorAll('lightning-input[data-id="reset"]').forEach(element => {
          element.value = null;
        });
        //this.template.querySelector('.childField').reset();


      }

      AddButtonClickDone(){
        console.log('AddButtonClickDone')
        this.parentRecord.Childs = this.Childs
        this.ShowDoneButton =false
        this.ShowchildFields = false
        
        //add child bhi gayab karn hai click here to add child dikhna hai

      }

      ShowChildFieldClick(){
        console.log('ShowChildFieldClick')
        this.ShowchildFields =true
        this.ShowDoneButton =true;
      }

      deleteButtonClicked(event){
        console.log('iddd->'+event.target.value)
        console.log('iddd detail->'+event.detail.value)
          this.Childs.splice(event.target.value-1,1)
          console.log('After splice'+this.Childs)
      }

      SaveClick(){
        console.log('parent==>'+JSON.stringify(this.parentRecord))
        this.isLoaded =true


        saveDataValues({Parent : JSON.stringify(this.parentRecord) }).then(result => {
            console.log('daya');
            console.log(result);
            if(result){
              this.isLoaded =false
              console.log('callinf toast and redirecting')
              this.showToastSucess(result)
              this.navigateToRecord(result)
            }
            }) .catch();

            
        }


        showToastSucess(id){
          const event1 = new ShowToastEvent({
            title: 'Parent creted Successfully',
            message: 'Parent creted with id ' +id,
            variant: 'success',
            mode: 'dismissable'
        });
        this.dispatchEvent(event1);
        }

        

        navigateToRecord(id){
          console.log('inside navigation')
              this[NavigationMixin.Navigate]({
                  type : 'standard__recordPage',
                  attributes :{
                      recordId :id,
                      objectApiName : 'Parent__c',
                      actionName : 'view'
                    }
                })
            }
      

}

