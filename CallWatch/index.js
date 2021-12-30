const AmiClient = require('asterisk-ami-client');
let client = new AmiClient();
 
var ActiveCalls = [];
var _ActiveCalls = [];

function SubTime(d1,d2) {
    var _Return = new Date();
	_Return.setHours(0,0,0,0);
	_Return.setSeconds(d2.getSeconds() - d1.getSeconds());
	_Return.setMinutes(d2.getMinutes() - d1.getMinutes());
	_Return.setHours(d2.getHours() - d1.getHours());
	return _Return;
}

function AddTime(d1,d2) {
	var _Return = new Date();
	_Return.setHours(0,0,0,0);
	_Return.setSeconds(d2.getSeconds() + d1.getSeconds());
	_Return.setMinutes(d2.getMinutes() + d1.getMinutes());
	_Return.setHours(d2.getHours() + d1.getHours());
	return _Return;
}

var DelegateEvent;

function AddEventInfo(event) {
	if(typeof event !== 'undefined' && event !== null) {
		var _Index = 0;
		if (!_ActiveCalls.hasOwnProperty(event.Linkedid)) {
			_ActiveCalls[event.Linkedid] = [];
			_ActiveCalls[event.Linkedid]['Start'] = new Date();
			_ActiveCalls[event.Linkedid]['End'] = new Date(_ActiveCalls[event.Linkedid].Start);
			_ActiveCalls[event.Linkedid]['ResponseTimeout'] = new Date(_ActiveCalls[event.Linkedid].Start);
			_ActiveCalls[event.Linkedid]['ResponseTimeout'].setHours(0, 0, 0, 0);
			_ActiveCalls[event.Linkedid]['Events'] = [];
			_ActiveCalls[event.Linkedid].Events[_Index] = EventInfo(event);
			console.log(_ActiveCalls[event.Linkedid].Events[_Index].Description);
		} else {
			_Index = _ActiveCalls[event.Linkedid]['Events'].length;
			_ActiveCalls[event.Linkedid].Events[_Index] = EventInfo(event);
			if(_ActiveCalls[event.Linkedid].Events[_Index - 1].Name != _ActiveCalls[event.Linkedid].Events[_Index].Name) {
				console.log(_ActiveCalls[event.Linkedid].Events[_Index].Description);
			}
		}
	} else { console.log("fack");}

}

function EventToInfo(event,description) {
	switch(event.Event) {
		case "DialEnd":
			return 	{
				Name : event.Event,
				DateTime : new Date(),
				Description : description,
				FromNum : event.ConnectedLineNum ,
				FromName : event.ConnectedLineName,
				ToNum :event.CallerIDNum,
				ToName : event.CallerIDName
				Debug : event
			};

		default:
			return 	{
				Name : event.Event,
				DateTime : new Date(),
				Description : description,
				FromNum : event.CallerIDNum,
				FromName : event.CallerIDName,
				ToNum : event.ConnectedLineNum ,
				ToName : event.ConnectedLineName
				Debug : event
			};
	}
}

function EventInfo(event) {
	switch (event.Event) {
		case "DialBegin" : return EventToInfo(event, + " - Начало звонка от: " + event.CallerIDNum);
		case "BridgeEnter" : return EventToInfo(event,+ " - Звук поднят: " + event.CallerIDNum + ">" + event.ConnectedLineNum);
		case "BridgeLeave" : return EventToInfo(event, + " - Повесил трубку: " + event.CallerIDNum + ">" + event.ConnectedLineNum);
		case "Hold": return EventToInfo(event," - Поставил на удержание: " + event.CallerIDNum + ">" +event.ConnectedLineNum);
		case "Unhold": return EventToInfo(event, " - Снял с удержание: " + event.CallerIDNum + ">" + event.ConnectedLineNum);
		case "DialEnd":
			switch (event.DialStatus) {
				case "BUSY": return EventToInfo(event," - Абонент занят: " + event.CallerIDNum + ">" + event.ConnectedLineNum);
				case "ANSWER": return EventToInfo(event," - Абонент ответил: " + event.ConnectedLineNum + ">" +  event.CallerIDNum);
				default: return EventToInfo(event," - Абонент не дождался ответа: " + event.CallerIDNum + ">" + event.ConnectedLineNum);
			}
		break;
		case "Hangup" : return EventToInfo(event, " - Завершение звонка ");
	}
}

function AnalCall(Call) {
	var _Index = 0;
	var ResponseTimeout = new Date();
	ResponseTimeout.setHours(0,0,0,0);
	//
	var WaitUpCall  = new Date();
	WaitUpCall.setHours(0,0,0,0);
	while(_Index < Call.Events.length) {
		if(_Index > 0) {
			WaitUpCall = AddTime(WaitUpCall,SubTime(Call.Events[_Index - 1].DateTime,Call.Events[_Index].DateTime));
		}


			switch (Call.Events[_Index].Event) {

				case "DialBegin" :
				console.log("Начало звонка от: " + Call.Events[_Index].CallerIDNum);
				break;

				case "BridgeEnter" :
				console.log("Ответил на звокнок: " + Call.Events[_Index].CallerIDNum + ">" + Call.Events[_Index].ConnectedLineNum);
				ResponseTimeout = AddTime(ResponseTimeout,WaitUpCall);
				WaitUpCall.setHours(0,0,0,0);
				_Index++;
				break;

				case "BridgeLeave" :
				console.log("Звонок завершил: " + Call.Events[_Index].CallerIDNum + ">" + Call.Events[_Index].ConnectedLineNum);
				_Index++;
				break;

				case "Hold":
					console.log("Поставил на удержание: " + Call.Events[_Index].CallerIDNum + ">" + Call.Events[_Index].ConnectedLineNum);
					break;
				case "Unhold":
					console.log("Снял с удержание: " + Call.Events[_Index].CallerIDNum + ">" + Call.Events[_Index].ConnectedLineNum);
					break;
				case "Hangup" :
				if( Call.Events[_Index].Debug.Cause  == 17 ) {
					console.log("Абонент занят: " + Call.Events[_Index].CallerIDNum + ">" + Call.Events[_Index].ConnectedLineNum);
					_Index++;
				} else {

					if( Call.Events[_Index].Debug.Cause  == 0 ) {
						console.log("Звонящий сбросил звонок: " + Call.Events[_Index].CallerIDNum + ">" + Call.Events[_Index].ConnectedLineNum);
					}
				}

					break;
		}
		_Index++;
	}
	console.log("Начало звокна: " + Call.Start);
	console.log("Окончание звонка: " + Call.End);
	console.log("Время ожидания: " + ResponseTimeout);
}

client.connect('zabbix', 'Sogaz-med56', {host: 'localhost', port: 5038})
 .then(amiConnection => { 
     client
         .on('event', function(event) {
			switch(event.Event) {
				case "DialBegin":   AddEventInfo(event); break;
				case "DialEnd":		AddEventInfo(event); break;
				case "BridgeEnter":	AddEventInfo(event); break;
				case "BridgeLeave":	AddEventInfo(event); break;
				case "Hold":		AddEventInfo(event); break;
				case "Unhold":		AddEventInfo(event); break;
				case "Hangup": 		AddEventInfo(event); break;
	 		}
         })
         .action({
             Action: 'Ping'
         });
 })
 .catch(error => console.log(error));
