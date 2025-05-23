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
        //console.log(data);
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
    //console.log (data.developers.length);

    let headerRow = '';
    if(data.developers.length > 0){
        const headers = Object.keys(data.developers[0]);
        //console.log("headers: ", headers)
        headers.forEach(h=>{
            headerRow += `<th>${h.capitalize()}</th>`;
        });
        document.querySelector('#table-target thead tr').innerHTML = headerRow;
    }

    let tableBody = '';
    data.developers.forEach(item => {
        let row = '<tr>';
        Object.entries(item).forEach(([key, value]) => {
            if (key === 'salary') {
                let badge = '';
                if(value < 400000)
                    badge = 'badge bg-danger' //badge-{color} refuses to work
                else if(value > 400000 && value < 700000)
                    badge = 'badge bg-warning'
                else badge = 'badge bg-success'
                let temp = `<span class="${badge}">${value} HUF</span>`;
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
    return `Átlag életkor: ${averageAge.toFixed(2)}`;
}

function calculateAveragePay(){
    if (!data || !data.developers || data.developers.length === 0) {
        return "No data available";
    }

    const frontEndPay = data.developers.filter(dev=>
        dev.job && dev.job.includes("Frontend"))
        .reduce((sum,dev) => sum + dev.salary, 0);
    return `Átlag Frontendes fizetés: ${(frontEndPay/data.developers.length).toFixed(2)} HUF` 
}

function calculateMultitasker(){
    if (!data || !data.developers || data.developers.length === 0) {
        return "No data available";
    }

    const mostSkills = data.developers.reduce((max, dev) => {
        const skillsCount = dev.skills.length;
        return skillsCount > max.skillsCount ? { name: dev.name, skillsCount } : max;
    }, { name: '', skillsCount: 0 }).name;

    return `${mostSkills} ért a legtöbbmindenhez`
}

function calculateCompany(){
    if (!data || !data.developers || data.developers.length === 0) {
        return "No data available";
    }

    const companyMap = new Map();
    for (let i = 0; i < data.developers.length; i++) {
        let companyFromMail = data.developers[i].email.split('@')[1].split('.')[0];
        if(companyMap.has(`${companyFromMail}`)){
            companyMap.set(`${companyFromMail}`,  companyMap.get(`${companyFromMail}`)+1)
        } else{
            companyMap.set(`${companyFromMail}`, 1);
        }
    }

    let mostCompanies = '';
    let maxCount = 0;

    companyMap.forEach((count, company) => {
        if (count > maxCount) {
            maxCount = count;
            mostCompanies = company;
        }
    });

    return `A legtöbb fejlesztő a ${mostCompanies} cégtől van.`;
}

function calculateMinAge(){
    if (!data || !data.developers || data.developers.length === 0) {
        return "No data available";
    }

    let minAge = data.developers.reduce((min, dev) => {
        return dev.age < min.age ? {name: dev.name, salary: dev.salary} : min
    })

    return `${minAge.name} a leg fiatalabb és ${minAge.salary} HUF-ot keres`
}

function calculateDiffOldestYoungest(){
    let minAge = data.developers.reduce((min, dev) => {
        return dev.age < min.age ? {name: dev.name, salary: dev.salary} : min
    }).salary



    let maxAge = data.developers.reduce((max, dev) => {
        return dev.age > max.age ? {name: dev.name, salary: dev.salary} : max
    }).salary


    return `A külömbség ${maxAge >= minAge ? (maxAge-minAge) : (minAge-maxAge)} HUF`
}

function averagePayPerJob(){
    let jobMap = new Map();
    let jobCountMap = new Map();
    for(let i = 0; i < data.developers.length;i++){
        if(jobMap.has(data.developers[i].job)){
            jobMap.set(`${data.developers[i].job}`
                    , jobMap.get(`${data.developers[i].job}`)+data.developers[i].salary
            );
            jobCountMap.set(`${data.developers[i].job}`
                , jobCountMap.get(`${data.developers[i].job}`)+1
            );
        } else {
            jobMap.set(`${data.developers[i].job}`, data.developers[i].salary);
            jobCountMap.set(`${data.developers[i].job}`,1);
        }
    }

    //console.log(jobMap)
    //console.log(jobCountMap)

    let outp = '<div class="container"><div class="row" id="job-avg-row">';
    let outpLeft = '<div class="col-lg-6 col-md-12 text-end">'
    let outpRight = '<div class="col-lg-6 col-md-12 text-start">'
 
    jobMap.forEach((key, value)=>{
        //console.log(value);
        //console.log("key: ", key);
        jobMap.set(`${value}`, key / jobCountMap.get(`${value}`));
        outpLeft += `<div>${value} : </div>`
        outpRight += `<div>${key} </div>`
    })

    outpLeft+= '</div>';
    outpRight+= '</div>';
    outp+= outpLeft;
    outp+= outpRight;
    outp+= '</div></div>'
    //console.log(jobMap)

    return outp;
    
}   

function loadQueries(){
    if(data === null){
        console.log("Data error");
        return;
    }
    //avg age
    document.getElementById('Q1').innerHTML = calculateAverageAge();
    //avg frontend pay
    document.getElementById('Q2').innerHTML = calculateAveragePay();
    //most skills
    document.getElementById('Q3').innerHTML = calculateMultitasker();
    //most companies
    document.getElementById('Q4').innerHTML = calculateCompany();
    //youngest
    document.getElementById('Q5').innerHTML = calculateMinAge();
    //diff between youngest and oldest
    document.getElementById('Q6').innerHTML = calculateDiffOldestYoungest();
    document.getElementById('Q7').innerHTML = averagePayPerJob();
}

function toggleQueryVisibility(){
    let calcs = document.querySelector('#calculations');
    let calcBtn = document.querySelector('#calcBtn');
    if(calcs.hidden){
        calcs.hidden = false;
        calcBtn.value = 'Lekérdezés elrejtése'
    } else {
        calcs.hidden = true
        calcBtn.value = 'Lekérdezés mutatása'
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
