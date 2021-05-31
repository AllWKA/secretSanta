const fs = require('fs-extra');
require('dotenv/config');
const configTel = require("./configTel.json");
const TelegramBot = require('node-telegram-bot-api');
let list = [];

const botTel = new TelegramBot(process.env.TOKEN_TELEGRAM, {
    polling: true
});

botTel.on("message", async message => {
    if (message.text != undefined) {
        if (message.text.indexOf(configTel.prefix) !== 0) return;

        const args = message.text.slice(configTel.prefix.length).trim().split(/ +/g);
        const command = args.shift().toLowerCase();
        switch (command) {

            case "start":

                botTel.sendMessage(message.chat.id, "¡Hola! He llegado a Telegram");
                break;

            case "add":
                botTel.sendMessage(message.chat.id, "Añadido: " + message.from.first_name);
                list.push({
                    person: message.from.first_name
                });
                let count = 0;
                for (let persona of list) {
                    count++;
                    if (message.from.first_name === persona.person) {
                        botTel.sendMessage(message.chat.id, message.from.first_name + " eres el número: " + count);
                        break;
                    }
                }

                break;

            case "rafflebut":
                let tu = (args[0]) - 1
                let exclude = (args[1]) - 1;
                let random = Math.floor(Math.random() * (list.length - 0) + 0);
                let checkList = false;
                for (let persona of list) {
                    if (persona.person !== "none" && persona.person !== list[tu].person && persona.person !== list[exclude].person) {
                        console.log("entro")
                        checkList = true;
                        break;
                    }
                }
                if (checkList) {
                    while (exclude === random || random === tu || list[random].person === "none") {
                        random = Math.floor(Math.random() * (list.length - 0) + 0);
                    }
                    await botTel.sendMessage(message.from.id, "Te ha tocado: " + list[random].person)
                    list[random] = {
                        person: "none"
                    };
                    break;

                } else {
                    await botTel.sendMessage(message.from.id, "No hay nadie mas en la lista");
                    break;
                }

                case "raffle":
                    let tua = (args[0]) - 1
                    let randoma = Math.floor(Math.random() * (list.length - 0) + 0);
                    let checkLista = false;
                    for (let personaA of list) {
                        if (personaA.person !== "none" && personaA.person !== list[tua].person) {
                            checkLista = true;
                            break;
                        }
                    }
                    if (checkLista) {
                        while (randoma === tua || list[randoma].person === "none") {
                            randoma = Math.floor(Math.random() * (list.length - 0) + 0);
                        }
                        await botTel.sendMessage(message.from.id, "Te ha tocado: " + list[randoma].person)
                        list[randoma] = {
                            person: "none"
                        };
                        break;

                    } else {
                        await botTel.sendMessage(message.from.id, "No hay nadie mas en la lista");
                        break;
                    }

                    case "check":
                        botTel.sendMessage(message.chat.id, "La lista es la siguiente: ").then(done => {
                            for (let persona of list) {
                                botTel.sendMessage(message.chat.id, persona.person);
                            }
                        });
                        break;

                    case "test":
                        console.log("El puto de: " + message.from.first_name + " esta probandome")
                        list.push({
                            person: "Amanda"
                        });
                        list.push({
                            person: "Bob"
                        });
                        list.push({
                            person: "Pepe"
                        });
                        list.push({
                            person: "Tomate"
                        });
                        list.push({
                            person: "Juan Habichuelo"
                        });
                        let counts = 0
                        for (let persona of list) {
                            counts++
                            botTel.sendMessage(message.chat.id, persona.person + " tiene el numero " + counts);
                        }
        }
    }
})