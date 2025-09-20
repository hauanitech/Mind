import { API_URL } from "./config.js";

const vanish = document.getElementById("vanish");
vanish.addEventListener("click", delete_all_messages);

const create = document.getElementById("create");
const update = document.getElementById("update");
const cancel = document.querySelectorAll(".cancel");
const submit = document.getElementById("submit");

const popUp = document.querySelector(".pop-up");
const createBox = document.getElementById("createBox");
const updateBox = document.getElementById("updateBox");

let message_id;

create.addEventListener("click", () => {
  createBox.classList.add("shown");
  popUp.classList.add("shown");
});

cancel.forEach((element) => {
  element.addEventListener("click", () => {
    popUp.classList.remove("shown");
    createBox.classList.remove("shown");
    updateBox.classList.remove("shown");
  });
});

submit.addEventListener("click", () => {
  const requestTitle = document.getElementById("messageTitle").value;
  const requestContent = document.getElementById("messageContent").value;

  if (requestContent.length < 1 || requestTitle.length < 1) {
    console.error("All Field Must Be Filled");
    return;
  }

  create_message(requestTitle, requestContent);
  popUp.classList.remove("shown");
  createBox.classList.remove("shown");

  get_all_elements();
  document.getElementById("messageTitle").value = "";
  document.getElementById("messageContent").value = "";
});

async function get_all_elements() {
  try {
    const response = await fetch(`${API_URL}/messages/get_all_messages`);
    const data = await response.json();

    const msgContainer = document.getElementById("messageContainer");

    // cleaning the container first

    msgContainer.innerHTML = ``;

    for (let i = 0; i < data.data.length; i++) {
      msgContainer.innerHTML += `
            <div class="message" id="${data.data[i].id}">
            <h1 class="title">${data.data[i].title}</h1>
            <p class="title">${data.data[i].content}</p>

            <p class="created_at">${data.data[i].created_at}</p>
            <button class="edit">Edit</button>
            <button class="delete">Delete</button>
            </div>     
            `;
    }

    const delBtns = document.querySelectorAll(".delete");
    delBtns.forEach((element) => {
      element.addEventListener("click", () => {
        const message_id = element.closest(".message").id;
        delete_message(message_id);
      });
    });

    const edit = document.querySelectorAll(".edit");
    edit.forEach((element) => {
      element.addEventListener("click", () => {
        popUp.classList.add("shown");
        updateBox.classList.add("shown");

        update.addEventListener("click", () => {
          const requestTitle = document.getElementById("messageTitle").value;
          const requestContent =
            document.getElementById("messageContent").value;

          if (requestContent.length < 1 || requestTitle.length < 1) {
            console.error("All Field Must Be Filled");
            return;
          }

          update_message(
            requestTitle,
            requestContent,
            element.closest(".message").id
          );
          popUp.classList.remove("shown");
          updateBox.classList.remove("shown");

          get_all_elements();
          document.getElementById("messageTitle").value = "";
          document.getElementById("messageContent").value = "";
        });
      });
    });
  } catch (error) {
    console.error("Error fetching data");
  }
}

async function delete_message(message_id) {
  try {
    const response = await fetch(
      `${API_URL}/messages/delete_message/${message_id}`,
      {
        method: "DELETE",
      }
    );
    const data = await response.json();
    get_all_elements();
  } catch (error) {
    console.error("Error fetching data");
  }
}

async function delete_all_messages() {
  try {
    const response = await fetch(`${API_URL}/messages/delete_all_messages`, {
      method: "DELETE",
    });
    const data = await response.json();

    get_all_elements();
  } catch (error) {
    console.error("Error fetching data");
  }
}

async function create_message(tit, cont) {
  try {
    const newMessage = {
      title: tit,
      content: cont,
    };

    const response = await fetch(`${API_URL}/messages/create_message`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newMessage),
    });
    const data = await response.json();
  } catch (error) {
    console.error("Error fetching data");
  }
}

async function update_message(tilt, cont, message_id) {
  try {
    const updatedMessage = {
      title: tilt,
      content: cont,
    };

    const response = await fetch(
      `${API_URL}/messages/update_message/${message_id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedMessage),
      }
    );
    const data = await response.json();
  } catch (error) {
    console.error("Error fetching data");
  }
}

get_all_elements();
