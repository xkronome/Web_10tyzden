// configuracia serveru  


//  server zapnem v power shell:
// cd "D:\SJF\5. SEMESTER\Databazy\web_Kronome\web"
// npm.cmd install -> npm.cmd start
// musim byt v tom istom priecinku DUH
// -> http://localhost:3000

const express = require("express"); // naimportuje Express kniznicu pre tvorbu API serveru
const mysql = require("mysql"); // naimportuje kniznicu mysql pre pripojenie k databaze
const app = express(); // zapise Express do premennej kturu potom pouzivame na volanie ????

// pridanie na bcryptjs
const bcrypt = require("bcryptjs");

const { error } = require("node:console"); // na co je to toto?????

app.use(express.json()); // umoznuje serveru prijimat JSON z HTTP poziadaviek ?
app.use(express.static(__dirname)); // dava staticke subory z priecinka kde je server.js


// budeme pouzivat vzdy
//   |
//   |
//   V
const db = mysql.createConnection({ // databazove nastavenie
    host: "localhost",          // bezime na tomto pocitaci
    user: "root",               // meno pouzivatela MySQL
    password: "",               
    database: "kniznica_db"     // moja databaza
});

db.connect(error => { // pripajame sa k databze, ak sa nepodari pripojit chyba sa ulozi do premennej error
    if (error) console.log("Chyba databazy:", error);   // ak nastane chyba vypise do konzoly
    else console.log("Databaza pripojena");             // ak nenastala chyba vypise sa toto
});

// vytvarame API
/*

app.get("/api/knihy", (req, res) => { // server prijme GET poziadajvu na adresu http://localhost:3000/api/knihy
// req - informacie o poziadavke od klienta
// res - objekt ktorym server posiela odpoved klientovi
db.query("SELECT * from knihy", (error, knihy) => { // Požiadavka spustí SQL dotaz: SELECT * FROM knihy;
//Výsledný dotaz načíta všetky riadky a všetky stĺpce z tabuľky knihy
// pri chybe sa pouzije error; vysledky sa automaticky zapisu do premenne j knihy
if(error) return res.status(500).send("Chyba SQL"); // spracovanie chyby
// res.status() - > chyba sa zorazi na stran klienta
res.json(knihy); // odpoved servera
// Výsledky databázového dotazu sa pošlú klientovi vo formáte JSON
});
});

*/
app.get("/api/knihy", (req, res) => {
    const hladat = (req.query.hladat || "").trim() ;
    const zoradit = req.query.zoradit || "id";
    const smer = req.query.smer === "DESC" ? "DESC" : "ASC";
    // Whitelist povolenych stlpcov pre ORDER BY ( ochrana pred SQL Injection )
    const povoleneStlpce = ["id", "nazov", "autor", "rok", "cena"];
    const stlpec = povoleneStlpce.includes(zoradit) ? zoradit : "id";
    let sql = "SELECT * FROM knihy";
    const parametre = [];

    if (hladat !== "") {
        sql += " WHERE nazov LIKE ? OR autor LIKE ?";
        parametre.push(`%${hladat}%`, `%${hladat}%`);
    }
    sql += ` ORDER BY ${stlpec} ${smer}`;
    db.query(sql, parametre, (error, knihy) => {
        if (error) return res.status(500).send("Chyba SQL");
        res.json(knihy);
    });
});


// POST vlozi novy riadok no MySQL
app.post("/api/knihy", (req, res) => { // server caka na POST do aadresy
    const{nazov, autor, rok, cena} = req.body; // udaje z tela poziadavky sa rozdelia do styroch premnnych

    const sql = "INSERT INTO knihy (nazov, autor, rok, cena) VALUES (?, ?, ?, ?)"; // vyrisene s pomocou internetu

        db.query(sql, [nazov, autor, rok, cena], error => { 
        if(error) return res.status(500).send("Chyba SQL"); // ak prikaz zlyha posleme chbu
        res.send("Kniha pridana"); // ak server nezlyha posleme spravu o dopisani knihy
        
    });
});

// DELETE vymaze knihu podla ID
app.delete("/api/knihy/:id", (req, res) =>{ // zaregistruje nedpoint pre http poziadavku DELETE
    //V knihy.js prehliadač posiela požiadavku na /api/knihy/ plus ID, napríklad /api/knihy/7.
    db.query("DELETE FROM knihy WHERE id = ?", [req.params.id], error => { // vykona prikaz, ktory vymaze knihu s danym id
        if (error) return res.status(500).send("Chyba SQL");
        res.send("Kniha vymazana");
    });
});


/** ----- CVIKO 9 ------ */

