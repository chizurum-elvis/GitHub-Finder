document.addEventListener("DOMContentLoaded", () => {

    const searchBtn = document.getElementById("searchBtn");
    const usernameInput = document.getElementById("username");
    const resultDiv = document.getElementById("result");

    const modal = document.getElementById("repoModal");
    const closeModalBtn = document.getElementById("closeModal");
    const repoNameEl = document.getElementById("repoName");
    const repoDescEl = document.getElementById("repoDesc");
    const repoStarsEl = document.getElementById("repoStars");
    const repoLinkEl = document.getElementById("repoLink");


    async function getGitHubUser(username) {
        try {
            const response = await fetch (`https://api.github.com/users/${username}`);
            if (!response.ok) throw new Error("User not found");

            const user = await response.json();
            return user;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async function getUserRepos(username) {
        try {
            const response = await fetch (`https://api.github.com/users/${username}/repos`);
            if (!response.ok) throw new Error("Could not fetch repositories");
            const repos = await response.json();
            return repos.slice(0, 5);
        } catch (error) {
            console.error(error);
            return [];
        }
    }


    function createElement (tag, text= "", className="") {
        const el = document.createElement(tag);
        if (text) el.textContent = text;
        if (className) el.className = className;
        return el;
    }


    function displayUser(user, repos) {
        resultDiv.textContent = "";

        if(!user) {
            const error = createElement("p", "User not found 😢", "error");
            error.style.color = "red";
            resultDiv.appendChild(error);
            return;
        }

        const userInfo = createElement("div", "", "user-info");

        const img = document.createElement("img");
        img.src = user.avatar_url;
        img.alt = user.login;
        userInfo.appendChild(img);

        const name = createElement("h2", user.name || user.login);
        userInfo.appendChild(name);

        const stats = createElement(
            "p",
            `Followers: ${user.followers} | Following: ${user.following}`
        )
        userInfo.appendChild(stats);

        const repoCount = createElement("p", `Public Repos: ${user.public_repos}`);
        userInfo.appendChild(repoCount);

        const profileLink = document.createElement("a");
        profileLink.href = user.html_url;
        profileLink.target = "_blank";
        profileLink.textContent = "View Profile";
        userInfo.appendChild(profileLink);

        resultDiv.appendChild(userInfo);

        const reposDiv = createElement("div", "", "repos");
        const heading = createElement("h3", "Top Repositories: ");
        reposDiv.appendChild(heading);

        repos.forEach(repo => {
            const repoEl = createElement("div", repo.name, "repo");

            repoEl.addEventListener("click", () => showRepoModal(repo))

            reposDiv.appendChild(repoEl);
        });

        resultDiv.appendChild(reposDiv);
    }

    function showRepoModal(repo) {
        repoNameEl.textContent = repo.name;
        repoDescEl.textContent = repo.description || "No description available.";
        repoStarsEl.textContent = repo.stargazers_count;
        repoLinkEl.href = repo.html_url;

        modal.style.display = "flex";
    };

    closeModalBtn.addEventListener("click", () => {
        modal.style.display = "none";
    });

    modal.addEventListener("click", (e) => {
        if (e.target === modal) modal.style.display = "none";
    });


    searchBtn.addEventListener("click", async () => {
    const username = usernameInput.value.trim();
    if (!username) {
        resultDiv.textContent = "Please enter a username.";
        return;
    };


    const loader = document.createElement("div")
    loader.className = "loader";

    for (let i = 0; i < 3; i++) {
        const bubble = document.createElement("div")
        loader.appendChild(bubble);
    }

    resultDiv.appendChild(loader);
 
    const user = await getGitHubUser(username);
    const repos = await getUserRepos(username);

    displayUser(user, repos);
    });

});

