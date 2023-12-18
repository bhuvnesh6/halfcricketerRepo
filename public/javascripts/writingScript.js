let content = document.querySelector("#content");
let content11 = document.querySelector(".content11");
let file = document.querySelector("#file");
let view = document.querySelector('#view');
let viewbtn = document.querySelector('#viewbtn');
let sbtn = document.querySelector('#sbtn');
let tin = document.querySelector('#tin').value;
let ttl = document.querySelector('#ttl');
let para = document.querySelector('#para');
let sbumit = document.querySelector("#submit");


 //adding tages  
 var myArray = [];
 function insertValue() {
   // Get the input value
   var inputValue = document.querySelector('#tag').value;

   // Check if the input is not empty
   if (inputValue.trim() !== '') {
     // Add the value to the array
     myArray.push(inputValue);
     // Clear the input field
     document.querySelector('#tag').value = '';
     // Update the displayed list
     updateList();
   }
 }

 function updateList() {
   // Get the ul element
   var ul = document.querySelector('#arr2');

   // Clear the existing list items
   ul.innerHTML = '';

   // Iterate through the array and create list items
   for (var i = 0; i < myArray.length; i++) {
     var p = document.createElement('p');
     p.appendChild(document.createTextNode(myArray[i]));
      ul.appendChild(p);
   }
 }

//insert link in selected text
function addLink() {
    const selection = window.getSelection();
    if (selection.toString().length > 0) {
        const range = selection.getRangeAt(0);
        const linkURL = prompt('Enter the URL:');

        if (linkURL) {
            const link = document.createElement('a');
            link.href = linkURL;
            link.appendChild(document.createTextNode(selection));
            range.deleteContents();
            range.insertNode(link);
        }
    } else {
        alert('Please select some text first.');
    }
}

//convert into h2

  
  let headingCounter = 1; // Initialize a counter for IDs

  function addHeading() {
    // Get the selected text
    let selectedText = window.getSelection().toString();
  
    // Create an h2 element
    let h2Element = document.createElement('h2');
    let textNode = document.createTextNode(selectedText);
    h2Element.appendChild(textNode);
  
    // Set the ID with an incremental number
    h2Element.setAttribute('id', `heading-${headingCounter}`);
    headingCounter++; // Increment the counter for the next ID
  
    // Replace the selected text with the h2 element
    if (window.getSelection().rangeCount) {
      let range = window.getSelection().getRangeAt(0);
      range.deleteContents();
      range.insertNode(h2Element);
    }
  }
  
  

//view content
     
content.addEventListener('input', function(){
    sbtn.disabled = false;
    sbtn.style.background = "green";
})

sbtn.addEventListener("click", function(){
    let contentV = content.innerHTML;
    para.innerHTML += contentV;
    sbtn.disabled = true;
    viewbtn.disabled = false;
    viewbtn.style.background = "green";
    ttl.textContent = tin.value;
    if(sbtn.disabled===false){
        sbtn.style.background = "green"
      }  
});

let num = 1;
viewbtn.addEventListener("click", function(){
    view.style.display = "block";
    if(num === 1){
        view.style.display = "block";
        content11.style.display = "none";
        content.style.display = "none";
        viewbtn.innerHTML = "Edit";
        sbumit.style.display = "block";
        num++;
    }
    else{
        view.style.display = "none";
        content11.style.display = "block";
        content.style.display = "block";
        viewbtn.innerHTML = "View";
        viewbtn.disabled = true;
        viewbtn.style.background = "#99ff99";
        sbumit.style.display = "none";
        num = 1;
        para.innerHTML = "";
        sbtn.disabled = false;
    }
    
});

  
    
      //convert to li
      function addList() {
        // Get the selected text
        let selectedText = window.getSelection().toString();
        
        // Split the selected text by lines
        let lines = selectedText.split('\n');
      
        // Create a new unordered list (ul) element
        let ulElement = document.createElement('ul');
      
        // Create an li element for each line and append it to the ul element
        lines.forEach(line => {
          let liElement = document.createElement('li');
          let textNode = document.createTextNode(line.trim()); // Trim to remove leading/trailing spaces
          liElement.appendChild(textNode);
          ulElement.appendChild(liElement);
        });
      
        // Replace the selected text with the ul element
        if (window.getSelection().rangeCount) {
          let range = window.getSelection().getRangeAt(0);
          range.deleteContents();
          range.insertNode(ulElement);
        }
      }
      
      if(sbtn.disabled===true){
        sbtn.style.background = "#99ff99"
      }   

     