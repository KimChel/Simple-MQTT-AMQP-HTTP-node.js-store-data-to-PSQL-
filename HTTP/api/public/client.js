console.log('Client side code running');

const button = document.getElementById('myButton');
button.addEventListener('click', (e) => {

    console.log('Button clicked');
    fetch('/clicked', { method: 'POST' })
        .then(function (response) {
            if (response.ok) {
                console.log('click was recorded')
                return;
            }
            throw new Error('Request failed.');
        })
        .catch(function (error) {
            console.log(error);
        })
})