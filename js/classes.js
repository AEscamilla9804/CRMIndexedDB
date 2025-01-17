let DB;

export class Database {    
    createDB() {
        // Initialize Database
        const createDB = window.indexedDB.open('clients', 1);

        // Error case
        createDB.onerror = function() {
            console.log('There was an error during database creation');
        };

        // Success case
        createDB.onsuccess = function() {
            console.log('Database creation successful');

            DB = createDB.result;
        };

        // Define schema
        createDB.onupgradeneeded = function(e) {
            const db = e.target.result;
            const objectStore = db.createObjectStore('clients', {
                keyPath: 'id',
                autoIncrement: true
            });

            // Define columns
            objectStore.createIndex('name', 'name', { unique: false });
            objectStore.createIndex('email', 'email', { unique: true });
            objectStore.createIndex('address', 'address', { unique: false });
            objectStore.createIndex('zipcode', 'zipcode', { unique: false });
            objectStore.createIndex('phone', 'phone', { unique: false });
            objectStore.createIndex('id', 'id', { unique: true });

            console.log('Database created and ready');
        }
    }

    loadDB() {
        const loadConnection = window.indexedDB.open('clients', 1);

        // Error case
        loadConnection.onerror = function() {
            console.log('Connection failed');
        };

        // Success case
        loadConnection.onsuccess = function() {
            console.log('Connecction successful');

            DB = loadConnection.result;
        };
    }

    createNewClient(client, reference) {
        const transaction = DB.transaction(['clients'], 'readwrite');
        const objectStore = transaction.objectStore('clients');

        // Insert client on database
        objectStore.add(client);

        // Error case
        transaction.onerror = function() {
            console.log(`Registration Failed. Email's been already taken`);
            new Alert({
                message: `Registration Failed. Email's been already taken`,
                type: 'error',
                reference: reference
            });
        }

        // Success case
        transaction.oncomplete = function() {
            console.log('Client Registered Successfully');
            new Alert({
                message: 'Client Registered Successfully',
                type: 'success',
                reference: reference
            });

            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
        }
    }

    printClients(reference) {
        // Connect to database
        const loadConnection = window.indexedDB.open('clients', 1);

        loadConnection.onerror = function() {
            console.log('Error extablishing the connection');
        }

        loadConnection.onsuccess = function() {
            // Clear previous HTML
            while (reference.firstChild) {
                reference.removeChild(reference.firstChild);
            }

            // Read the content from the database
            const objectStore = DB.transaction('clients').objectStore('clients');
            console.log(objectStore);

            // Element listing using a cursor
            objectStore.openCursor().onsuccess = function(e) {
                const cursor = e.target.result;

                if (cursor) {
                    const { name, email, address, zipcode, phone, id } = cursor.value;

                    const row = document.createElement('TR');

                    row.innerHTML= `
                        <td class="client-info">
                            <p class="client-name">${name}</p>
                            <p class="client-email">${email}</p>
                        </td>

                        <td class="client-shipping">
                            <p class="client-address">${address}</p>
                            <p class="client-zipcode">ZIP ${zipcode}</p>
                        </td>

                        <td>
                            <p class="client-phone">${phone}</p>
                        </td>

                        <td class="buttons">
                            <button class="edit"><a href="edit-client.html?id=${id}">Edit</a></button>
                            <button class="delete"><a href="#" class="delete-client" data-client="${id}">Delete</a></button>
                        </td>
                    `;

                    // Insert Element on HTML
                    reference.appendChild(row);

                    // Next element
                    cursor.continue();
                } else {
                    console.log('There are no more records');
                }
            }
        }
    }

    isolateClient(id, callback) {
        const transaction = DB.transaction(['clients'], 'readonly');
        const objectStore = transaction.objectStore('clients');

        const client = objectStore.openCursor();

        // Success Case
        client.onsuccess = function(e) {
            const cursor = e.target.result;

            if (cursor) {
                if (cursor.value.id === id) {
                    let clientInfo = cursor.value;
                    callback(clientInfo);
                } else {
                    cursor.continue();
                }
            } else {
                console.log('Client not found');
                callback(null);
            }
        };

        // Error case
        client.onerror = function() {
            console.log('Error occurred while searching for client');
            callback(null);
        };
    }

    updateClient(client, reference) {
        const transaction = DB.transaction(['clients'], 'readwrite');
        const objectStore = transaction.objectStore('clients');

        // Insert client on database
        objectStore.put(client);

        // Error
        transaction.onerror = function() {
            console.log(`Client's information couldn't be updated`);
            new Alert({
                message: `Client's information couldn't be updated`,
                type: 'error',
                reference: reference
            });
        }

        // Success
        transaction.oncomplete = function() {
            console.log('Changes Saved Successfully');
            new Alert({
                message: 'Changes Saved Successfully',
                type: 'success',
                reference: reference
            });

            setTimeout(() => {
                window.location.href = 'index.html';
            }, 3000);
        }
    }

    deleteClient(id, reference) {
        console.log(reference)
        const transaction = DB.transaction(['clients'], 'readwrite');
        const objectStore = transaction.objectStore('clients');

        objectStore.delete(id);

        // Error
        transaction.onerror = function() {
            console.log(`Client couldn't be deleted`);
        } 

        // Success
        transaction.oncomplete = () => {
            console.log('Client successfully deleted');
            this.printClients(reference);
        }
    }
}

export class Alert {
    constructor ({message, type, reference}) {
        this.message = message,
        this.type = type,
        this.reference = reference

        this.displayAlert()
    }

    displayAlert() {
        // Eliminate previous notifications
        const prevAlert = document.querySelector('.alert');
        prevAlert?.remove();

        // Create notification
        const notification = document.createElement('P');
        notification.classList.add('alert');

        // Validate type of alert
        this.type === 'error' ? notification.classList.add('error') : notification.classList.add('success');

        // Message
        notification.textContent = this.message;

        // Insert on the HTML
        this.reference.appendChild(notification);

        // Remove alert from screen after 3s
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}