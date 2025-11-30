// Movie Manager class
class MovieManager {
    constructor(){
        this.allMovies = [];
    }
    loadMovies(movies){
        this.allMovies = movies;
        const movieList = document.getElementById("movies_grid");
        const popularMovieList = document.getElementById("popular_movies");
        movieList.innerHTML = "";
        popularMovieList.innerHTML = "";
        movies.forEach(movie => this.createMovieCard(movie, movieList));
        this.allMovies.forEach(movie => this.createPopularCard(movie, popularMovieList))
    }
    createMovieCard(movie, container){
        const card = document.createElement("article");
        card.className = "card";
        card.innerHTML = `
        <img src="${movie.image_url}" alt="${movie.name}" class="movie_img">
        <div class="card_content">
            <h1 class="movie_name">${movie.name}</h1>
            <p class="movie_year">${movie.year}</p>
        </div>`;
        container.appendChild(card);
    }
    createPopularCard(movie, container){
        const popularMovieCard = document.createElement("div");
        popularMovieCard.className = "popular_movie_card";
        popularMovieCard.innerHTML = `
        <img src="${movie.image_url}" alt="${movie.name}" class="popular_movie_img">
        <div class="popular_card_content">
            <h1 class="popular_movie_name">${movie.name}</h1>
            <p class="popular_movie_year">${movie.year}</p>
        </div>`;
        container.appendChild(popularMovieCard);
    }
    searchMovies(){
        let input, filter, cards_container, card, cards, txtValue;

        input = document.getElementById("search_input");
        filter = input.value.toUpperCase();
        cards_container = document.getElementById("movies_grid");
        cards = cards_container.getElementsByClassName("card");
        for(card of cards){
            txtValue = card.querySelector("h1").textContent;
            if(txtValue.toUpperCase().indexOf(filter) > -1){
                card.style.display = "inline-block";
            }
            else {
                card.style.display = "none";
            }
        }
    }
    searchMoviesHomePage(){
        const saved = sessionStorage.getItem("searchQuery");
        if (saved) {
            const search = document.getElementById('search_input');
            if (search) {
                search.value = saved;
                movieManager.searchMovies();
            }
            sessionStorage.removeItem("searchQuery");
        }
    }
    showError(){
        const moviesGrid = document.getElementById("movies_grid");
        const popularMovies = document.getElementById("popular_movies");
        if(moviesGrid){
            moviesGrid.style.display = "flex";
            moviesGrid.style.justifyContent = "center";
            moviesGrid.style.alignItems = "center";
            moviesGrid.innerHTML = `<div class="movie_error_handler"> Movies couldn't load :((( womp womp</div>`;
        }
        if(popularMovies){
            popularMovies.innerHTML = `<div class="movie_error_handler">womp womp :(( No popular movies</div>`;
        }
    }
}
const movieManager = new MovieManager();


// User Manager class
class UserManager {
    constructor(){

    }
    getUsers(){
        const users = localStorage.getItem("users");
        return users ? JSON.parse(users) : {};
    }
    saveUsers(users){
        localStorage.setItem("users", JSON.stringify(users));
    }
    registerUser(){
        const username = document.getElementById("username_signup").value.trim();
        const email = document.getElementById("email_signup").value.trim();
        const password = document.getElementById("password_signup").value;
        let res = document.getElementById("res");

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/;
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9])/;

        const users = this.getUsers();

        res.innerHTML = "";
        
        if(!username || !email || !password){
            res.innerHTML += `<div class="error_message"> Please fill in all fields. </div>`;
            return;
        }
        if (!emailRegex.test(email)){
            res.innerHTML += `<div class="error_message"> Please enter a valid email address. </div>`;
            return;
        }
        if(password.length < 8 || password.length > 20){
            res.innerHTML += `<div class="error_message"> Password must be 8-20 characters long! </div>`;
            return;
        }
        if(!passwordRegex.test(password)){
            res.innerHTML += `<div class="error_message"> Password must contain at least one letter, one number, and one special character. </div>`;
            return;
        }
        if(users[username]){
            res.innerHTML += `<div class="error_message"> Username already taken. Please choose another one. </div>`;
            return;
        }
        for(let user in users){
            if(users[user].email === email){
                res.innerHTML += `<div class="error_message"> An account with this email already exists. Please log in. </div>`;
                return;
            }
        }
        users[username] = {
            password: password,
            email: email
        };
        this.saveUsers(users);
        
        res.innerHTML = `<div class="error_message" style="color: green;"> Registration successful! You can sign in now. </div>`;

        document.getElementById("username_signup").value = "";
        document.getElementById("email_signup").value = "";
        document.getElementById("password_signup").value = "";
    }
    login(){
        const username = document.getElementById("username_signin").value.trim();
        const password = document.getElementById("password_signin").value;
        const res = document.getElementById("res");

        const users = this.getUsers();

        res.innerHTML = "";
        
        if(!username || !password){
            res.innerHTML += `<div class="error_message"> Please enter both username and password. </div>`;
            return;
        }
        if(!users[username]){
            res.innerHTML += `<div class="error_message"> User not found. </div>`;
            return;
        }
        if(users[username].password !== password){
            res.innerHTML += `<div class="error_message"> Incorrect password. </div>`;
            return;
        }

        sessionStorage.setItem("currentUser", username);
        
        res.innerHTML = `<div class="error_message" style="color: green;"> Logged in successfully! Redirecting... </div>`;
        
        document.getElementById("username_signin").value = "";
        document.getElementById("password_signin").value = "";
        
        window.location.href = "./index.html";
    }
    updateProfileButtonVisibility(){
        const profileBtn = document.getElementById("profile_btn");
        const loginBtn = document.getElementById("login_btn");
        const currentUser = sessionStorage.getItem("currentUser");
        
        if(profileBtn){
            profileBtn.style.display = currentUser ? "flex" : "none";
        }
        if(loginBtn){
            loginBtn.style.display = currentUser ? "none" : "inline-block";
        }
    }
}
const userManager = new UserManager();


