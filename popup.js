document.addEventListener('DOMContentLoaded', function(){
    let version = 'V 1.1.1';
    document.getElementById('message').innerText = version;
    var activeElement = document.getElementById("active-option");
    chrome.storage.sync.get(['GDDM-active'], function (result){
        if(result['GDDM-active'] === "false")
        {
            activeElement.checked = false;
        }else{
            activeElement.checked = true;
        }
    });
    activeElement.onclick = function(){
        let selection = this.checked + "";
        if(this.checked){
            chrome.storage.sync.set({'GDDM-active' : selection});
        }else{
            chrome.storage.sync.set({'GDDM-active' : selection});
        }
        chrome.tabs.query({currentWindow: true, active: true}, 
            function(tabs) {
                chrome.tabs.sendMessage(tabs[0].id, selection);
        })
    }
})