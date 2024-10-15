
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
// // QueryUI class to manage buttons and the shared text area
// class QueryUI {
//     constructor(textArea, buttons) {
//         this.contentContainer = document.getElementById(CONTAINER_ID);
//         this.textArea = textArea;
//         this.buttons = buttons;
//         this.url = API_URL;  // API base URL
//     }

//     // Method to handle HTTP requests
//     sendRequest(endpoint, method, data = null, callback) {
//         const xhr = new XMLHttpRequest();
//         xhr.open(method, `${this.url}${endpoint}`, true);
//         xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');

//         xhr.onreadystatechange = function () {
//             if (xhr.readyState === 4) {  // Request is done
//                 if (xhr.status >= 200 && xhr.status < 300) {  // Successful response
//                     callback(null, JSON.parse(xhr.responseText));
//                 } else {  // Error in response
//                     callback(`Error: ${xhr.status}`, null);
//                 }
//             }
//         };

//         // If data is provided (for POST, PUT), send it as a JSON string
//         if (data) {
//             xhr.send(JSON.stringify(data));
//         } else {
//             xhr.send();  // For GET requests, no body is sent
//         }
//     }

//     // Method to render the UI
//     render() {
//         // Append the textarea
//         this.contentContainer.appendChild(this.textArea.element);

//         // Append the buttons and attach their handlers
//         this.buttons.forEach(button => {
//             button.element.onclick = () => {
//                 const data = this.textArea.giveString();  // Get content from textarea

//                 // Send a request based on the button's method
//                 this.sendRequest('/posts', button.method, { query: data }, (err, response) => {
//                     if (err) {
//                         console.error(err);
//                     } else {
//                         console.log(`${button.method} response:`, response);
//                     }
//                 });
//             };

//             // Add button to the container
//             this.contentContainer.appendChild(button.element);
//         });
//     }
// }

// // Create a shared textarea instance
// let textArea = new TextArea();

// // Create buttons for POST and PUT
// let postButton = new Button('Post', POST);
// let putButton = new Button('Put', PUT);

// // Create QueryUI instance with shared text area and buttons
// let queryUI = new QueryUI(textArea, [postButton, putButton]);

// // Render the UI
// queryUI.render();
