
import axios from 'axios'
import moment from 'moment'
import Noty from 'noty'

//Javascript to toggle the menu
document.getElementById('nav-toggle').onclick = function(){
    document.getElementById("nav-content").classList.toggle("hidden");
}

let addToCart = document.querySelectorAll('.add-to-cart')
let cartCounter = document.querySelector("#cartCounter")

addToCart.forEach((btn) => {

    function updateCart(hotel) {
        axios.post('/update-cart', hotel).then(res => {
            // console.log(res)
            cartCounter.innerText = res.data.totalQty
            console.log(res.data)
            new Noty({
                type: 'success',
                timeout: 1000,
                text: 'Room added to cart',
                progressBar: false,
            }).show();
        }).catch(err => {
            new Noty({
                type: 'error',
                timeout: 1000,
                text: 'Something went wrong',
                progressBar: false,
            }).show();
        })

    }

    btn.addEventListener('click', (e) => {
        // console.log(e)
        let hotel = JSON.parse(btn.dataset.hotel)
        updateCart(hotel)
    })
})

//Remove alert message after x seconds

const alertMsg = document.querySelector('#success-alert')

if(alertMsg) {
    setTimeout(() => {
        alertMsg.remove()
    },10000)
}


// Change book status
let statuses = document.querySelectorAll('.status_line')
let hiddenInput = document.querySelector('#hiddenInput')
let book = hiddenInput ? hiddenInput.value : null
book = JSON.parse(book)
let time = document.createElement('small')

function updateStatus(book) {
    statuses.forEach((status) => {
        status.classList.remove('step-completed')
        status.classList.remove('current')
    })

    let stepCompleted = true;
    statuses.forEach((status) => {
       let dataProp = status.dataset.status
       if(stepCompleted) {
            status.classList.add('step-completed')
       }
       if(dataProp === book.status) {
        stepCompleted = false
        time.innerText = moment(book.updatedAt).format('hh:mm A')
        status.appendChild(time)
       if(status.nextElementSibling) {
        status.nextElementSibling.classList.add('current')
       }
   }
    })
}

updateStatus(book);


//alert message during cancel order
// const dummy = document.getElementById('cancel')
// dummy.addEventListener('click',(e)=> {
//     alert(`You will get refund SMS on your mobile number(given during book), after deducting internet handle charges of ₹20, within 15 minutes. For any query call to our toll free number 4440004440.`)
// })