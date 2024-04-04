// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
// let nextId = JSON.parse(localStorage.getItem("nextId"));
const form = $('#submitForm');


// Todo: create a function to create a task card
function createTaskCard(task) {
    const card = $('<div>');
    card.attr('class', 'card draggable');
    card.attr('data-project-id', task.id);

    const cardHeader = $('<h4>');
    cardHeader.attr('class', 'card-header');
    cardHeader.text(task.taskTitle);

    const cardBody = $('<div>');
    cardBody.attr('class', 'card-body');

    const cardDescription = $('<p>');
    cardDescription.attr('class', 'card-text');
    cardDescription.text(task.taskDescription);

    const cardDueDate = $('<p>');
    cardDueDate.attr('class', 'card-text');
    cardDueDate.text(task.taskDueDate);

    const button = $('<button>');
    button.attr('class', 'btn btn-danger delete');
    button.text('Delete');
    button.attr('data-project-id', task.id);


    if (task.taskDueDate && task.status !== 'done') {
        const now = dayjs();
        const taskDueDate = dayjs(task.taskDueDate, 'DD/MM/YYYY');


        if (now.isSame(taskDueDate, 'day')) {
            card.addClass('bg-warning text-white');
        } else if (now.isAfter(taskDueDate)) {
            card.addClass('bg-danger text-white');
            button.addClass('border-light');
        }
    }

    cardBody.append(cardDescription, cardDueDate, button);
    card.append(cardHeader, cardBody);

    return card;
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {

    // Empty the card slots.
    $('#todo-cards').empty();
    $('#in-progress-cards').empty();
    $('#done-cards').empty();

    for (const task of taskList) {
        if (task.status === 'to-do') {
            $('#todo-cards').append(createTaskCard(task));
        } else if (task.status === 'in-progress') {
            $('#in-progress-cards').append(createTaskCard(task));
        } else {
            $('#done-cards').append(createTaskCard(task));
        }
    }

    $('.draggable').draggable({
        opacity: 0.7,
        zIndex: 100,
        // ? This is the function that creates the clone of the card that is dragged. This is purely visual and does not affect the data.
        helper: function (e) {
          // ? Check if the target of the drag event is the card itself or a child element. If it is the card itself, clone it, otherwise find the parent card  that is draggable and clone that.
          const original = $(e.target).hasClass('ui-draggable')
            ? $(e.target)
            : $(e.target).closest('.ui-draggable');
          // ? Return the clone with the width set to the width of the original card. This is so the clone does not take up the entire width of the lane. This is to also fix a visual bug where the card shrinks as it's dragged to the right.
          return original.clone().css({
            width: original.outerWidth(),
          });
        },
      });
}

// Todo: create a function to handle adding a new task
function handleAddTask(event){

    event.preventDefault();

    const newTask = {
        id: crypto.randomUUID(),
        taskTitle: $('#userTitle').val(),
        taskDueDate: $('#userDueDate').val(),
        taskDescription: $('#userDescription').val(),
        status: 'to-do',
    };
    taskList.push(newTask);
    localStorage.setItem('tasks', JSON.stringify(taskList));

    $('#userTitle').val(' ');
    $('#userDueDate').val(' ');
    $('#userDescription').val(' ');
    renderTaskList();
}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event){

}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
    const tasks = JSON.parse(localStorage.getItem("tasks"));

    const taskId = ui.draggable[0].dataset.projectID;

    const newStatus = event.target.id;

    for (let task of tasks) {
        if (task.id === taskId) {
            task.status = newStatus;
        }
    }

    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTaskList();
}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
    form.on('click', handleAddTask);

    renderTaskList();

    $('.lane').droppable({
        accept: '.draggable',
        drop: handleDrop,
      });

    $( function() {
        $( "#userDueDate" ).datepicker();
      } );
});

