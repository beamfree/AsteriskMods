const AmiClient = require('asterisk-ami-client');
let client = new AmiClient();
 
var CurrentCalls = [];
  
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
				case "Newstate":
			    CurrentCalls[event.Linkedid] = [];
				CurrentCalls[event.Linkedid]['debug'] = event;
				
					//console.log(event)
				break;
				case "Hangup":
				
					//console.log(event);
				break;
				
				case "DialBegin":
					//console.log("Начало соединения: Вызывающий " + event.CallerIDNum + " на номер " + event.DestCallerIDNum);
					// ChannelStateDesc
					// Uniqueid: '1638281572.6',
					//Linkedid: '1638281572.6',
					// ChannelStateDesc:
					//DestChannelStateDesc:
				break;
				
				case "DialState":
					//console.log("Звонок: Вызывающий " + event.CallerIDNum + "(" + event.CallerIDName+ ")" + " на абонентка " + event.DestCallerIDNum + "(" + event.DestCallerIDName+ ")");
				break;

				case "DialEnd":
					//console.log(event);
				break;

				
	 }
			 console.log(event);
     // console.log(CurrentCalls);
         //console.log(event.Event);
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
