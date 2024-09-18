window.addEventListener('load', () => {
    const greeter = document.createElement('span');
    greeter.textContent = 'Hello World!';
    document.body.appendChild(greeter);

    const greeter2 = document.createElement('span');
    greeter2.textContent = 'Example of a basic javascript app for anura';
    document.body.appendChild(greeter2);

    document.body.style = 'background: white';
});
