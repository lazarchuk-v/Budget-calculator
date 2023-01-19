import {v4 as uuidv4} from 'uuid'
import {useState, useEffect} from "react";

import './App.css';
import ExpenceList from "./components/ExpenceList";
import ExpenceForm from "./components/ExpenceForm";
import Alert from "./components/Alert";




// const initialExpences = [
//     {id: uuidv4(), charge: "rent", amount: 3200},
//     {id: uuidv4(), charge: "car payment", amount: 800},
//     {id: uuidv4(), charge: "credit card bill", amount: 2400},
// ];



const initialExpences = localStorage.getItem('expenses')
?   JSON.parse(localStorage.getItem('expenses'))
    : []

function App() {
    //***************** state values *****************
    //all expenses, add expense
    const [expenses, setExpenses] = useState(initialExpences);

    // single expense
    const [charge,setCharge] = useState('')

    // single amount
    const [amount,setAmount] = useState('')

    //alert
    const [alert,setAlert]=useState({show:false})

    //edit
    const [edit,setEdit] = useState(false)

    //edit item
    const [id,setId] = useState(0)

    //***************** useEffect *****************
useEffect(()=>{
    console.log('we used useEffect')
    localStorage.setItem('expenses',JSON.stringify(expenses))
},[expenses])


    //***************** functionality *****************
    //handle charge
    const handleCharge = e =>{
        console.log(`charge ${e.target.value}`);
        setCharge(e.target.value)
    }
    //handle amount
    const handleAmount = e =>{
        console.log(`amount ${e.target.value}`);
        setAmount(e.target.value)
    }

    //handle alert
const handleAlert = ({type,text}) =>{
        setAlert({show:true,type,text});
        setTimeout(()=>{
            setAlert({show:false})
        },3000)
}

    //handle submit
    const handleSubmit = e =>{
        e.preventDefault()
      if(charge !== "" && amount > 0){
         if(edit){
                let tempExpenses = expenses.map(item => {
                    return item.id === id?{...item, charge,amount} :item
                })
             setExpenses(tempExpenses)
             setEdit(false)
             handleAlert({type:'success', text:'item edited'})

             } else {
    const singleExpense = {id:uuidv4(),charge,amount}
    setExpenses([...expenses,singleExpense])
    handleAlert({type:'success',text:'item added'})
                }

          setCharge('')
          setAmount('')

      }else{
          //handle alert called
          handleAlert({type:'danger',text:`charge can't be empty`})
      }
    }

    //clear all items
    const clearItems = () =>{
        setExpenses([])
        handleAlert({type:'danger',text:'All items deleted'})
    }

    //handle delete
    const handleDelete = (id) =>{
        let tempExpenses = expenses.filter(item => item.id !== id)
        setExpenses(tempExpenses)
        handleAlert({type:'danger',text:'item deleted'})
    }

    //handle edit
    const handleEdit = (id) =>{
        let expense = expenses.find(item => item.id === id)
        let {charge,amount} = expense
        setCharge(charge)
        setAmount(amount)
        setEdit(true)
        setId(id)
    }

    return (
        <>
            {alert.show && <Alert type={alert.type} text={alert.text} />}
            <Alert/>

            <h1>budget calculatos</h1>
            <main className={'App'}>

                <ExpenceForm
                    charge={charge}
                    amount={amount}
                    handleAmount={handleAmount}
                    handleCharge={handleCharge}
                    handleSubmit={handleSubmit}
                    edit={edit}
                />

                <ExpenceList
                    expenses={expenses}
                    handleDelete={handleDelete}
                    handleEdit={handleEdit}
                    clearItems={clearItems}
                />

            </main>

            <h1>
                total spending : {' '}
                <span className={'total'}>

    ${expenses.reduce((acc, curr) => {
                    return (acc += parseInt(curr.amount));
                }, 0)} </span>
            </h1>
        </>
    );
}

export default App;
