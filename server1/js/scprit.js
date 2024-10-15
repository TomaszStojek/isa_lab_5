
// Button class
class Button {
    constructor(id, label, onClick) {
        this.button = document.createElement('button');
        this.button.id = id;
        this.button.textContent = label;
        this.button.addEventListener('click', onClick);  // Attach click event handler
    }

    // Method to render the button inside a parent element
    render(parent) {
        parent.appendChild(this.button);
    }
}

// TextArea class
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
