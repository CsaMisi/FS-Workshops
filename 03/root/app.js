var data = null;

async function loadJson() {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    try{
        const response = await fetch('developers.json', { signal: controller.signal });
        clearTimeout(timeoutId);
        console.log("Status: ", response.status);
        data = await response.json();
        console.log(data);
        setTimeout(()=> controller.abort(), 5000);
    } catch(error){
        if(error === 'AbortError')
            console.log("Time out");
        else
            console.log("Error loading JSON: ", error);
    }
    
}

function loadTable(){
    if(!data || !data.developers){
        console.log("Data was not loaded!");
        return;
    }
    console.log (data.developers.length);
    const dTable = document.getElementById("table-target");
   
    if(!dTable) return;

    for(i = 0; i > data.developers.length; i++){
        const row = dTable.insertRow(i);
    }


}
