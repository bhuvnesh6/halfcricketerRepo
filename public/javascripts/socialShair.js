let articlID = document.querySelector('#urlid').value;
let articleurl = `http://localhost:3000/articles/${articlID}`;
// Function to share on Facebook
 function shareOnFacebook() {
    // Replace 'your-article-url' with the actual URL of your article
    var url = encodeURIComponent(articleurl);
    window.open('https://www.facebook.com/sharer/sharer.php?u=' + url, 'Facebook Share', 'width=600,height=400');
  }

  // Function to share on Twitter
  function shareOnTwitter() {
    // Replace 'your-article-url' with the actual URL of your article
    var url = encodeURIComponent(articleurl);
    window.open('https://twitter.com/intent/tweet?url=' + url, 'Twitter Share', 'width=600,height=400');
  }

  // Function to share on WhatsApp
  function shareOnWhatsApp() {
    // Replace 'your-article-url' with the actual URL of your article
    var url = encodeURIComponent(articleurl);
    window.open('https://api.whatsapp.com/send?text=' + url, 'WhatsApp Share', 'width=600,height=400');
  }

  // Function to copy link to clipboard
  function copyLink() {
    // Replace 'your-article-url' with the actual URL of your article
    var url = articleurl;

    // Create a temporary input element
    var input = document.createElement('input');
    input.style.position = 'fixed';
    input.style.opacity = 0;
    input.value = url;

    // Append the input element to the body
    document.body.appendChild(input);

    // Select and copy the URL
    input.select();
    document.execCommand('copy');

    // Remove the temporary input element
    document.body.removeChild(input);

    // You can add a feedback message here if needed
    alert('Link copied to clipboard!');
  }

  //handle share route
  document.addEventListener('DOMContentLoaded', function() {
    let arid = document.querySelector('#urlid').value;

    async function sharen() {
        const data = {
            urlid: arid,
        };

        try {
            // Assuming you're using fetch to make the request
            const response = await fetch('/share', {
                method: 'POST', // Use 'POST' if needed
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            // Handle the response as needed
            const responseData = await response.json();
            console.log(responseData);
        } catch (error) {
            console.error('Error:', error);
        }
    }
    window.sharen = sharen;
    // Call the function or attach it to an event like a button click, etc.
    // Example: document.querySelector('#yourButtonId').addEventListener('click', sharen);
});
