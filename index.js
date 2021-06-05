require('dotenv/config');
const configTel = require("./configTel.json");
const TelegramBot = require('node-telegram-bot-api');

let participants = [];

const botTel = new TelegramBot(process.env.TOKEN_TELEGRAM, {
    polling: true
});

function start(message) {
    botTel.sendMessage(message.chat.id, "¡Hola! He llegado a Telegram")
}

function add(message) {
    participants.push({person: message.from.first_name});
    let count = 0;
    for (let participant of participants) {
        count++;
        if (message.from.first_name === participant.person) {
            botTel.sendMessage(message.chat.id, message.from.first_name + " eres el número: " + count);
            break;
        }
    }
    botTel.sendMessage(message.chat.id, "Añadido: " + message.from.first_name);
}

async function rafflebut(message, args) {
    let tu = (args[0]) - 1
    let exclude = (args[1]) - 1;
    let random = Math.floor(Math.random() * (participants.length));
    let checkList = false;
    for (let persona of participants) {
        if (persona.person !== "none" && persona.person !== participants[tu].person && persona.person !== participants[exclude].person) {
            checkList = true;
            break;
        }
    }
    if (checkList) {
        while (exclude === random || random === tu || participants[random].person === "none") {
            random = Math.floor(Math.random() * (participants.length));
        }
        await botTel.sendMessage(message.from.id, "Te ha tocado: " + participants[random].person)
        participants[random] = {person: "none"};
    } else {
        await botTel.sendMessage(message.from.id, "No hay nadie mas en la lista");
    }
}

async function raffle(message, args) {
    let tua = (args[0]) - 1
    let randoma = Math.floor(Math.random() * (participants.length));
    let checkLista = false;
    for (let personaA of participants) {
        if (personaA.person !== "none" && personaA.person !== participants[tua].person) {
            checkLista = true;
            break;
        }
    }
    if (checkLista) {
        while (randoma === tua || participants[randoma].person === "none") {
            randoma = Math.floor(Math.random() * (participants.length));
        }
        await botTel.sendMessage(message.from.id, "Te ha tocado: " + participants[randoma].person)
        participants[randoma] = {
            person: "none"
        };

    } else {
        await botTel.sendMessage(message.from.id, "No hay nadie mas en la lista");
    }
}

function check(message) {
    botTel.sendMessage(message.chat.id, "La lista es la siguiente: ").then(() => {
        for (let persona of participants) {
            botTel.sendMessage(message.chat.id, persona.person);
        }
    });
}

function test(message) {
    ["Amanda", "Bob", "Pepe", "Tomate", "Juan Habichuelo"].forEach(participant => participants.push({person: participant}))
    participants.forEach((participant, i) => botTel.sendMessage(message.chat.id, participant.person + " tiene el numero " + i))
}

const commandHandlers = {start, check, test, add, rafflebut, raffle}

botTel.on("message", async message => {
    if (message.text !== undefined) {
        if (message.text.indexOf(configTel.prefix) !== 0) return;

        const args = message.text.slice(configTel.prefix.length).trim().split(/ +/g);
        const command = args.shift().toLowerCase();
        commandHandlers[command](message, args)
    }
})
