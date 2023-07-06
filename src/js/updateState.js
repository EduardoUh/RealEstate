(function () {
    const buttons = document.querySelectorAll('.update-state');
    const token = document.querySelector('meta[name="csrf-token"').getAttribute("content");

    buttons.forEach(button => button.addEventListener('click', async e => {
        const { propertyId } = e.target.dataset;
        const url = `/properties/${propertyId}`;

        try {
            const res = await fetch(url, {
                method: 'PUT',
                // headers are allways sent before the request
                headers: {
                    // Name it this wat because csrf spects the token with that name
                    'CSRF-Token': token
                }
            });

            const data = await res.json();

            const { newState } = data;

            if (newState) {
                /* 
                    bg-green-100 text-green-800
                    bg-yellow-100 text-yellow-800
                */
                e.target.classList.add('bg-green-100', 'text-green-800');
                e.target.classList.remove('bg-yellow-100', 'text-yellow-800');
                e.target.textContent = 'Published';
            }
            else {
                e.target.classList.add('bg-yellow-100', 'text-yellow-800');
                e.target.classList.remove('bg-green-100', 'text-green-800');
                e.target.textContent = 'Not Published';
            }
        }
        catch (e) {
            console.log(e);
        }
    })
    );
})()