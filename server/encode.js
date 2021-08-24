var hashString = "98781977299627577716227723671055511534581316545567596341258008118624696135445378743427240184342632658475020662189893874573834303250659764952279126276255961587395377002662672004395586642091328793998148";
function change(input){
    for(var key in input){
        input[i]=hashString[input[i].]
    }
}

function encode(input){
    if(typeof(input)!="string"){
        console.log("Type Wrong.");
        return input;
    }
    var tmp=[];tmp[0]=0;
    while(input.length>64){
        tmp[++tmp[0]]=input.slice(0,128);
        input=input.slice(128);
    }
    tmp[++tmp[0]]=input;
    for(var i=1;i<=tmp[0];++i){
        tmp[i]=change(tmp[i]);
    }
}

function md