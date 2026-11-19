
//náhľad musí zobrazovať minimálne meno a priezvisko, e-mail, kurz, úroveň a poznámku

//MENO
const fname_input = document.getElementById("fname_input");
const fname_output = document.getElementById("fname_output");

if (fname_input && fname_output) {
    fname_input.addEventListener("input", () => {
        fname_output.textContent = ` ${fname_input.value}`;
    });
}

//PRIEZVISKO
const lname_input = document.getElementById("lname_input");
const lname_output = document.getElementById("lname_output");

if (lname_input && lname_output){
    lname_input.addEventListener("input", ()=>{
        lname_output.textContent = ` ${lname_input.value}`;
    });
}

//EMAIL
const email_input = document.getElementById("email_input");
const email_output = document.getElementById("email_output");

if (email_input && email_output){
    email_input.addEventListener("input", ()=>{
        email_output.textContent = ` ${email_input.value}`;
    });
}

//TELEFON
const tnumber_input = document.getElementById("tnumber_input");
const tnumber_output = document.getElementById("tnumber_output");

if(tnumber_input && tnumber_output){
    tnumber_input.addEventListener("input", ()=>{
        tnumber_output.textContent = `  ${tnumber_input.value}`;
    });
}

//KURZ
const kurz = document.getElementById("kurz");
const kurz_output = document.getElementById("kurz_output");

if (kurz && kurz_output){
    kurz.addEventListener("change", ()=>{
        kurz_output.textContent = kurz.value;
    });
}

//UROVEN
const uroven = document.querySelectorAll('input[name="uroven"]');
const uroven_output = document.getElementById("uroven_output");

if (uroven && uroven_output) {
    uroven.forEach(radio => {
        radio.addEventListener("change", ()=>{
            uroven_output.textContent = radio.value;
        });
    });
}

//POZNAMKY
const poznamka = document.getElementById("poznamka");
const poznamka_output = document.getElementById("poznamka_output");

if (poznamka && poznamka_output){
    poznamka.addEventListener("input", ()=>{
        poznamka_output.textContent = poznamka.value;
    });
}

//ZABRANENIE SUBMITU
/* 
a. formulár musí reagovať na event submit
b. pomocou event.preventDefault() zabráňte skutočnému odoslaniu
    a obnoveniu stránky
*/
const preventSubmit = document.getElementById("myform");

preventSubmit.addEventListener("submit", (event) => {
    event.preventDefault();

    //c. po odoslaní sa celý formulár skryje -> akoze zmaze?
    // Mazanie formulara
    preventSubmit.reset();

    // Mazanie nahladu
    fname_output.textContent = "";
    lname_output.textContent = "";
    email_output.textContent = "";
    kurz_output.textContent = "";
    uroven_output.textContent = "";
    poznamka_output.textContent = "";
    tnumber_output.textContent = "";

    //d. po úspešnom odoslaní formulára zobrazte pomocou JavaScript funkcie alert() správu „Formulár bol úspešne odoslaný.
    alert("Formulár bol úspešne odoslaný.");

    //console.log("haha");
});

//e. údaje sa neposielajú na server -> nemam nikde ziaden link na server nema sa ako posielat
