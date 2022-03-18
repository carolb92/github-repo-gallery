// profile information
const profileInfo = document.querySelector(".overview");

const username = "carolb92";

// display repo unordered list
const repoList = document.querySelector(".repo-list");

// selects section where all repo information appears
const repoSection = document.querySelector(".repos");

// selects section where the individual repo data will appear
const individualRepoData = document.querySelector(".repo-data");

// selects back to repo gallery button
const backToRepoButton = document.querySelector(".view-repos");

// selects input
const filterInput = document.querySelector(".filter-repos");

// function to fetch github user data
const getUserData = async function () {
    const response = await fetch(`https://api.github.com/users/${username}`);
    const userData = await response.json();
    console.log(userData);
    userInfo(userData);
};
getUserData();

// function to display the fetched user information
const userInfo = function (userData) {
    const userInfoDiv = document.createElement("div");
    userInfoDiv.classList.add("user-info");
    userInfoDiv.innerHTML = 
        `<figure>
            <img alt="user avatar" src=${userData.avatar_url} />
        </figure>
        <div>
            <p><strong>Name:</strong> ${userData.name}</p>
            <p><strong>Bio:</strong> ${userData.bio}</p>
            <p><strong>Location:</strong> ${userData.location}</p>
            <p><strong>Number of public repos:</strong> ${userData.public_repos}</p>
        </div>`;
        profileInfo.append(userInfoDiv);
    getRepos();
};

// function to fetch repo data w/ parameters for most recently updated and limit of 100 per page
const getRepos = async function () {
    const reposRes = await fetch (`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`);
    const repos = await reposRes.json();
    console.log(repos);
    displayRepoInfo(repos);
    filterInput.classList.remove("hide");
};

// function to display information about each repo
const displayRepoInfo = function (repos) {
    for (let item of repos) {
        let li = document.createElement("li");
        li.classList.add("repo");
        li.innerHTML = `<h3> ${item.name} </h3>`;
        repoList.append(li);
    }
};

// click event listener on the unordered list w/ class repo-list
repoList.addEventListener("click", function (e) {
    // checks if the event target (the element that was clicked on) matches the <h3> element (the name of the repo)
    if (e.target.matches("h3")) {
        // targets the innerText where the event happens
        let repoName = e.target.innerText;
        getRepoInfo(repoName);
    }
});

// function to get specific repo information
const getRepoInfo = async function (repoName) {
    const repoInfoRes = await fetch(`https://api.github.com/repos/${username}/${repoName}`);
    const repoInfo = await repoInfoRes.json();
    console.log(repoInfo);

    // fetch data from the languages_url property of repoInfo
    const fetchLanguages = await fetch(repoInfo.languages_url);
    const languageData = await fetchLanguages.json();
    console.log(languageData);

    // make a list of languages
    const languages = [];
    for (let language in languageData) {
        languages.push(language);
    }
    console.log(languages);
    displayIndivRepoInfo(repoInfo, languages);
};

// function to display specific repo information
const displayIndivRepoInfo = function (repoInfo, languages) {
    individualRepoData.innerHTML = "";
    const individualRepoDiv = document.createElement("div");
    individualRepoDiv.innerHTML = `
    <h3>Name: ${repoInfo.name}</h3>
        <p> Description: ${repoInfo.description}</p>
        <p> Default Branch: ${repoInfo.default_branch}</p>
        <p> Languages: ${languages.join(", ")}</p>
        <a class="visit" href="${repoInfo.html_url}" target="_blank" rel="noreferrer noopener">View Repo on GitHub!</a>
    `
    individualRepoData.append(individualRepoDiv);
    individualRepoData.classList.remove("hide");
    repoSection.classList.add("hide");
    backToRepoButton.classList.remove("hide");
};

backToRepoButton.addEventListener("click", function (){
    repoSection.classList.remove("hide");
    individualRepoData.classList.add("hide");
    backToRepoButton.classList.add("hide");
});

// dynamic search
filterInput.addEventListener("input", function (e) {
    const searchText = e.target.value;
    console.log(searchText);
    const repos = document.querySelectorAll(".repo");
    const searchTextLower = searchText.toLowerCase();
    for (let repo of repos) {
        const repoLower = repo.innerText.toLowerCase();
        if (repoLower.includes(searchTextLower)) {
            repo.classList.remove("hide");
        } else {
            repo.classList.add("hide");
        }
    }
});