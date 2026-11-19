function nacitajKnihy(){
    fetch("/api/knihy")
    .then(odpoved => odpoved.json())
    .then(knihy => {
        const zoznam = document.getElementById("zoznam");
        zoznam.innerHTML = "";
        knihy.forEach(kniha => {
            const riadok = document.createElement("tr");
            [kniha.id, kniha.nazov, kniha.autor, kniha.rok, kniha.cena]
                .forEach(hodnota => {
                    const bunka = document.createElement("td");
                    bunka.textContent = hodnota;
                    riadok.appendChild(bunka);
                });
                // tlacidlo vymazat
                const bunka = document.createElement("td");
                const tlacidlo = document.createElement("button");
                tlacidlo.textContent = "Vymazat" ;
                tlacidlo.onclick = () => {
                    fetch("/api/knihy/" + kniha.id, {method: "DELETE"})
                    .then(() => nacitajKnihy());
                };
                
                /**
                 * nefungovalo
                const cenaBtn = document.createElement("button");
                cenaBtn.textContent = "Zmenit cenu";
                cenaBtn.onclick = () =>{
                 * 
                 */const cenaInput = document.createElement("input");
                    cenaInput.type = "number";
                    cenaInput.step = "0.01";
                    cenaInput.placeholder = "Zmena (€)";

                    const cenaBtn = document.createElement("button");
                    cenaBtn.textContent = "Zmenit cenu";
                    cenaBtn.onclick = () => {
                        /**
                         * 
                        const vstup = prompt("O kolko e zmenit cenu?", "S");
                        if(vstup === null || vstup.trim() === "") return;
                        const zmena = Number(vstup.replace(",","."));
                        if(!Number.isFinite(zmena)) return alert("Neplatne cislo");
    
                        */
                       const hodnota = cenaInput.value.trim();
                       if (hodnota === "") return alert("Zadaj zemu ceny");
                       
                       const zmena = Number(hodnota.replace(",","."));
                       if (!Number.isFinite(zmena)) return alert("neplaten cislo");

                       fetch("/api/knihy/" + kniha.id + "/cena", {
                           method: "PATCH",
                           headers: { "Content-Type": "application/json"},
                           body: JSON.stringify({ zmena })
                       }).then(() => nacitajKnihy());
                };

                const upravitBtn = document.createElement("button");
                upravitBtn.type = "button";
                upravitBtn.textContent = "Upraviť";

                upravitBtn.onclick = () => {
                    document.getElementById("nazov").value = kniha.nazov;
                    document.getElementById("autor").value = kniha.autor;
                    document.getElementById("rok").value = kniha.rok;
                    document.getElementById("cena").value = kniha.cena;

                    upravovanaKnihaId = kniha.id;
                    formular.querySelector("button").textContent = "Uložiť zmeny";
                    formularDialog.showModal();
                };

                bunka.appendChild(tlacidlo);
                bunka.appendChild(cenaInput);
                bunka.appendChild(cenaBtn);
                bunka.appendChild(upravitBtn);
                riadok.appendChild(bunka);
                zoznam.appendChild(riadok);
        });
    });
}

const formular = document.getElementById("formular");
const tlacidloFormulara = formular.querySelector("button");

/**
 * 
formular.addEventListener("submit", event =>{
    event.preventDefault();

    const kniha = {
        nazov: document.getElementById("nazov").value.trim(),
        autor: document.getElementById("autor").value.trim(),
        rok:  Number(document.getElementById("rok").value),
        cena: Number(document.getElementById("cena").value)
    };
    fetch("/api/knihy", {
        method: "POST",
        headers: {"Content-type": "application/json" },
        body: JSON.stringify(kniha)
    }).then(() => {
        formular.reset();
        nacitajKnihy();
    });
});
 */

formular.addEventListener("submit", event => {
    event.preventDefault();

    const kniha = {
        nazov: document.getElementById("nazov").value.trim(),
        autor: document.getElementById("autor").value.trim(),
        rok: Number(document.getElementById("rok").value),
        cena: Number(document.getElementById("cena").value)
    };

    const upravuje = upravovanaKnihaId !== null;
    const url = upravuje
        ? `/api/knihy/${upravovanaKnihaId}`
        : "/api/knihy";

    const udaje = upravuje
        ? { nazov: kniha.nazov, autor: kniha.autor, rok: kniha.rok }
        : kniha;

    fetch(url, {
        method: upravuje ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(udaje)
    })
    .then(async odpoved => {
        if (!odpoved.ok) {
            const sprava = await odpoved.text();
            throw new Error(sprava || `HTTP ${odpoved.status}`);
        }

        formular.reset();
        upravovanaKnihaId = null;
        tlacidloFormulara.textContent = "Pridat knihu";
        nacitajKnihy();
    })
    .catch(chyba => {
        console.error(chyba);
        alert("Uloženie sa nepodarilo: " + chyba.message);
    });
});

let upravovanaKnihaId = null;

const formularDialog = document.getElementById("formularDialog");

document.getElementById("novaKnihaBtn").addEventListener("click", () => {
    formular.reset();
    upravovanaKnihaId = null;
    tlacidloFormulara.textContent = "Pridať knihu";
    formularDialog.showModal();
});

document.getElementById("zrusitForm").addEventListener("click", () => {
    formularDialog.close();
});

nacitajKnihy();
