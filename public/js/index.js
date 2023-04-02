var socket;
var Iurl = "";
var userLog = 'none';
var url;
const soc = async () => {
  socket = await io("/")
  await socket.on("connection");
}
const load = async (Curl = "") => {
  const token = await localStorage.getItem('token')
  if (token) {}
  else {location.href = `/login.html`}
  url = await location.href
  .split("/")
    .pop()
    .replace(".html", "")
    .replace("#", "");
  var page = await document.getElementById("pageview");
  if (url == "") {
    url = "Home";
    await fetch(`/components/${url}.hc`)
      .then((response) => response.text())
      .then((data) => {
        page.innerHTML = data;
        uml();
        Iurl = url;
      });
  }
  if (url == Iurl) {
    return -1;
  }
  if (Curl != "") {
    url = await Curl;
    await fetch(`/components/${url}.hc`)
      .then((response) => response.text())
      .then((data) => {
        page.innerHTML = data;
        uml();
        Iurl = url;
      });
    Iurl = await url;
    return 0;
  } else {
    await fetch(`/components/${url}.hc`)
      .then((response) => response.text())
      .then((data) => {
        if (data.indexOf("Cannot GET /components/") != -1) {
          page.innerHTML = data;
          uml();
          Iurl = url;
        } else {
          load("404");
        }
      });
  }
};
const uml = async () => {
  const links = await document.querySelectorAll("a");
  if (url == 'Home') {
    Details()
  }
  await links.forEach((link) => {
    link.addEventListener("click", function (event) {
      event.preventDefault(); // prevent the default link behavior
      const url = this.getAttribute("href");
      window.history.pushState({}, "", url); // change the URL without refreshing
      load(url);
    });
  });
};
window.addEventListener("unload", function (event) {
  event.preventDefault();
});

const Details = async () => {
  const token = await localStorage.getItem('token')
  await socket.emit("details", token)
  socket.on('details', (data) => {
    if (typeof data != 'object') {
      logout()
    }
    else {
      const student = data.studentDetailsList[0]
      document.getElementById('stn').innerText = student.studentName
      document.getElementById('admno').innerText = student.admnNo
      document.getElementById('admnov').innerText = student.admnNo
      document.getElementById('rollno').innerText = student.rollNo
      document.getElementById('rollnov').innerText = student.rollNo
      document.getElementById('cla').innerText = student.division
      document.getElementById('clav').innerText = student.division
    }
    });
}; const logUser = async () => {
  const usr = await document.getElementById('umenu')
  if (userLog == await 'none') {
    userLog = await 'flex'
    usr.setAttribute('style', `display: ${userLog};`)
  } else {
    userLog = await 'none'
    usr.setAttribute('style', `display: ${userLog};`)
  }
}; const logout = () => {
  localStorage.removeItem('token')
  location.href = '/login.html'
};