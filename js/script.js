// profile information
const profileInfo = document.querySelector(".overview");

const username = "carolb92";

// display repo list
const repoList = document.querySelector(".repo-list");

const getUserData = async function () {
    const response = await fetch(`https://api.github.com/users/${username}`);
    const userData = await response.json();
    console.log(userData);
    userInfo(userData);
};
getUserData();

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

const getRepos = async function () {
    const reposRes = await fetch (`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`);
    const repos = await reposRes.json();
    console.log(repos);
    repoInfo(repos);
};

const repoInfo = function (repos) {
    for (let item of repos) {
        let li = document.createElement("li");
        li.classList.add("repo");
        li.innerHTML = `<h3> ${item.name} </h3>`;
        repoList.append(li);
    }
};