// Auto Slider
let slideIndex = 0;
function autoSlider() {
    let slides = document.getElementsByClassName("bg_posters");
    for (let i = 0; i < slides.length; i++) {
        slides[i].classList.remove("active");
    }
    slideIndex = slideIndex + 1;
    
    if (slideIndex > slides.length) {
        slideIndex = 1;
    }
    if (slides[slideIndex - 1]) {
        slides[slideIndex - 1].classList.add("active");
    }
    setTimeout(autoSlider, 3000);
}



document.addEventListener('DOMContentLoaded', () => {
    const homePageInputBar = document.getElementById("homepage_input_bar");
    const searchBtn = document.getElementById("search_btn");
    const signupForm = document.getElementById("signup_form");
    const signinForm = document.getElementById("signin_form");
    const profileBtn = document.getElementById("profile_btn");
    const profilePanel = document.getElementById("profile_panel");
    const logoutPanelBtn = document.getElementById("logout_panel_btn");
    const deleteAccountBtn = document.getElementById("delete_account_btn");
    const profileUsername = document.getElementById("profile_username");
    const searchInput = document.getElementById("search_input");
    const slides = document.getElementsByClassName("bg_posters");
    const burger = document.getElementById("burger");
    const xmark = document.getElementById("xmark");
    const menu_nav = document.querySelector(".header_nav");

    userManager.updateProfileButtonVisibility();

    // burger menu
    if (burger && xmark && menu_nav){
        burger.addEventListener("click", () => {
            menu_nav.classList.add('open');
            burger.style.display = 'none';
            xmark.style.display = 'block';
        });
        xmark.addEventListener("click", () => {
            menu_nav.classList.remove('open');
            xmark.style.display = 'none';
            burger.style.display = 'block';
        });
    }
    // homepage search bar
    if(homePageInputBar){
        homePageInputBar.addEventListener('keydown', (key) => {
            if (key.key === 'Enter') {
                key.preventDefault();
                const inputValue = homePageInputBar.value.trim();
                if(inputValue === "") return;
                sessionStorage.setItem("searchQuery", inputValue);
                window.location.href = "./movies.html";
            }
        });
        if(searchBtn){
            searchBtn.addEventListener('click', () => {
                const inputValue = homePageInputBar.value.trim();
                if(inputValue === "") return;
                sessionStorage.setItem("searchQuery", inputValue);
                window.location.href = "./movies.html";
                console.log(`input value: ${inputValue}`)
            }); 
        };    
}
    // search bar
    if(searchInput){
        searchInput.addEventListener('keyup', () => {
            movieManager.searchMovies();
        });
    }
    // autoSlider
    if (slides.length > 0) {
        slides[0].classList.add("active");
        slideIndex = 0;
    }
    setTimeout(autoSlider, 3000);
    // Profile button
    if(profileBtn && profilePanel){
        profileBtn.addEventListener('click', () => {
            const currentUser = sessionStorage.getItem("currentUser");
            if(currentUser && profileUsername){
                profileUsername.textContent = currentUser;
            }
            profilePanel.classList.toggle('active');
        });
    }
    // Sign in
    if(signupForm){
        signupForm.addEventListener('submit', (event) => {
            event.preventDefault();
            userManager.registerUser();
        });
    }
    // Sign up
    if(signinForm){
        signinForm.addEventListener('submit', (event) => {
            event.preventDefault();
            userManager.login();
        });
    }
    // Log out
    if(logoutPanelBtn){
        logoutPanelBtn.addEventListener('click', () => {
            sessionStorage.removeItem("currentUser");
            if(profilePanel){
                profilePanel.classList.remove('active');
            }
            userManager.updateProfileButtonVisibility();
            alert("Logged out successfully.");
            window.location.reload();
        });
    }
    // Delete account
    if(deleteAccountBtn){
        deleteAccountBtn.addEventListener('click', () => {
            const currentUser = sessionStorage.getItem("currentUser");
            const users = userManager.getUsers();
            delete users[currentUser];
            userManager.saveUsers(users);
            sessionStorage.removeItem("currentUser");
            userManager.updateProfileButtonVisibility();
            alert("Account deleted successfully.");
            window.location.reload();
        });
    }
});


fetch("movies.json")
    .then(res => res.json())
    .then(movies => {
        allMovies = movies;
        movieManager.loadMovies(movies);
        movieManager.searchMoviesHomePage();
    })
    .catch(error => {
        movieManager.showError();
    })