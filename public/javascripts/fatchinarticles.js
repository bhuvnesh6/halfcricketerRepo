
    const articlesPerPage = 6;
    let currentPage = 1;
 
   console.log("conected")

    const articleContainer = document.querySelector('.ct');
    const loadMoreBtn = document.querySelector('.loadmoreB');

    // Function to fetch and render articles
     async function  fetchAndRenderArticles(){
      try {
        const response = await fetch(`/api/articles?page=${currentPage}&limit=${articlesPerPage}`);

       
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }

         const newArticles = await response.json();

     console.log(newArticles);
        if (newArticles.length > 0) {
          newArticles.forEach((data) => {
            // Render the new article using EJS or any other template engine
            const articleHTML = `<div class="card">
            <div class="imge"><img
                    src="https://media.istockphoto.com/id/1320338916/photo/female-cricket-player-hitting-the-ball-with-her-bat.jpg?s=612x612&w=0&k=20&c=Et6jZ7Hux8HtB67jWT1gDCaEnLvVdcpvQi_JTyQ8R98="       alt=""></div>
            <a href="/articles/${data._id }">
                <div class="contentS">
                    <h2>
                        ${ data.title}
                    </h2>
                    <button class="l"><div class="svgb">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 1024 1024" class="icon" version="1.1"><path d="M933.387 517.868C950.274 477.276 960 431.509 960 382.887c0-165.301-109.993-299.305-245.677-299.305-83.964 0-158.011 51.39-202.323 129.684-44.31-78.295-118.357-129.685-202.321-129.685C173.994 83.581 64 217.586 64 382.887c0 57.701 13.632 111.398 36.851 157.102 56.694 135.957 196.112 269.389 414.1 400.428 149.872-95.245 273.613-208.473 368.923-341.271 14.435-16.802 49.513-81.278 49.513-81.278z" fill="#FF3B30"/><path d="M484 254.385c8.327-14.713 17.706-28.474 28-41.12-57.022-96.69-134.136-129.682-202.321-129.682-9.409 0-18.659 0.786-27.794 2.039C354.075 95.7 444.727 184.995 484 254.385zM714.323 83.583c-9.547 0-18.946 0.75-28.206 2.039C808.697 102.462 904 229.049 904 382.888c0 48.623-9.724 94.386-26.613 134.982 0 0-35.08 64.473-49.515 81.277-89.475 124.668-204.315 231.88-342.002 323.366 9.592 5.971 19.163 11.942 29.079 17.905 149.872-95.244 273.613-208.474 368.923-341.271 14.434-16.805 49.514-81.277 49.514-81.277C950.276 477.274 960 431.511 960 382.888c0-165.302-109.993-299.305-245.677-299.305z" fill=""/></svg>
                     ${data.likes.length }</div></button>
                    <button class="l">
                        <div class="svgb">
                            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#000000" height="20px" width="20px" version="1.1" id="Capa_1" viewBox="0 0 80.794 80.794" xml:space="preserve">
                                <g>
                                    <g>
                                        <path d="M79.351,38.549c-0.706-0.903-17.529-22.119-38.953-22.119c-21.426,0-38.249,21.216-38.955,22.119L0,40.396l1.443,1.847    c0.706,0.903,17.529,22.12,38.955,22.12c21.424,0,38.247-21.217,38.953-22.12l1.443-1.847L79.351,38.549z M40.398,58.364    c-15.068,0-28.22-13.046-32.643-17.967c4.425-4.922,17.576-17.966,32.643-17.966c15.066,0,28.218,13.045,32.642,17.966    C68.614,45.319,55.463,58.364,40.398,58.364z"/>
                                        <path d="M40.397,23.983c-9.052,0-16.416,7.363-16.416,16.414c0,9.053,7.364,16.417,16.416,16.417s16.416-7.364,16.416-16.417    C56.813,31.346,49.449,23.983,40.397,23.983z M40.397,50.813c-5.744,0-10.416-4.673-10.416-10.417    c0-5.742,4.672-10.414,10.416-10.414c5.743,0,10.416,4.672,10.416,10.414C50.813,46.14,46.14,50.813,40.397,50.813z"/>
                                    </g>
                                </g>
                                </svg>
                         ${data.views}
                    </div>
                    </button>
                    <button class="l">
                        <div class="svgb">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="-0.5 0 25 25" fill="none">
                                <path d="M13.47 4.13998C12.74 4.35998 12.28 5.96 12.09 7.91C6.77997 7.91 2 13.4802 2 20.0802C4.19 14.0802 8.99995 12.45 12.14 12.45C12.34 14.21 12.79 15.6202 13.47 15.8202C15.57 16.4302 22 12.4401 22 9.98006C22 7.52006 15.57 3.52998 13.47 4.13998Z" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                       ${data.Shares} </div>
                    </button>
                    <p class="pera">
                        ${ data.discription }
                    </p>
                </div>
            </a>
        </div>`;
            articleContainer.innerHTML += articleHTML;
          });

          currentPage++;
          console.log("conected");
        } else {
          // No more articles to load, hide the "Load More" button
          loadMoreBtn.style.disply = "none";
        }
      } catch (error) {
        console.error('Error fetching articles:', error);
      }
    };

    // Event listener for the "Load More" button
   


