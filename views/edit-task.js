const taskIdDOM = document.querySelector(".task-edit-id");
const taskNameDOM = document.querySelector(".task-edit-name");
const taskTransactionDescriptionDOM = document.querySelector(
  ".task-edit-TransactionDescription"
);
const taskDateTimeDOM = document.querySelector(".task-edit-dateTime");
const taskDebitCreditDOM = document.querySelector(".task-edit-DebitCredit");
const taskAmtDOM = document.querySelector(".task-edit-Amt");

const editFormDOM = document.querySelector(".single-task-form");
const editBtnDOM = document.querySelector(".task-edit-btn");
const formAlertDOM = document.querySelector(".form-alert");
const params = window.location.search;
const id = new URLSearchParams(params).get("id");
let tempDesc;

const showTask = async () => {
  try {
    const {
      data: { task },
    } = await axios.get(`/api/tasks/${id}`);
    const {
      _id: taskID,

      name,
      TransactionDescription,
      DebitCredit,
      Amt,
      TransactionDate,
    } = task;

    const TransactionDateTime = new Date(TransactionDate);
    const localISOTime = new Date(
      TransactionDateTime.getTime() -
        TransactionDateTime.getTimezoneOffset() * 60000
    )
      .toISOString()
      .slice(0, 16);
    const formattedDateTime = localISOTime;
    taskDateTimeDOM.value = formattedDateTime;
    taskIdDOM.textContent = taskID;
    taskNameDOM.value = name;
    taskTransactionDescriptionDOM.value = TransactionDescription;
    taskDebitCreditDOM.value = DebitCredit;
    taskAmtDOM.value = Amt;
  } catch (error) {
    console.log(error);
  }
};

showTask();

editFormDOM.addEventListener("submit", async (e) => {
  editBtnDOM.textContent = "Loading...";
  e.preventDefault();

  try {
    const taskName = taskNameDOM.value;
    const taskTransactionDescription = taskTransactionDescriptionDOM.value;
    const inputValue = taskDateTimeDOM.value;
    const taskDate = new Date(inputValue);
    console.log("TransactionDateTime:", taskDate);
    const taskDebitCredit = taskDebitCreditDOM.value;
    const taskAmt = taskAmtDOM.value;

    const {
      data: { task },
    } = await axios.patch(`/api/tasks/${id}`, {
      name: taskName,
      TransactionDescription: taskTransactionDescription,
      TransactionDate: taskDate,
      DebitCredit: taskDebitCredit,
      Amt: taskAmt,
    });

    const {
      _id: taskID,
      name,
      TransactionDescription,
      TransactionDate,
      DebitCredit,
      Amt,
    } = task;

    taskIdDOM.textContent = taskID;
    taskNameDOM.value = name;
    taskTransactionDescriptionDOM.value = TransactionDescription;
    taskDebitCreditDOM.value = DebitCredit;
    taskAmtDOM.value = Amt;
    tempDesc = name;

    formAlertDOM.style.display = "block";
    formAlertDOM.textContent = `success, edited task`;
    formAlertDOM.classList.add("text-success");
  } catch (error) {
    console.error(error);
    taskNameDOM.value = tempDesc;
    formAlertDOM.style.display = "block";
    formAlertDOM.innerHTML = `error, please try again`;
  }
  editBtnDOM.textContent = "Edit";
  setTimeout(() => {
    formAlertDOM.style.display = "none";
    formAlertDOM.classList.remove("text-success");
  }, 1500);
});
