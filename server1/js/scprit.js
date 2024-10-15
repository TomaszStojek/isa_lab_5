
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
        const submitQueryButton = new Button('submitQueryBtn', 'Submit Query', () => this.submitQuery());

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
        const data = patients.map(patient => patient.toJSON());
        fetch('http://localhost:3000/insert', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)

        }).then(response => response.text())
            .then(text => this.responseBox.update(text));
    }
}

const app = new App();
app.init();