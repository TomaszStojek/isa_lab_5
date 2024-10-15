// String literals and constants
const BASE_URL = 'http://localhost:3000';
const INSERT_ENDPOINT = `${BASE_URL}/query`;
const HEADING_MAIN = 'Server 1 Client';
const HEADING_PART_A = 'Part A';
const HEADING_PART_B = 'Part B';
const INSERT_BTN_LABEL = 'Insert Dummy Data via POST';
const SUBMIT_BTN_LABEL = 'Submit Query';
const SQL_TEXTAREA_PLACEHOLDER = 'Enter SQL query here';
const RESPONSE_DEFAULT_TEXT = 'Response will be shown here: ';
const QUERY_ERROR_EMPTY = 'Query cannot be empty.';
const QUERY_ERROR_INVALID_KEYWORD = 'Invalid keyword.';
const QUERY_SUCCESS_VALID = 'Valid query.';
const CONTENT_TYPE_JSON = 'application/json';

// UI components
class UIComponent {
    constructor(tagName, id) {
        this.element = document.createElement(tagName);
        if (id) this.element.id = id;
    }

    render(parent) {
        parent.appendChild(this.element);
    }
}

class Header extends UIComponent {
    constructor(text, level = 1) {
        super(`h${level}`);
        this.element.textContent = text;
    }
}

class Button extends UIComponent {
    constructor(id, label, onClick) {
        super('button', id);
        this.element.textContent = label;
        this.element.addEventListener('click', onClick);
    }
}

class TextArea extends UIComponent {
    constructor(id, placeholder) {
        super('textarea', id);
        this.element.placeholder = placeholder;
    }

    getValue() {
        return this.element.value;
    }
}

class ResponseBox extends UIComponent {
    constructor(id) {
        super('div', id);
        this.element.innerHTML = RESPONSE_DEFAULT_TEXT;
    }

    update(response) {
        this.element.innerHTML = response;
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
        this.baseUrl = BASE_URL;
    }

    isValid() {
        if (!this.query) {
            return { valid: false, message: QUERY_ERROR_EMPTY, method: null };
        }
        const lowerQuery = this.query.toLowerCase();
        console.log(lowerQuery);
        const keyword = Object.keys(this.validKeywords).find(kw => lowerQuery.startsWith(kw));

        if (!keyword) {
            return { valid: false, message: QUERY_ERROR_INVALID_KEYWORD, method: null };
        }
        return { valid: true, message: QUERY_SUCCESS_VALID, method: this.validKeywords[keyword] };
    }

    buildEndpoint(method) {
        return method === 'GET'
            ? `${this.baseUrl}/query?sql=${encodeURIComponent(this.query)}`
            : INSERT_ENDPOINT;
    }

    getBody(method) {
        return method === 'GET' ? null : JSON.stringify({ query: this.query });
    }
}

class App {
    constructor() {
        this.container = document.getElementById('content');
        this.uiManager = new UIManager(this.container);
    }

    init() {
        // Create the main heading
        const mainHeading = new Header(HEADING_MAIN, 1);

        // Create Part A heading and Insert Dummy Data Button
        const partAHeading = new Header(HEADING_PART_A, 2);
        const insertButton = new Button('insertBtn', INSERT_BTN_LABEL, () => this.insertDummyData());

        // Create Part B heading, SQL Query TextBox, and Submit Button
        const partBHeading = new Header(HEADING_PART_B, 2);
        this.sqlQueryTextBox = new TextArea('sqlQuery', SQL_TEXTAREA_PLACEHOLDER);
        const submitQueryButton = new Button('submitQueryBtn', SUBMIT_BTN_LABEL, () => this.handleQuery());

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

    insertDummyData() {
        const patients = [
            new Patient('Sara Brown', '1901-01-01'),
            new Patient('John Smith', '1941-01-01'),
            new Patient('Jack Ma', '1961-01-30'),
            new Patient('Elon Musk', '1999-01-01')
        ];
        let query = `INSERT INTO patient (name, dateOfBirth) VALUES `;
        const values = patients.map(patient => `('${patient.name}', '${patient.dob}')`).join(", ");
        query += values;

        fetch(INSERT_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': CONTENT_TYPE_JSON
            },
            body: JSON.stringify({ query })
        }).then(response => response.text())
            .then(text => this.responseBox.update(text));
    }

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
            method: method,
            headers: {
                'Content-Type': CONTENT_TYPE_JSON
            },
            body: body
        });
        const text = await response.text();
        this.responseBox.update(text);
    }
}

const app = new App();
app.init();
