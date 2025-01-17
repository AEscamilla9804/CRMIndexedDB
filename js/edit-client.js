import { Database, Alert } from "./classes.js";

(function () {
    // -------------------------------------- Variables --------------------------------------
    const nameField = document.querySelector('#name');
    const emailField = document.querySelector('#email');
    const addressField = document.querySelector('#address');
    const zipcodeField = document.querySelector('#zipcode');
    const phoneField = document.querySelector('#phone');

    const form = document.querySelector('#form');

    let clientID;

    const database = new Database();

    // -------------------------------------- Events --------------------------------------
    document.addEventListener('DOMContentLoaded', () => {
        // Connect to the database
        database.loadDB();

        // Verify ID from URL
        const urlParameters = new URLSearchParams(window.location.search);
        clientID = Number(urlParameters.get('id'));   // From string to number

        if (clientID) {
            setTimeout(() => {
                database.isolateClient(clientID, (clientInfo) => {
                    if (clientInfo) {
                        fillForm(clientInfo);
                    } else {
                        console.log('No client found');
                    }
                });
            }, 100);
        }

        // Update client's iformation
        form.addEventListener('submit', validateForm);
    });

    // -------------------------------------- Functions --------------------------------------
    function validateForm(e) {
        e.preventDefault();

        // Validate empty fields
        if (nameField.value === '' || emailField.value === '' || addressField.value === '' || zipcodeField.value === '' || phoneField.value === '') {
            new Alert({
                message: 'All fields required',
                type: 'error',
                reference: form
            })
            return;
        }

        // Validate email address
        let validEmail = emailValidation(emailField.value);

        if( !validEmail ) {
            new Alert({
                message: 'Invalid email address',
                type: 'error',
                reference: form
            });
            return;
        }

        // Update client's information
        const updatedClient = {
            name: nameField.value,
            email: emailField.value,
            address: addressField.value,
            zipcode: zipcodeField.value,
            phone: phoneField.value,
            id: clientID
        }

        database.updateClient(updatedClient, form);
    }

    function emailValidation(email) {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        let validEmail = emailRegex.test(email);

        return validEmail;
    }

    function fillForm(clientInfo) {
        const { name, email, address, zipcode, phone } = clientInfo;
        
        // Fill the form with the client's information
        nameField.value = name;
        emailField.value = email;
        addressField.value = address;
        zipcodeField.value = zipcode;
        phoneField.value = phone;
    }
})();