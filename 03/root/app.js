var data = null;
//copied capitalize function for all objects
Object.defineProperty(String.prototype, 'capitalize', {
    value: function() {
      return this.charAt(0).toUpperCase() + this.slice(1);
    },
    enumerable: false
  });

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

    let headerRow = '';
    if(data.developers.length > 0){
        const headers = Object.keys(data.developers[0]);
        console.log("headers: ", headers)
        headers.forEach(h=>{
            headerRow += `<th>${h.capitalize()}</th>`;
        });
        document.querySelector('#table-target thead tr').innerHTML = headerRow;
    }

    let tableBody = '';
    console.log(data);
    data.developers.forEach(item =>{
        let row = '<tr>';
        Object.values(item).forEach(v =>{
            row += `<td>${v}</td>`;
        })
        row += '</tr>';
        tableBody += row;
    });
    //$('#table-target tbody').html(tableBody); for some reason undifined
    document.querySelector('#table-target tbody').innerHTML = tableBody;
}
