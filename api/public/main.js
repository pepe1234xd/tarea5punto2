window.onload = function (ev) {

    App();

    /** @type {HTMLFormElement} */
    const form = document.getElementById('transactions-form');

    const select = Select();

    /** @type {HTMLButtonElement} */
    const saveButton = document.getElementById('transactions-form-save-button');
    saveButton.onclick = function (ev) {
        if (form.checkValidity()) {
            const inputs = form.querySelectorAll('input, select');
            const object = {};
            for (const input of inputs) {
                const value = input.value;
                const key = input.name;
                object[key] = value; // Object.defineProperty(object, key, { value: value })            
            }
            TransactionsService.save(object);
        } else {
            form.reportValidity();
        }
    }

    /** @type {HTMLButtonElement} */
    const withdrawButton = document.getElementById('transactions-form-withdraw-button');    
}

function App() {}

function Select() {
    /** @type {HTMLSelectElement} */
    const select = document.getElementById('transactions-form-accounts');

    const populate = async function () {
        const accounts = await AccountsService.all();
        select.innerHTML = '';
        for (const account of accounts) {
            const option = document.createElement('option');
            option.value = account.account_id;
            option.innerText = account.name;
            select.appendChild(option);
        }
    }
    populate();

    return select;
}

function Form() {}

class TransactionsService {
    static baseUrl = 'http://localhost:5001/v1/transactions';

    static async save(transaction) {
        await fetch(TransactionsService.baseUrl, {
            method: 'POST',
            headers: {
                'Encondig': 'UTF-8',
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(transaction)
        })
    }
}

class AccountsService {
    static baseUrl = 'http://localhost:5001/v1/accounts';

    static async all() {
        const response = await fetch(AccountsService.baseUrl, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            },
        })
        switch (response.status) {
            case 200:
                return await response.json();        
            default:
                throw Error('Server Error');
        }
    }
}