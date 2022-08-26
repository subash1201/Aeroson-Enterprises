const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu");

hamburger.addEventListener("click", ()=>{
    console.log("HI");
    hamburger.classList.toggle("active");
    navMenu.classList.toggle("active");
});



const height = (elem) => {
	return elem.getBoundingClientRect().height
}

const distance = (elemA, elemB, prop) => {
	const sizeA = elemA.getBoundingClientRect()[prop]
	const sizeB = elemB.getBoundingClientRect()[prop]
	return sizeB - sizeA
}

const factor = (elemA, elemB, prop) => {
	const sizeA = elemA.getBoundingClientRect()[prop]
	const sizeB = elemB.getBoundingClientRect()[prop]
	return sizeB / sizeA
}

document.querySelectorAll('.card').forEach((elem) => {

	const head = elem.querySelector('.card__head')
	const image = elem.querySelector('.card__image')
	const body = elem.querySelector('.card__body')
	elem.onmouseenter = () => {
		elem.classList.add('hover')

		const imageScale = 1 + factor(head, body, 'height')
		image.style.transform = `scale(${ imageScale })`

	}
	elem.onmouseleave = () => {
		elem.classList.remove('hover')
		image.style.transform = `none`
		body.style.transform = `none`
	}
})


const submit = document.querySelector(".feedbacksubmit");

submit.addEventListener('click' , function(){

            console.log("clicked");

            var review = document.querySelector(".review");
			var thankyou = document.querySelector(".review-info");
			// const reviewAppend = document.querySelector("#clients");
            var custname = document.querySelector(".name").value;
            console.log(custname);
            var email = document.querySelector(".email").value;
            var feedback = document.querySelector(".feedback").value;
            console.log(feedback);
			if(custname == "" || email == "" || feedback == ""){
				alert("Please fill out all the fields");
			}



			if(custname != "" && email != "" && feedback != ""){
				const reviewElement = ` <div style="margin:10px auto; width:70%; border: 1px solid black; padding:10px; border-radius: 5px;">
				<div style="display:flex; align-items:center;">
					<h3>${custname}</h3>
					<h5 style="color: grey; margin-left: 20px;">${email}</h5>
				</div>
				<p>${feedback}</p>
				</div>`

				thankyou.innerHTML = `<h2>Thanks for your feedback</h2>`
            	review.innerHTML += reviewElement;
				sendEmail(custname , email , feedback);
			}



			// sendEmail(custname , email , feedback);
			var custname = document.querySelector(".name").value="";
      var email = document.querySelector(".email").value="";
      var feedback = document.querySelector(".feedback").value="";

} );


function sendEmail(custname , email , feedback) {
	Email.send({
		Host: "smtp.gmail.com",
		Username: "subash3sj12@gmail.com",
		Password: "heyxpdrznoxufuhp",
		To: 'subash3sj12@gmail.com',
		From: "subash3sj12@gmail.com",
		Subject: `${custname} sent you a feedback`,
		Body: `Name: ${custname} <br/> Email: ${email} <br/> Feedback: ${feedback}`,
	  }).then(function (feedback) {
		  alert("mail sent successfully")
		});
}


// function addToCartClicked(event) {
//     var button = event.target
//     var shopItem = button.parentElement.parentElement
//     var title = shopItem.getElementsByClassName('shop-item-title')[0].innerText
//     var price = shopItem.getElementsByClassName('shop-item-price')[0].innerText
//     var imageSrc = shopItem.getElementsByClassName('shop-item-image')[0].src
//     var id = shopItem.dataset.itemId
//     addItemToCart(title, price, imageSrc, id)
//     updateCartTotal()
// }

// function addItemToCart(title, price, imageSrc, id) {
//     var cartRow = document.createElement('div')
//     cartRow.classList.add('cart-row')
//     cartRow.dataset.itemId = id
//     var cartItems = document.getElementsByClassName('cart-items')[0]
//     var cartItemNames = cartItems.getElementsByClassName('cart-item-title')
//     for (var i = 0; i < cartItemNames.length; i++) {
//         if (cartItemNames[i].innerText == title) {
//             alert('This item is already added to the cart')
//             return
//         }
//     }
//     var cartRowContents = `
//         <div class="cart-item cart-column">
//             <img class="cart-item-image" src="${imageSrc}" width="100" height="100">
//             <span class="cart-item-title">${title}</span>
//         </div>
//         <span class="cart-price cart-column">${price}</span>
//         <div class="cart-quantity cart-column">
//             <input class="cart-quantity-input" type="number" value="1">
//             <button class="btn btn-danger" type="button">REMOVE</button>
//         </div>`
//     cartRow.innerHTML = cartRowContents
//     cartItems.append(cartRow)
//     cartRow.getElementsByClassName('btn-danger')[0].addEventListener('click', removeCartItem)
//     cartRow.getElementsByClassName('cart-quantity-input')[0].addEventListener('change', quantityChanged)
// }
