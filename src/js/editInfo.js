(function () {
    const editButton = document.querySelector('#edit_button');
    const buttonsContainer = document.querySelector('#buttons_container');
    const cancelEditionButton = document.querySelector('#cancel_edit');
    // const submitEditionButton = document.querySelector('#submit_edit');
    const userName = document.querySelector('#name');
    const email = document.querySelector('#email');
    const userNameValue = userName.value;
    const emailValue = email.value;

    editButton.addEventListener('click', () => {
        buttonsContainer.classList.remove('hidden');
        editButton.classList.add('hidden')
        userName.readOnly = false;
        email.readOnly = false;
    });

    cancelEditionButton.addEventListener('click', () => {
        buttonsContainer.classList.add('hidden');
        editButton.classList.remove('hidden');
        userName.value = '';
        email.value = '';
        userName.value = userNameValue;
        email.value = emailValue;
        userName.readOnly = true;
        email.readOnly = true;
    })

})()