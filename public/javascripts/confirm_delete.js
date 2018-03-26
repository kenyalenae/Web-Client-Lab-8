// Find the "Delete completed tasks" button
var deleteCompleted = document.querySelectorAll('.delete-done-button');

// when the user clicks the "Delete completed tasks" button, create message to say "are you sure"
deleteCompleted.forEach(function(button){

    button.addEventListener('click', function(ev){

        // show the confirm message
        var okToDelete = confirm("Are you sure?");

        // if user presses no, this will prevent form from submitting
        if (!okToDelete) {
            ev.preventDefault(); // prevent the click event from happening
        }
    })
});