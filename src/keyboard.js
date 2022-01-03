var midiDevices = {
    inputs: {},
    outputs: {}
};
var midiout = null;
var midiin = null;
var velocity = 0;
var isMidiMute = false;

function inputEvent(e) {
    var target = e.target;
    var device = midiDevices.inputs[target.name];
    var numArray = [];

    if (device != midiin)
    {
        return; /* not selected device. throw away data  */
    }

    // to hex
    event.data.forEach(function (val) {
        numArray.push(('00' + val.toString(16)).substr(-2));
    });

    if (isMidiMute =! true)
    {
        // output to midi sequencer
        document.getElementById("synth").send(numArray);
    }
    // output monitor
    in_inputMonitor(numArray);
}

function ecb(e) {
    console.log(e);
}

function scb(midiaccess) {
    var inputs = midiaccess.inputs.values();
    var j = 0;
    
    for (var init = inputs.next(); !init.done; init = inputs.next()) {
        var value = init.value;
        document.getElementById("midiin").options[j++] = new Option(init.value.name);
        midiDevices.inputs[value.name] = value;
        value.addEventListener('midimessage', inputEvent, false);
        midiin = midiDevices.inputs[value.name];
    }
    

    var i = 0;
   
    var outputs = midiaccess.outputs.values();
    for (var outit = outputs.next(); !outit.done; outit = outputs.next()) {
        var value = outit.value;
        document.getElementById("midiout").options[i++] = new Option(outit.value.name);
        midiDevices.outputs[value.name] = value;
        midiout = midiDevices.outputs[value.name];
    }
    
}

function Init() {

    if (navigator.requestMIDIAccess) {
        navigator.requestMIDIAccess({
            sysex: true
        }).then(scb, ecb);
    }else{
        ecb();
    }

    velocity = 64;
    
    document.getElementById("midiout").addEventListener("change", function (e) {
        var obj = document.getElementById("midiout");
        var idx = obj.selectedIndex;
        var val = obj.options[idx].value;
        midiout = midiDevices.outputs[val.name];
    });
    document.getElementById("midiin").addEventListener("change", function (e) {
        var obj = document.getElementById("midiin");
        var idx = obj.selectedIndex;
        var val = obj.options[idx].value;
        midiin = midiDevices.inputs[val.name];
    });
    document.getElementById("inputMIDIMuteToggle").addEventListener("change", function (e) {
        isMidiMute = Boolean(document.getElementById("inputMIDIMuteToggle").value);
    });
    document.getElementById("velocityNum").addEventListener("change", function (e) {
        velocity = parseInt(document.getElementById("velocityNum").value);
    });
    document.getElementById("keyboard").addEventListener("change", function (e) {
        Send([0x90, e.note[1], e.note[0] ? velocity : 0]);
    });
    document.getElementById("prog").addEventListener("change", function (e) {
        Send([0xc0, e.target.value]);
    });
    document.getElementById("volume").addEventListener("change", function (e) {
        Send([0xb0, 7, e.target.value]);
    });
}

function in_inputMonitor(mess) {

    for (var i = 0; i < mess.length; i++) {
        document.getElementById("inmonitor").value += mess[i].toString(16);
        document.getElementById("inmonitor").value += " ";
    }
    document.getElementById("inmonitor").value += "\n";

    var obj = document.getElementById("inmonitor");
    obj.scrollTop = obj.scrollHeight;
}

function out_outputMonitor(mess) {

    for (var i = 0; i < mess.length; i++) {
        document.getElementById("outmonitor").value += mess[i].toString(16);
        document.getElementById("outmonitor").value += " ";
    }
    document.getElementById("outmonitor").value += "\n";

    var obj = document.getElementById("outmonitor");
    obj.scrollTop = obj.scrollHeight;
}

function Send(mess) {
   
    // output to midi device
    if(midiout)
    {
        midiout.send(mess);
    }
    
    // output to midi sequencer
    document.getElementById("synth").send(mess);
    
    out_outputMonitor(mess);
}

function sendSysEx()
{
    var inputStr = document.getElementById("sysExInputArea").value.split(' ');
    var inputNumArray = [inputStr.length];
    for (var i = 0; i < inputStr.length; i++)
    {
        inputNumArray[i] = parseInt(inputStr[i], 16);
    }

    Send(inputNumArray);
}
