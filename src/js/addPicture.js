import { Dropzone } from 'dropzone';


const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
// console.log(token);
// addPicture is the form id
Dropzone.options.addPicture = {
    /* This option changes the default message
    dictDefaultMessage: 'Arrastra y sube tus imágenes aquí',  */
    acceptedFiles: '.png, .jpg, .jpeg',
    maxFilesize: 5,
    maxFiles: 1,
    parallelUploads: 1,
    autoProcessQueue: false,
    addRemoveLinks: true,
    // Sets the remove message
    // dictRemoveFile: 'Borrar archivo',
    // sets the max files exceeded message
    // dictMaxFilesExceeded: 'El límite es un archivo'
    // headers are always sent before the request body
    headers: {
        // dropzone requires the token in this way
        'CSRF-Token': token
    },
    // name to communicate dropzone and server (see propertiesRoutes.js)
    paramName: 'picture',
    // init allow us to change some dropzone functionality, we're doing this because autoProcessQueue is set to false.
    // basically when dropzone starts it will add these new function to its functionality
    init: function () {
        // taking reference to dropzone
        const dropzone = this;
        // get the button
        const btnPublish = document.querySelector('#publish');

        btnPublish.addEventListener('click', () => {
            // saves the picture when the button is clicked
            dropzone.processQueue();
        });

        // we can't use express redirectioning because we are using this file which is js not node.js
        // so we gonna use js redirectioning and the next() function in the controller
        dropzone.on('queuecomplete', function () {
            if (dropzone.getActiveFiles().length == 0) {
                window.location.href = '/my-properties';
            }
        });
    }
};
