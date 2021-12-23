const AmiClient = require('asterisk-ami-client');
let client = new AmiClient();
 
var ActiveCalls = [];

function AnalCall(Call) {
	var _Index = 0;
	while(_Index < Call.length) {
		console.log(Call[_Index].Event);
		switch (Call[_Index].Event) {

			case "DialBegin" :
				console.log("Набор номера от: " + Call[_Index].CallerIDNum);

				break;
			case "Newstate" :
				switch (Call[_Index].Debug.ChannelStateDesc) {
					case "Ringing":
						console.log("Начало звонка: " + Call[_Index].CallerIDNum + ">" + Call[_Index].ConnectedLineNum);
						break;
				}

				break;
			case "BridgeEnter" :
				console.log("Ответил на звокнок: " + Call[_Index].CallerIDNum + ">" + Call[_Index].ConnectedLineNum);
				_Index++;
				break;
			case "BridgeLeave" :
				console.log("Звонок завершил: " + Call[_Index].CallerIDNum + ">" + Call[_Index].ConnectedLineNum);
				_Index++;
				break;
		}
		_Index++;
	}

}

function AddEvent(Event) {
	if(!ActiveCalls.hasOwnProperty(Event.Linkedid)) {	ActiveCalls[Event.Linkedid] = []; } else {
		var _Index = ActiveCalls[Event.Linkedid].length;
		var _CallEvents = [];
		_CallEvents['Event'] = Event.Event;
		_CallEvents['Channel'] = Event.Channel;
		_CallEvents['ChannelState'] = Event.ChannelStateDesc;
		_CallEvents['CallerIDNum'] = Event.CallerIDNum;
		_CallEvents['CallerIDName'] = Event.CallerIDName;
		_CallEvents['ConnectedLineNum'] = Event.ConnectedLineNum;
		_CallEvents['ConnectedLineName'] = Event.ConnectedLineName;
		_CallEvents['DateTime'] = new Date();
		_CallEvents['Debug'] = Event;
		ActiveCalls[Event.Linkedid][_Index] = _CallEvents;
		if(Event.Event == "Hangup") {
			if(Event.Uniqueid == Event.Linkedid) {
				AnalCall(ActiveCalls[Event.Linkedid]);
			}
		 }


	}

}

client.connect('zabbix', 'Sogaz-med56', {host: 'localhost', port: 5038})
 .then(amiConnection => { 
     client
         //.on('connect', () => console.log('connect'))
         .on('event', function(event) {

			 //if(event.ConnectionNum  ) {
			 //	 if (event.ConnectionNum == 5502 || event.CallerIDNum == 5502 ) {
             //
 			 //	 } else {return;}
			 //}
			switch(event.Event) {
				case "PeerStatus":
					//console.log(event)
				break;
				case "Newstate": AddEvent(event); break;
				case "DialBegin": AddEvent(event); break;
				case "DialEnd":AddEvent(event); break;
				case "DialState":AddEvent(event); break;
				case "BridgeEnter":AddEvent(event); break;
				case "BridgeLeave":AddEvent(event); break;
				case "Hangup": AddEvent(event);   break;

				
	 }

     // console.log(CurrentCalls);
			 if(event.Event == "Newstate" ) {
			///	console.log(event);
			 }
         })

         //.on('data', chunk => console.log(chunk))
          //.on('response', response => console.log(response))
         //.on('disconnect', () => console.log('disconnect'))
         //.on('reconnection', () => console.log('reconnection'))
         //.on('internalError', error => console.log(error))
         .action({
             Action: 'Ping'
         });
 })
 .catch(error => console.log(error));
