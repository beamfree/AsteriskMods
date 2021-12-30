const AmiClient = require('asterisk-ami-client');
const { cUrl } = require('node-libcurl');
let client = new AmiClient();
var Temp=[];

function EventExists(event) {
    if(Temp.hasOwnProperty(event.Linkedid)) {
        if(Temp[event.Linkedid].hasOwnProperty(event.Event))  {
            delete Temp[event.Linkedid][event.Event];
            return true;
        } else {
            Temp[event.Linkedid][event.Event] = "";
            return false;
        }
    } else {
        Temp[event.Linkedid] = [];
        Temp[event.Linkedid][event.Event] = "";
        return false;
    }
}

function EventDelete(event) { if(Temp.hasOwnProperty(event.Linkedid)) { delete Temp[event.Linkedid]; } }

client.connect('zabbix', 'Sogaz-med56', {host: 'localhost', port: 5038})
    .then(amiConnection => {
        client
            .on('event', function(event) {
                switch(event.Event) {
                    case "DialBegin":
                        if(!EventExists(event)) {
                          /// Отправляем
                            console.log("Вызов");
                        }
                        break;
                    case "BridgeEnter":
                        if(!EventExists(event)) {
                            /// Отправляем
                            console.log("Подняли трубку");
                        }
                        break;
                    case "BridgeLeave":
                        if(!EventExists(event)) {
                            /// Отправляем
                            console.log("Вызов завершен");
                        }
                        break;
                    case "Hangup":
                        if(!EventExists(event)) {
                            if (event.Cause == 17) {
                                console.log("Вызов завершен: Абонент занят");
                            } else {
                                if (event.Cause == 0) {
                                    console.log("Вызов завершен: Абонент бросил трубку");
                                }
                            }
                        }
                        EventDelete(event);
                        break;
                }
            })
            .action({
                Action: 'Ping'
            });
    })
    .catch(error => console.log(error));