app.patch("/api/knihy/:id/cena", (req, res) =>{ // PATCH meni vlastnost knihy podla jej id
    const zmena = Number(req.body.zmena); //prevedie hodnotu zmena z JSON tela požiadavky na číslo.
    
    if (!Number.isFinite(zmena)) // skontroluje ci je cislo platne
        return res.status(400).send("Neplatna zmena"); // ak nieje platne

    const sql = "UPDATE knihy SET cena = cena + ? WHERE id = ?"; // vytvorenie SQL prikazu, pripocita cenu
    db.query(sql, [zmena, req.params.id], (error, vysledok) =>{
        if(error) return res.status(500).send("Chyba SQL");
        if(!vysledok.affectedRows) return res.sendStatus(404);
        res.send("Cena zmena");
    });
});

// 13. server.js - upravime nazov autora
app.put("/api/knihy/:id", (req, res) =>{
    const { nazov, autor, rok} = req.body; // z JSON tela vytiahne premenne
        if (!nazov || !autor || ! Number.isInteger(rok)) // controla ci su mono a nazov zadane a ci je rok celecislo
            return res.status(400).send(" Neplatne udaje.");
        const sql = 
            "UPDATE knihy SET nazov = ?, autor = ?, rok = ? WHERE id  = ?"; // vytvorenie SQL prikazu
        db.query(sql, [nazov, autor, rok, req.params.id],
            (error, vysledok) => {
                if (error) return res.status(500).send("Chyba SQL");
                if (!vysledok.affectedRows) return res.sendStatus(404);
                res.send("Kniha Upravena")
            });
});

// sprava pouzivatelov cviko 11
// 1. Ziskanie zoznamu pouzivatelov (bez stlpca heslo_hash)
app.get("/api/pouzivatelia", (req, res) => {
    const sql = "SELECT id, meno, email FROM pouzivatelia ORDER BY id ASC";
    db.query(sql, (error, pouzivatelia) => {
        if (error) return res.status(500).send("Chyba SQL");
        res.json(pouzivatelia);
    });
});

// 2. Registracia noveho pouzivatela s hashovanim hesla
app.post("/api/pouzivatelia", async (req, res) => {
    const { meno, email, heslo } = req.body;
    if (!meno || !email || !heslo) {
        return res.status(400).send("Vyplnte meno, e-mail aj heslo");
    }
    if (heslo.length < 6) {
        return res.status(400).send("Heslo musi mat aspon 6 znakov");
    }

    try {
        const hesloHash = await bcrypt.hash(heslo, 10);
        const sql = "INSERT INTO pouzivatelia (meno, email, heslo_hash) VALUES (?, ?, ?)";
        db.query(sql, [meno.trim(), email.trim(), hesloHash], error => {
            if (error) {
                if (error.code === "ER_DUP_ENTRY") {
                    return res.status(409).send("Pouzivatel s tymto e-mailom uz existuje");
                }
                return res.status(500).send("Chyba SQL");
            }
            res.status(201).send("Pouzivatel bol uspesne zaregistrovany");
        });
    } catch (err) {
        res.status(500).send("Chyba pri spracovani hesla");
    }
});

// 3. Vymazanie pouzivatela podla ID
app.delete("/api/pouzivatelia/:id", (req, res) => {
    const sql = "DELETE FROM pouzivatelia WHERE id = ?";
    db.query(sql, [req.params.id], (error, vysledok) => {
        if (error) return res.status(500).send("Chyba SQL");
        if (!vysledok.affectedRows) return res.sendStatus(404);
        res.send("Pouzivatel vymazany");
    });
});

// 4. Overenie prihlasovacich udajov
app.post("/api/prihlasenie", (req, res) => {
    const { email, heslo } = req.body;
    if (!email || !heslo) {
        return res.status(400).json({ sprava: "Zadajte e-mail aj heslo" });
    }

    const sql = "SELECT * FROM pouzivatelia WHERE email = ?";
    db.query(sql, [email.trim()], async (error, vysledok) => {
        if (error) return res.status(500).json({ sprava: "Chyba SQL" });

        if (vysledok.length === 0) {
            return res.status(401).json({ sprava: "Nespravny e-mail alebo heslo" });
        }

        const pouzivatel = vysledok[0];
        const zhoda = await bcrypt.compare(heslo, pouzivatel.heslo_hash);
        if (!zhoda) {
            return res.status(401).json({ sprava: "Nespravny e-mail alebo heslo" });
        }

        res.json({
            sprava: "Prihlasenie uspesne",
            pouzivatel: {
                id: pouzivatel.id,
                meno: pouzivatel.meno,
                email: pouzivatel.email
            }
        });
    });
});



// 404 stranka sa nenasla
app.use((req, res) => {
    res.status(404).sendFile(__dirname + "/404.html");
});


app.listen(3000, () =>{
    console.log("Web: http://localhost:3000")
});
