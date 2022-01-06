const balanceE1=document.querySelector(".balance .value");
const incomeTotalE1=document.querySelector('.income-total');
const chartE1=document.querySelector('.chart');
const outcomeTotalE1=document.querySelector('.outcome-total');
const incomeList=document.querySelector('#income .list');
const expenseList=document.querySelector('#expense .list');
const allList=document.querySelector('#all .list');
const incomeE1=document.querySelector('#income');
const expenseE1=document.querySelector('#expense');
const allE1=document.querySelector('#all');
const addIncome=document.querySelector('.add-income');
const incomeTitle=document.querySelector('#income-title-input');
const incomeAmount=document.querySelector('#income-amount-input');
const addExpense=document.querySelector('.add-expense');
const expenseTitle=document.querySelector('#expense-title-input');
const expenseAmount=document.querySelector('#expense-amount-input');
let balance =0,income=0,outcome=0;
//button
const expenseBtn=document.querySelector('.tab1');
const incomeBtn=document.querySelector('.tab2');
const allBtn=document.querySelector('.tab3');
let ENTRY_LIST;
const canvas=document.createElement('canvas');
const ctx=canvas.getContext('2d');
canvas.width=50;
canvas.height=50;
const R=20;
ctx.lineWidth=8;
chartE1.appendChild(canvas);
ENTRY_LIST=JSON.parse(localStorage.getItem('entry_list'))||[];
updateUI();

expenseBtn.addEventListener('click',function(){
    active(expenseBtn);
    inactive([incomeBtn,allBtn]);
    show(expenseE1);
    hide([incomeE1,allE1]);
})

incomeBtn.addEventListener("click", function () {
        active(incomeBtn);
        inactive([expenseBtn, allBtn]);
        show(incomeE1);
        hide([expenseE1, allE1]);
    })
allBtn.addEventListener('click',function(){
    active(allBtn);
    inactive([expenseBtn,incomeBtn]);
    show(allE1);
    hide([expenseE1, incomeE1]);
})

function active(element){
    element.classList.add('active');
}

function show(element){
    element.classList.remove('hide');
}

function inactive(elementArray){
    elementArray.forEach(element => {
        element.classList.remove('active');
    });
}

function hide(elementArray){
    elementArray.forEach(element => {
        element.classList.add('hide');
    });
}

//Entry
addIncome.addEventListener('click',function(){
    if(!incomeTitle.value||!incomeAmount.value){
        return;
    }
    let income={
        type: 'income',
        title:incomeTitle.value,
        amount:parseFloat(incomeAmount.value)
    }
    ENTRY_LIST.push(income);
    updateUI();
    clearInput([incomeTitle,incomeAmount])
})

addExpense.addEventListener('click',()=>{
    if (!expenseTitle.value||!expenseAmount.value){
        return;
    }
    let expense={
        type:'expense',
        title:expenseTitle.value,
        amount:parseFloat(expenseAmount.value)
    }
    ENTRY_LIST.push(expense);
    updateUI();
    clearInput([expenseTitle,expenseAmount]);
})

function clearInput(inputs){
    inputs.forEach(input => {
        input.value="";
    });
}

function calculateTotal(type,list){
    let sum=0;
    list.forEach(entry=>{
        if(entry.type==type){
            sum+=entry.amount;
        }
    })
    return sum;
}

function calculateBalance(income,outcome) {
    return income-outcome;
}

function showEntry(list,type,title,amount,id){
    const entry=`<li class="${type}" id="${id}">
    <div class="entry">${title}:${amount}</div>
     <div id="edit"></div>
     <div id="delete"></div>
</li>`;
const position="afterbegin";
list.insertAdjacentHTML(position,entry);
}

function clearElement(elements) {
    elements.forEach(element => {
        element.innerHTML="";
    });
}
//update

function updateUI(){
    let income=calculateTotal('income',ENTRY_LIST);
    let outcome=calculateTotal('expense',ENTRY_LIST);
    let balance=Math.abs(calculateBalance(income,outcome));
    let sign=(income>=outcome) ? "$" : "-$";
    balanceE1.innerHTML=`<small>${sign}</small>${balance}`;
    incomeTotalE1.innerHTML=`<small>$</small>${income}`;
    outcomeTotalE1.innerHTML=`<small>$<small>${outcome}`;
    clearElement([incomeList,expenseList,allList]);
    ENTRY_LIST.forEach((entry,index) => {
        if(entry.type=="income"){ 
            showEntry(incomeList,entry.type,entry.title,entry.amount,index);
        }
        else if(entry.type=="expense"){
            showEntry(expenseList,entry.type,entry.title,entry.amount,index);
        }
        showEntry(allList, entry.type, entry.title, entry.amount, index);
    });
    updateChart(income,outcome);
    
    //to store the value
    localStorage.setItem("entry_list", JSON.stringify(ENTRY_LIST));
}





// ctx.arc(x,y,Radius,startAngle,endAngle,anticlockwise)


function drawCircle(color,ratio,anticlockwise){
    ctx.strokeStyle=color;
    ctx.beginPath();
    ctx.arc(canvas.width/2,canvas.height/2,R,0,ratio*2*Math.PI,anticlockwise);
    ctx.stroke();
}
function updateChart(income,outcome){
    ctx.clearRect(0,0,canvas.width, canvas.height);
    let ratio=income/(income+outcome);
    drawCircle("#ffffff",-ratio,true);
    drawCircle('#f0624d',1-ratio,false);
}

//delete or edit
const DELETE='delete';
const EDIT='edit';
function deleteEntry(ENTRY) {
    ENTRY_LIST.splice(ENTRY.id,1);
    updateUI();
}

function editEntry(ENTRY) {
    let entry=ENTRY_LIST[ENTRY.id];
    if(entry.type=='income'){
        incomeAmount.value=entry.amount;
        incomeTitle.value=entry.title
    }
    else if (entry.type=="expense") {
        expenseAmount.value=entry.amount;
        expenseTitle.value=entry.title;
    }
    deleteEntry(ENTRY);
}

function deleteOrEdit(e) {
    const targetbtn=e.target;
    const parentt=targetbtn.parentNode;
    if(targetbtn.id=="edit"){
        editEntry(parentt);
    }
    else if (targetbtn.id=="delete") {
        deleteEntry(parentt);
    }
}

incomeList.addEventListener('click',deleteOrEdit);
expenseList.addEventListener('click',deleteOrEdit);
allList.addEventListener('click',deleteOrEdit);








