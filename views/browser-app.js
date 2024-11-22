const formAlertDOM = document.querySelector(".form-alert");
const tasksDOM = document.querySelector(".tasks");
const loadingDOM = document.querySelector(".loading-text");
const formDOM = document.querySelector(".task-form");
const taskInputName = document.querySelector(".task-name");
const taskInputTransactionDescription = document.querySelector(
  ".task-TransactionDescription"
);
const taskDateTimeDOM = document.querySelector(".task-edit-dateTime");
const taskInputAmt = document.querySelector(".task-Amt");
const taskInputDebitCredit = document.querySelector(".task-DebitCredit");

function setCurrenTransactionDateTime() {
  const now = new Date();
  // Get the timezone offset in minutes and convert it to milliseconds
  const timezoneOffset = now.getTimezoneOffset() * 60 * 1000;
  // Adjust the current time by the timezone offset
  const localDate = new Date(now.getTime() - timezoneOffset);
  // Format date and time as 'YYYY-MM-DDTHH:MM'
  const formattedDateTime = localDate.toISOString().slice(0, 16);
  document.querySelector(".task-edit-dateTime").value = formattedDateTime;
}

// Call the function when the page loads
window.onload = setCurrenTransactionDateTime;

const showTasks = async () => {
  loadingDOM.style.visibility = "visible";
  try {
    const {
      data: { tasks },
    } = await axios.get("/api/tasks/d");
    if (tasks.length < 1) {
      tasksDOM.innerHTML = '<h5 class="empty-list">No tasks in your list</h5>';
      loadingDOM.style.visibility = "hidden";
      return;
    }
    const allTasks = tasks
      .map((task) => {
        const {
          _id: taskID,
          name,
          TransactionDescription,
          DebitCredit,
          Amt,
          TransactionDate,
        } = task;
        return `<div class="single-task">
<h5><span><i class="far fa-check-circle"></i></span>
     ${TransactionDate.substring(0, 10)}  ${new Date(
          TransactionDate
        ).toLocaleString("en-US", {
          hour: "numeric",
          minute: "numeric",
          hour12: true,
        })}: ${name} : ${TransactionDescription} : ${DebitCredit} : Amt ${Amt}</h5>
<div class="task-links">
<!-- edit link -->
<a href="task.html?id=${taskID}"  class="edit-link">
<i class="fas fa-edit"></i>
</a>
<!-- delete btn -->
<button type="button" class="delete-btn" data-id="${taskID}">
<i class="fas fa-trash"></i>
</button>
</div>
</div>`;
      })
      .join("");
    tasksDOM.innerHTML = allTasks;
  } catch (error) {
    tasksDOM.innerHTML =
      '<h5 class="empty-list">There was an error, please try later....</h5>';
  }
  loadingDOM.style.visibility = "hidden";
};

showTasks();

// delete task /api/tasks/:id

tasksDOM.addEventListener("click", async (e) => {
  const el = e.target;
  if (el.parentElement.classList.contains("delete-btn")) {
    loadingDOM.style.visibility = "visible";
    const id = el.parentElement.dataset.id;
    try {
      const userConfirmed = confirm(
        "Are you sure you want to delete this transaction?"
      );
      if (!userConfirmed) {
        // If the user cancels, prevent the delete action

        alert("Deletion canceled");
      } else {
        // Proceed with the deletion
        await axios.delete(`/api/tasks/${id}`);
        showTasks();
        alert("Item deleted successfully");
        // You can add your deletion logic here
      }
    } catch (error) {
      console.log(error);
    }
  }
  loadingDOM.style.visibility = "hidden";
});

// form

formDOM.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = taskInputName.value;
  const TransactionDescription = taskInputTransactionDescription.value;
  const inputValue = taskDateTimeDOM.value;
  const TransactionDate = new Date(inputValue);
  console.log("TransactionDateTime:", TransactionDate);
  let DebitCredit = taskInputDebitCredit.value.toLowerCase();
  let Amt = Number(taskInputAmt.value);
  if (DebitCredit.includes("got")) {
    Amt = Math.abs(Amt) * -1;
  }
  if (DebitCredit.includes("gave")) {
    Amt = Math.abs(Amt) * 1;
  }

  try {
    const userConfirmed = confirm("Are you sure you want to Add this entry?");
    if (!userConfirmed) {
      // If the user cancels, prevent the delete action

      alert("Entry canceled");
    } else {
      // Proceed with the deletion

      await axios.post("/api/tasks", {
        name,
        TransactionDescription,
        DebitCredit,
        Amt,
        TransactionDate,
      });

      showTasks();
      alert("Entry Added successfully");
      // You can add your deletion logic here
    }

    taskInputName.value = "";
    taskInputTransactionDescription.value = "";
    taskInputDebitCredit.value = "";
    taskInputAmt.value = "";
    formAlertDOM.style.display = "block";
    formAlertDOM.textContent = `success, Entry added`;
    formAlertDOM.classList.add("text-success");
  } catch (error) {
    formAlertDOM.style.display = "block";
    formAlertDOM.innerHTML = `error, please try again`;
  }
  setTimeout(() => {
    formAlertDOM.style.display = "none";
    formAlertDOM.classList.remove("text-success");
  }, 1500);
});
