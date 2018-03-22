'use strict';

import FormHandler from './form-handler.js';

export default class App {
    constructor() {
        this.dataFilePath = '/data/data.json';

        this.tableSelector = '.phones__table-body';
        this.tableRowSelector = '.phones__table-row';
        this.formSelector = '.phones__detail-list';
        this.formFieldSelector = '.phones__detail-field';
        this.formButtonSaveSelector = '.button_form-save';
        this.tableButtonAddSelector = '.button_table-add';
        this.tableButtonDeleteSelector = '.button_table-remove';
        this.LoaderSelector = '.phones__loader';

        this.tableRowClass = 'phones__table-row';
        this.tableItemClass = 'phones__table-item';
        this.hiddenClass = 'hidden';
        this.tableRowActiveClass = 'active';
        this.tableRowFilledClass = 'filled';
        this.tableRowIdConst = 'row-';
        this.formIdInputName = 'phone_id';

        this.data = {};
    }

    impotData() {
        fetch(this.dataFilePath)
            .then((response) => response.json())
            .then((data) => {
                if(Object.keys(data).length > 0){
                    this.data = data;

                    //добавление данных в таблицу
                    this.insertTableData(data);

                    //скрыть loader
                    let loaderClassList = document.querySelector(this.LoaderSelector).classList,
                        hiddenClass = this.hiddenClass;
                        loaderClassList.add(hiddenClass);
                }
            }).catch((error) => {});

    }

    insertTableData(data) {
        for (let rowKey in data) {
            this.insertTableRow(data[rowKey], rowKey);
        }

    }

    insertTableRow(data, rowKey){
        let newRowHtml = '',
            phoneName = '',
            phoneScreenSize = '',
            phoneRam = '',
            phoneSizes = '',
            phoneBattery = '',
            table = document.querySelector(this.tableSelector);

        if(data.phone_name !== undefined){
            phoneName = data.phone_name;
        }

        if(data.phone_screen_size !== undefined){
            phoneScreenSize = data.phone_screen_size;
        }

        if(data.phone_ram !== undefined){
            phoneRam = data.phone_ram;
        }

        if( (data.phone_length !== undefined) && (data.phone_length != '')
            && (data.phone_width !== undefined) && (data.phone_width != '')
            && (data.phone_thickness !== undefined) && (data.phone_thickness != '') ){
            phoneSizes = data.phone_length + 'x'
                       + data.phone_width + 'x'
                       + data.phone_thickness;
        }

        if(data.phone_battery !== undefined){
            phoneBattery = data.phone_battery;
        }

        newRowHtml += '<div class="'+ this.tableItemClass +'">';
        newRowHtml += phoneName;
        newRowHtml += '</div>';

        newRowHtml += '<div class="'+ this.tableItemClass +'">';
        newRowHtml += phoneScreenSize;
        newRowHtml += '</div>';

        newRowHtml += '<div class="'+ this.tableItemClass +'">';
        newRowHtml += phoneRam;
        newRowHtml += '</div>';

        newRowHtml += '<div class="'+ this.tableItemClass +'">';
        newRowHtml += phoneSizes;
        newRowHtml += '</div>';

        newRowHtml += '<div class="'+ this.tableItemClass +'">';
        newRowHtml += phoneBattery;
        newRowHtml += '</div>';

        let newRow = document.createElement('div');

        newRow.id = this.tableRowIdConst + rowKey;
        newRow.innerHTML  = newRowHtml;
        newRow.className = this.tableRowClass + ' ' + this.tableRowFilledClass;
        newRow.addEventListener('click', this.tableRowClickListener.bind(this, data, rowKey));

        let tableRowElement = document.querySelectorAll(this.tableRowSelector);

        if(rowKey <= tableRowElement.length){
            table.replaceChild(newRow, tableRowElement[rowKey]);
        } else {
            table.appendChild(newRow);
        }
    }

    insertFormData(data, rowKey){
        this.formReset(this.formSelector);
        for (let itemKey in data) {
            let field = document.querySelector('[name="' + itemKey + '"]');

            if(field.getAttribute('type') == 'checkbox'){
                if(data[itemKey] == 'yes'){
                    field.setAttribute('checked', 'checked');
                } else {
                    field.removeAttribute('checked');
                }
            }

            field.value = data[itemKey];
        }
        document.querySelector('[name="' + this.formIdInputName + '"]').value = rowKey;
    }

