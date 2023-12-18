let checkbtn = document.querySelector("#checkbtn");
let nav = document.querySelector("nav");

let condt = 1;
console.log(condt)


checkbtn.addEventListener("click", function () {
    if (condt === 1) {
        nav.style.display = "block";
        condt = 2;
    }
    else {
        nav.style.display = "none";
        condt = 1;
    }

})

//fatching the data from api
/*
const url = 'https://cricbuzz-cricket.p.rapidapi.com/mcenter/v1/40381/hscard';
const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': 'a3f7a57beemsh2d8c1d92b0e2fddp13117cjsn74e9d6d82b04',
		'X-RapidAPI-Host': 'cricbuzz-cricket.p.rapidapi.com'
	}
};

const apicall = fetch(url, options);

apicall.then((data)=>{
    return data.json();
}).then((value)=>{
    console.log(JSON.stringify(value));
})*/

const array = ["hi", "hello", "holi"];
const object = {};

for (let i = 0; i < array.length; i++) {
  object[i] = array[i];
}

console.log(object);
