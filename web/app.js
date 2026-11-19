fetch("topbar.html")
.then(response => response.text())
.then(html => {
    document.body.insertAdjacentHTML("afterbegin", html)
})
.catch(error => {
    console.error("Topbar could not be loaded, Run the website using a local web server (for examnple live server).", error);
})

const button = document.getElementById("changeButton");
const message = document.getElementById("message");

if (button && message){
    button.addEventListener("click", () => {
        message.textContent = "The button was clicked!";
    });
}

const nameInput = document.getElementById("nameInput");
const output = document.getElementById("output");

if (nameInput && output){
    nameInput.addEventListener("input", () =>{
        output.textContent = `Hello, ${nameInput.value}!`;
    });
}

/*theme change diy */
const themebutton = document.getElementById("themebutton");


/*

V skole sme nedokoncili

let curentTheme = "light";

document.documentElement.dataset.theme = curentTheme;

themebutton.addEventListener("click", ()=>{
    curentTheme = curentTheme === "light" ? "dark" : light;

    document.documentElement.dataset.theme = curentTheme;

    localStorage.setItem("theme", curentTheme)
});
 */
