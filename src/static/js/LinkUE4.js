function stop(){ return false; }
document.oncontextmenu=stop;
function LinkUE4(){
	
	var obj = GetParameterArray((Array.prototype.slice.call(arguments, 0)));
	alert(obj.functionsName);
	var test = obj;
	if (window.ue.ueclass){
		
		window.ue.ueclass.linkue4(obj.functionsName);
	}
	
};

function GetParameterArray(LinkUE4Array){
	var obj = {
		functionsName:''
	};
	obj.functionsName = LinkUE4Array[0];
	return obj;
};

function TestBluEvent()
{
	window.blu_event();
}