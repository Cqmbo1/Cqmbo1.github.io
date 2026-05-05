(function() {
    // 1. Inject the CSS Styles
    const style = document.createElement('style');
    style.textContent = `
        .dropdown {
            position: relative;
            display: inline-block;
        }

        .dropdown-content {
            display: none;
            position: absolute;
            background-color: #ffffff;
            min-width: 200px;
            box-shadow: 0px 8px 25px rgba(0,0,0,0.15);
            z-index: 1000;
            border-radius: 8px;
            margin-top: -5px;
            overflow: hidden;
            border: 1px solid #add8e6;
        }

        .dropdown:hover .dropdown-content {
            display: block;
            animation: fadeIn 0.3s ease;
        }

        .dropdown-content a {
            color: #444;
            padding: 12px 16px;
            text-decoration: none;
            display: block;
            text-align: left;
            font-size: 15px;
            transition: background 0.2s, color 0.2s;
        }

        .dropdown-content a:hover {
            background-color: #f0f9ff;
            color: #0DC6D0;
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }

        #main-text {
            margin-top: 40px;
            line-height: 1.6;
        }
    `;
    document.head.appendChild(style);

    // 2. Define the Tools Data
    const tools = {
        'js-tester': {name: 'JS Tester', desc: 'A simple but effective javascript tester and editor.'},
        'ip-gen': {name: 'Random IP Gen', desc: 'A great custom IP Address Generator!'},
        'html-tester': {name: 'HTML Tester', desc: 'An easy-to-use HTML tester.'},
        'unicode': {name: 'Random Unicode Gen', desc: 'An effective custom unicode generator.'},
        'base64': {name: 'Base64 En/Decode', desc: 'Advanced Base64 Encode/Decode.'}
    };

    // 3. Build the Dropdown
    const dropdownContainer = document.getElementById('tool-list');

    if (dropdownContainer) {
        Object.entries(tools).forEach(([key, { name, desc }]) => {
            const a = document.createElement('a');
            a.href = `https://cqmbo1.github.io/tools/${key}`;
            a.textContent = name;
            a.title = desc;
            dropdownContainer.appendChild(a);
        });
    } else {
        console.warn("Dropdown container '#tool-list' not found on this page.");
    }
})();