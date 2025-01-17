import { Database } from "./classes.js";

(function () {
    // -------------------------------------- Variables --------------------------------------
    const clientList = document.querySelector('#client-list');
    const database = new Database();

    // -------------------------------------- Events --------------------------------------
    document.addEventListener('DOMContentLoaded', () => {
        database.createDB();
        database.printClients(clientList);

        clientList.addEventListener('click', isolateID);
    })

    // -------------------------------------- Functions --------------------------------------
    function isolateID(e) {
        if (e.target.classList.contains('delete-client')) {
            // Obtain the ID from the client who's going to be deleted
            const deleteId = Number(e.target.dataset.client);

            if (confirm('Do you wish to delete this client?')) {
                database.deleteClient(deleteId, clientList);
            }
        }
    }
})();