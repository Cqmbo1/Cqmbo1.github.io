
        const tools = {
            'js-tester': {name: 'JS Tester', desc: 'A simple but effective javascript tester and editor.'},
            'ip-gen':{name: 'Random IP Gen', desc: 'A great custom IP Address Generator!'},
            'html-tester':{name: 'HTML Tester', desc: 'An easy-to-use HTML tester.'},
            'unicode':{name: 'Random Unicode Gen', desc: 'An effective custom unicode generator.'}
        }




        const dropdownContainer = document.getElementById('tool-list');




        Object.entries(tools).forEach(([key, { name, desc }]) => {
            const a = document.createElement('a');
            a.href = `https://cqmbo1.github.io/tools/${key}`;
            a.textContent = name;
            a.title = desc;
            dropdownContainer.appendChild(a);
        });
    