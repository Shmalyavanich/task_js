'use strict';

export default class FormHandler {

    constructor() {
        this.formSelector = '.phones__detail-list';
        this.formFieldSelector = '.phones__detail-field';
        this.formButtonSaveSelector = '.button_form-save';
    }


    getFormData() {
        let data = {},
            formData = new FormData(document.querySelector(this.formSelector));

        for(let pair of formData.entries()) {
            data[pair[0]] = pair[1];
        }
        return data;
    }


    checkFilledForm(){
        let requiredFieldsFilled = true,
            counter = 0,
            fields = document.querySelectorAll(this.formFieldSelector + '[required]');

        for(let i = 0; i < fields.length; i++){
            if(fields[i].value == ''){
                requiredFieldsFilled = false;
            }
        }

        if(requiredFieldsFilled){
            document.querySelector(this.formButtonSaveSelector).removeAttribute('disabled');
        } else {
            document.querySelector(this.formButtonSaveSelector).setAttribute('disabled', 'disabled');
        }
    }

}