    setActiveRow(rowKey) {

        const activeClass = this.tableRowActiveClass;
        let tableRows = document.querySelectorAll(this.tableRowSelector),
            rowId = '#' + this.tableRowIdConst + rowKey,
            rowClassList = document.querySelector(rowId).classList;

        for(let i = 0; i < tableRows.length; i++){
            tableRows[i].classList.remove(activeClass);
        }
        rowClassList.toggle(activeClass);
        this.activateDeleteButton();
    }

    setRowsInactive(){
        let tableRows = document.querySelectorAll(this.tableRowSelector);

        for(let i = 0; i < tableRows.length; i++){
            tableRows[i].classList.remove(this.tableRowActiveClass);
        }
    }

    tableRowClickListener(data, rowKey) {
        this.setActiveRow(rowKey);
        this.insertFormData(data, rowKey);
    }

    addItem(){
        let form = new FormHandler,
            newRow = form.getFormData(),
            dataLength = Object.keys(this.data).length;

        this.data[dataLength] = newRow;

        this.insertTableRow(newRow, dataLength);
        this.formReset(this.formSelector);
        form.checkFilledForm();
        this.disableDeleteButton();

    }

    updateItem(rowId){
        let form = new FormHandler,
            row = form.getFormData();

        this.data[rowId] = row;
        this.insertTableRow(row, rowId);
        this.formReset(this.formSelector);
        form.checkFilledForm();
        this.disableDeleteButton();
    }


    deleteItem(currentItemId){
        let newRowHtml = '',
            colsNumber = 5,
            table = document.querySelector(this.tableSelector),
            newRow = document.createElement('div'),
            activeRow = document.querySelector('#' + this.tableRowIdConst + currentItemId);

        for(let i = 0; i < colsNumber; i++){
            newRowHtml += '<div class="'+ this.tableItemClass +'"></div>';
        }

        newRow.className = this.tableRowClass;
        newRow.innerHTML  = newRowHtml;

        table.removeChild(activeRow);
        table.appendChild(newRow);

        delete this.data[currentItemId];

        this.formReset(this.formSelector);
        this.disableDeleteButton();
    }


    activateDeleteButton(){
        document.querySelector(this.tableButtonDeleteSelector).removeAttribute('disabled')
    }


    disableDeleteButton(){
        document.querySelector(this.tableButtonDeleteSelector).setAttribute('disabled', 'disabled')
    }


    checkIdField() {
        let idField = document.querySelector('[name="' + this.formIdInputName + '"]').value;

        if(idField != ''){
            return idField;
        }

        return -1;
    }


    formReset(formSelector) {
        let formIdInputElement = document.querySelector('[name="' + this.formIdInputName + '"]');

        document.querySelector(formSelector).reset();

        formIdInputElement.value = '';

        let checkboxFields = document.querySelectorAll('input[type="checkbox"]');

        for(let i = 0; i < checkboxFields.length; i++){
            checkboxFields[i].removeAttribute('checked');
        }
    }


    hideLoader() {
        document.querySelector(this.LoaderSelector).reset();
    }


    listenersStart() {
        const formSelector = this.formSelector,
              formButtonSaveSelector = this.formButtonSaveSelector,
              tableButtonAddSelector = this.tableButtonAddSelector,
              tableButtonDeleteSelector = this.tableButtonDeleteSelector;

        let formField = document.querySelectorAll(this.formFieldSelector);

        //создание
        document.querySelector(tableButtonAddSelector).addEventListener("click", () => {
            this.formReset(formSelector);
            this.setRowsInactive();
            this.disableDeleteButton();
        });

        //Удаление
        document.querySelector(tableButtonDeleteSelector).addEventListener("click", () => {
            let currentItemId = this.checkIdField();
            if(currentItemId >= 0){
                this.deleteItem(currentItemId);
            }

        });

        //сохранение формы
        document.querySelector(formSelector).addEventListener("submit", (event) => {
            event.preventDefault();

            let IdField = this.checkIdField();

            if(IdField >= 0){
                this.updateItem(IdField);
            } else {
                this.addItem();
            }
        });

        //изменение полей формы
        for(let i = 0; i < formField.length; i++){
            formField[i].addEventListener("change", () => {
                let form = new FormHandler;

                form.checkFilledForm();

            });
        }


    }
}
