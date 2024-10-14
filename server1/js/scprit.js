const CONTAINER_ID = 'content';
const TEXT_ROWS = 10;
const TEXT_COLS = 120;
const API_URL = 'http://localhost:3000/api';
const PUT = 'PUT';
const POST = 'POST';

// Button class
class Button {
    constructor(text, method, onClick) {
        this.text = text;
        this.method = method;  // Store the HTTP method (POST, PUT, etc.)
        this.element = document.createElement('button');
        this.element.textContent = this.text;  // Set the button's label
        this.element.onclick = onClick;  // Attach the click handler
    }
}

// TextArea class
class TextArea {
    constructor() {
        this.element = document.createElement('textarea');
        this.element.rows = TEXT_ROWS;  // Optional: set textarea size
        this.element.cols = TEXT_COLS;
    }

    giveString() {
        return this.element.value;  // Return the current value of the textarea
    }

    setString(value) {
        this.element.value = value;  // Set a new value in the textarea
    }
}

// QueryUI class to manage buttons and the shared text area
class QueryUI {
    constructor(textArea, buttons) {
        this.contentContainer = document.getElementById(CONTAINER_ID);
        this.textArea = textArea;
        this.buttons = buttons;
        this.url = API_URL;  // API base URL
    }

    // Method to handle HTTP requests
    sendRequest(endpoint, method, data = null, callback) {
        const xhr = new XMLHttpRequest();
        xhr.open(method, `${this.url}${endpoint}`, true);
        xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {  // Request is done
                if (xhr.status >= 200 && xhr.status < 300) {  // Successful response
                    callback(null, JSON.parse(xhr.responseText));
                } else {  // Error in response
                    callback(`Error: ${xhr.status}`, null);
                }
            }
        };

        // If data is provided (for POST, PUT), send it as a JSON string
        if (data) {
            xhr.send(JSON.stringify(data));
        } else {
            xhr.send();  // For GET requests, no body is sent
        }
    }

    // Method to render the UI
    render() {
        // Append the textarea
        this.contentContainer.appendChild(this.textArea.element);

        // Append the buttons and attach their handlers
        this.buttons.forEach(button => {
            button.element.onclick = () => {
                const data = this.textArea.giveString();  // Get content from textarea

                // Send a request based on the button's method
                this.sendRequest('/posts', button.method, { query: data }, (err, response) => {
                    if (err) {
                        console.error(err);
                    } else {
                        console.log(`${button.method} response:`, response);
                    }
                });
            };

            // Add button to the container
            this.contentContainer.appendChild(button.element);
        });
    }
}

// Create a shared textarea instance
let textArea = new TextArea();

// Create buttons for POST and PUT
let postButton = new Button('Post', POST);
let putButton = new Button('Put', PUT);

// Create QueryUI instance with shared text area and buttons
let queryUI = new QueryUI(textArea, [postButton, putButton]);

// Render the UI
queryUI.render();
