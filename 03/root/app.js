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
    data.developers.forEach(item => {
        let row = '<tr>';
        Object.entries(item).forEach(([key, value]) => {
            console.log("key: ", key, "value: ", value);
            if (key === 'salary') {
                let badge = '';
                if(value < 400000)
                    badge = 'badge bg-danger' //badge-{color} refuses to work
                else if(value > 400000 && value < 700000)
                    badge = 'badge bg-warning'
                else badge = 'badge bg-success'
                let temp = `<span class="${badge}">${value} HUF</span>`;
                console.log("span temp: ", temp)
                value = temp;
            }
            if(key === 'image'){
                let temp = `<img src="${value}" width="30px" height="30px" class="rounded-circle">`;
                value = temp;
            }
            if(key === 'email'){
                let temp = `<a href="mailto: ${value}">${value}</a>`;
                value = temp;
            }
            row += `<td>${value}</td>`;
        });
        row += '</tr>';
        tableBody += row;
    });
    //$('#table-target tbody').html(tableBody); for some reason undifined
    document.querySelector('#table-target tbody').innerHTML = tableBody;
}

function calculateAverageAge() {
    if (!data || !data.developers || data.developers.length === 0) {
        return "No data available";
    }
    const totalAge = data.developers.reduce((sum, dev) => sum + dev.age, 0);
    const averageAge = totalAge / data.developers.length;
    return `Average Age: ${averageAge.toFixed(2)}`;
}



function loadQueries(){
    if(data === null){
        console.log("Data error");
        return;
    }
    //avg
    console.log(data.developers["age"])
    document.querySelector('#Q1').innerHTML = calculateAverageAge();

    
    

}

function toggleQueryVisibility(){
    let calcs = document.querySelector('#calculations');
    let calcBtn = document.querySelector('#calcBtn');
    if(calcs.hidden){
        calcs.hidden = false;
        calcBtn.value = 'Hide Queries'
    } else {
        calcs.hidden = true
        calcBtn.value = 'Show Queries'
    }
}
document.getElementById("calcBtn").addEventListener("click", function () {
    loadQueries();
}, { once: true });



window.addEventListener("load", Init, true); 
async function Init() {
    await loadJson();
    loadTable();
}
