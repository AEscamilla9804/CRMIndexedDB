import { Database, Alert } from "./classes.js";

(function () {
    // -------------------------------------- Variables --------------------------------------
    const form = document.querySelector('#form');
    const database = new Database();

    // -------------------------------------- Events --------------------------------------
    document.addEventListener('DOMContentLoaded', () => {
        database.loadDB();

        form.addEventListener('submit', validateClient);
    });

    // -------------------------------------- Functions --------------------------------------
    function validateClient(e) {
        e.preventDefault();

        // Read all fields
        const name = document.querySelector('#name').value.trim();
        const email = document.querySelector('#email').value.trim();
        const address = document.querySelector('#address').value.trim();
        const zipcode = document.querySelector('#zipcode').value.trim();
        const phone = document.querySelector('#phone').value.trim();

        // Validate Empty Fields
        if (name === '' || email === '' || address === '' || zipcode === '' || phone === '') {
            new Alert({
                message: 'All fields required',
                type: 'error',
                reference: form
            })
            return;
        }

        // Validate email address
        let validEmail = emailValidation(email);

        if( !validEmail ) {
            new Alert({
                message: 'Invalid email address',
                type: 'error',
                reference: form
            });
            return;
        }

        // Create an object with the client's info
        const client = { name, email, address, zipcode, phone, id: Date.now() };     // Object litheral enhancement

        // Add new client to the database
        database.createNewClient(client, form);
    }

    function emailValidation(email) {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        let validEmail = emailRegex.test(email);

        return validEmail;
    }
})();