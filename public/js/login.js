var socket;
const load = async () => {
  socket = await io("/");
  await socket.on("connection");
  socket.on("login", (data) => {
    if (data == 1) {
    } else {
    }
  });
};
const login = async () => {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  socket.emit("login", username, password);
  socket.on("login", (data) => {
    if (data != null) {
      if (data != "Login Failed!") {
        localStorage.setItem("token", data);
        location.href = "/Home";
      } else {
        alert("Login Failed!");
      }
    } else {
      alert("Login Failed!");
    }
  });
};
