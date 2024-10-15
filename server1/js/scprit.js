
// UI components
class Header {
    constructor(text, level = 1) {
        this.heading = document.createElement(`h${level}`);
        this.heading.textContent = text;
    }

    render(parent) {
        parent.appendChild(this.heading);
    }
}

class Button {
    constructor(id, label, onClick) {
        this.button = document.createElement('button');
        this.button.id = id;
        this.button.textContent = label;
        this.button.addEventListener('click', onClick);
    }

    render(parent) {
        parent.appendChild(this.button);
    }
}

class TextArea {
    constructor(id, placeholder) {
        this.textArea = document.createElement('textarea');
        this.textArea.id = id;
        this.textArea.placeholder = placeholder;

    }

    getValue() {
        return this.textArea.value;
    }
    render(parent) {
        parent.appendChild(this.textArea);
    }
}

class ResponseBox {
    constructor(id) {
        this.responseBox = document.createElement('div');
        this.responseBox.id = id;
        this.responseBox.innerHTML = 'Response will be shown here: ';
    }
    update(response) {
        this.responseBox.innerHTML = response;
    }

    render(parent) {
        parent.appendChild(this.responseBox);
    }
}


class UIManager {
    constructor(container) {
        this.container = container;
    }

    render(components) {
        components.forEach(component => {
            component.render(this.container);
        });
    }

}

class Patient {
    constructor(name, dob) {
        this.name = name;
        this.dob = dob;
    }

    toJSON() {
        return {
            name: this.name,
            dob: this.dob
        };
    }
}

class SQLRequest {
    constructor(query) {
        this.query = query.trim();
        this.validKeywords = {
            select: 'GET',
            insert: 'POST',
        };
        this.baseUrl = 'http://localhost:3000';
    }

    isValid() {
        if (!this.query) {
            return { valid: false, message: 'Query cannot be empty.', method: null };
        }
        const lowerQuery = this.query.toLowerCase();
        console.log(lowerQuery);
        const keyword = Object.keys(this.validKeywords).find(kw => lowerQuery.startsWith(kw));

        if (!keyword) {
            return { valid: false, message: 'Invalid keyword.', method: null };
        }
        return { valid: true, message: 'Valid query.', method: this.validKeywords[keyword] };
    }
    buildEndpoint(method) {
        return method === 'GET'
            ? `${this.baseUrl}/query?sql=${encodeURIComponent(this.query)}`
            : `${this.baseUrl}/query`;  // For POST, PUT, DELETE, just return the endpoint
    }

    getBody(method) {
        return method === 'GET' ? null : JSON.stringify({ query: this.query });
    }
}

class App {
    constructor() {
        this.container = document.getElementById('content');  // Main container to hold UI
        this.uiManager = new UIManager(this.container);  // UIManager instance
    }

    // Initialize the app and display the UI components
    init() {
        // Create the main heading
        const mainHeading = new Header('Server 1 Client', 1);

        // Create Part A heading and Insert Dummy Data Button
        const partAHeading = new Header('Part A', 2);
        const insertButton = new Button('insertBtn', 'Insert Dummy Data via POST', () => this.insertDummyData());

        // Create Part B heading, SQL Query TextBox, and Submit Button
        const partBHeading = new Header('Part B', 2);
        this.sqlQueryTextBox = new TextArea('sqlQuery', 'Enter SQL query here');
        const submitQueryButton = new Button('submitQueryBtn', 'Submit Query', () => this.handleQuery());

        // Create the ResponseBox for displaying server responses
        this.responseBox = new ResponseBox('response');

        // Render all UI components using the UIManager
        this.uiManager.render([
            mainHeading,
            partAHeading, insertButton,
            partBHeading, this.sqlQueryTextBox, submitQueryButton,
            this.responseBox
        ]);
    }

    // Method to insert dummy data via POST request
    insertDummyData() {
        const patients = [
            new Patient('Sara Brown', '1901-01-01'),
            new Patient('John Smith', '1941-01-01'),
            new Patient('Jack Ma', '1961-01-30'),
            new Patient('Elon Musk', '1999-01-01')
        ];
        let query = `INSERT INTO patients (name, dateOfBirth) VALUES `;
        const values = patients.map(patient => `('${patient.name}', '${patient.dateOfBirth}')`).join(", ");
        query += values;

        fetch('http://localhost:3000/query', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ query })
        }).then(response => response.text())
            .then(text => this.responseBox.update(text));
    }

    // Method to submit SQL query
    async handleQuery() {
        const query = this.sqlQueryTextBox.getValue();
        const sqlRequest = new SQLRequest(query);
        const validationResult = sqlRequest.isValid();

        if (!validationResult.valid) {
            this.responseBox.update(validationResult.message);
            return;
        }

        const method = validationResult.method;
        const endpoint = sqlRequest.buildEndpoint(method);
        const body = sqlRequest.getBody(method);

        const response = await fetch(endpoint, {
            method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: body
        });
        const text = await response.text();
        this.responseBox.update(text);
    }

}

const app = new App();
app.init();