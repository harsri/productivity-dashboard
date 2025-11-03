function openCards() {
    let allElems = document.querySelectorAll(".func")
    let allFullElemsPage = document.querySelectorAll(".fullelems");
    let allButtons = document.querySelectorAll(".fullelems button");
    allElems.forEach(function (elem) {
        elem.addEventListener("click", function () {
            allFullElemsPage[elem.id].style.display = "block";
        });
    });

    allButtons.forEach(function (but) {
        but.addEventListener("click", function () {
            allFullElemsPage[but.id].style.display = "none";
        })
    });
}

openCards();

//to do list
function toDoList() {
    var totalTaskPending = 0;
    var importantTaskPending = 0;

    var taskArray = [];

    if (localStorage.getItem('taskArray')) {
        taskArray = JSON.parse(localStorage.getItem('taskArray'));
    }
    else {
        console.log("No Task");
    }

    function renderTask() {
        let sum = '';
        let allTask = document.querySelector(".allTask");
        let totalPending = document.getElementById("totalPending");
        let importantPending = document.getElementById("importantPending");
        if (taskArray.length != 0) {
            taskArray.forEach(function (val, index) {
                sum += `
            <div class="tasks" id=${val.ID}>
                <h3 title="${val.Task}">${val.Task}</h3>
                <p title="${val.Details}">${val.Details}</p>
                <div class="ending">
                    <svg class="imp-icon-${val.Important}" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="red">
                        <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z"/>
                    </svg>
                    <button id=${val.ID} class="but-${val.Status}"></button>
                </div>
            </div>
            `;
                if (!val.Status) {
                    totalTaskPending++;
                    if (val.Important) importantTaskPending++;
                }
                //console.log(val.ID);
            });
            allTask.innerHTML = sum;
            totalPending.innerText = `Total Task Pending : ${totalTaskPending}`;
            importantPending.innerText = `Imp. Task Pending : ${importantTaskPending}`;
            totalTaskPending = 0;
            importantTaskPending = 0;
        }
    }
    renderTask();

    function newTaskAddition() {
        let form = document.querySelector(".addTask form");
        let formInput = document.querySelector(".addTask form input[type='text']");
        let formDetails = document.querySelector(".addTask form textarea");
        let formImp = document.querySelector(".addTask form #check");
        form.addEventListener("submit", function (event) {
            if (formInput.value.trim().length == 0) {
                alert("Task must be filled.");
                return;
            }
            event.preventDefault();
            console.log(taskArray);
            taskArray.push({
                ID: taskArray.length + 1,
                Task: formInput.value.trim(),
                Details: formDetails.value.trim(),
                Important: formImp.checked,
                Status: false
            });
            localStorage.setItem('taskArray', JSON.stringify(taskArray));
            renderTask();
            formInput.value = '';
            formDetails.value = '';
            formImp.checked = false;
        });
    }
    newTaskAddition();

    function completeTask() {
        let allTask = document.querySelector(".allTask");
        allTask.addEventListener("click", function (event) {
            if (event.target.tagName === "BUTTON" && event.target.closest(".tasks")) {
                let clickedButton = event.target;
                let taskId = clickedButton.id;
                let taskIndex = taskArray.findIndex(task => task.ID == taskId);
                if (taskIndex !== -1) {
                    taskArray[taskIndex].Status = true;
                    localStorage.setItem('taskArray', JSON.stringify(taskArray));
                    renderTask();
                } else {
                    console.error("Task not found with ID:", taskId);
                }
            }
        });
    }
    completeTask();

}

toDoList();

//daily planner
function dailyPlanner() {
    let dailyData = JSON.parse(localStorage.getItem("dailyPlanData")) || {};

    var hours = Array.from({ length: 18 }, (_, idx) => `${6 + idx}:00-${7 + idx}:00`);

    let content = '';
    hours.forEach(function (elems, idx) {
        let savedData = dailyData[idx] || '';
        content += `
                <div class="day-planner-time">
                    <p>${elems}</p>
                    <input id="${idx}" type="text" placeholder="..." value="${savedData}">
                </div>
    `;
    });
    let dayPlanner = document.querySelector(".day-planner");
    dayPlanner.innerHTML = content;

    let dayPlannerInput = document.querySelectorAll(".day-planner input");
    dayPlannerInput.forEach(function (elem) {
        elem.addEventListener("input", function () {
            dailyData[elem.id] = elem.value;
            localStorage.setItem("dailyPlanData", JSON.stringify(dailyData))
        })
    });
}

dailyPlanner();

//motivation quote
async function getRandomQuote() {
    let quote = await fetch('https://api.quotable.io/random');
    let quoteObj = await quote.json();
    let content = quoteObj.content;
    let author = quoteObj.author;

    let motivation = `
                <div class="motivation-card">
                    <div class="m1">
                        <h2>Quote of the day</h2>
                        <img src="assets/quotation.png" alt="quotation">
                    </div>
                    <div class="m2"><p>${content}</p></div>
                    <div class="m3"><h3>- ${author}</h3></div>
                </div>    
    `;

    let motivationWrapper = document.querySelector('.motivation-wrapper');
    motivationWrapper.innerHTML = motivation;
}

getRandomQuote();

//pomodoro timer
function pomodoroTimer() {
    let timeInterval = null;

    let paused = false;
    let work = true;
    let time = 0;

    let totWorkSec = 1500;
    let totBreakkSec = 300;


    let playPause = document.querySelector(".play-pause");
    let restart = document.querySelector(".restart");
    let currTime = document.querySelector(".wrapped h1");
    let heading = document.querySelector(".dummy h3");

    function togglePlayPauseImg() {
        if (paused) {
            paused = false;
            let imagePausePlay = `<img src="assets/play.png" alt="play-pause">`;
            playPause.innerHTML = imagePausePlay;
        }
        else {
            paused = true;
            let imagePausePlay = `<img src="assets/pause.png" alt="play-pause">`;
            playPause.innerHTML = imagePausePlay;
        }
    }

    function upDateTime() {
        let minutes = Math.floor(time / 60);
        let minuteTens = Math.floor(minutes / 10);
        let minuteOnes = minutes % 10;
        let seconds = time % 60;
        let secondTens = Math.floor(seconds / 10);
        let secondOnes = seconds % 10;
        let currentTime = `${minuteTens}${minuteOnes}:${secondTens}${secondOnes}`;
        currTime.innerText = currentTime;
    }

    function workBreakToggle() {

        if (work) {
            work = false
            heading.innerText = `Break Time Left !`;
            time = totBreakkSec;
        }
        else {
            work = true;
            heading.innerText = `Work Time Left !`;
            time = totWorkSec;
        }
    }


    playPause.addEventListener("click", function () {
        togglePlayPauseImg();
        if (paused) {
            timerInterval = setInterval(clock, 1000);
        }
        else {
            clearInterval(timerInterval);
        }
    })

    restart.addEventListener("click", function () {
        clearInterval(timerInterval);
        paused = true;
        work = false;
        time = totWorkSec;
        playPause.innerHTML = `<img src="assets/play.png" alt="play-pause">`;
        heading.innerText = `Work Time Left !`;
        upDateTime();
    })

    function clock() {
        if (time > 0) {
            time--;
            upDateTime();
        } else {
            workBreakToggle();
            upDateTime();
        }
    }

    time = totWorkSec
    upDateTime();
}

pomodoroTimer();

//goals
function lifeGoals() {
    let goalsData = JSON.parse(localStorage.getItem("lifeGoalsData")) || {};

    let goalsContent = ``;
    for (let i = 0; i < 8; i++) {
        let savedCardData = goalsData[i] || {};
        let savedTitle = savedCardData.title || '';
        let savedDesc = savedCardData.desc || '';

        goalsContent += `
        <div id="${i}" class="goal-cards">
            <div class="upper">
                <p></p><p></p><p></p><p></p><p></p><p></p><p></p><p></p>
            </div>
            <div class="lower">
                <input type="text" placeholder="Title" value="${savedTitle}">
                <textarea name="" id="" rows="4" placeholder="Desc.">${savedDesc}</textarea>
            </div>
        </div>
    `;
    }
    let goalsWrapper = document.querySelector(".goals-wrapper");
    goalsWrapper.innerHTML = goalsContent;

    let allGoalInputs = document.querySelectorAll(".goals-wrapper .goal-cards input[type='text'], .goals-wrapper .goal-cards textarea");

    allGoalInputs.forEach(function (elem) {
        elem.addEventListener("input", function () {

            let cardId = elem.closest(".goal-cards").id;

            let inputType = (elem.tagName.toLowerCase() === 'input') ? 'title' : 'desc';
            if (!goalsData[cardId]) {
                goalsData[cardId] = { title: "", desc: "" };
            }
            goalsData[cardId][inputType] = elem.value;
            localStorage.setItem("lifeGoalsData", JSON.stringify(goalsData));
        })
    })
}

lifeGoals();

//weatherApi
function weather() {
    //let apiKey = "secret";
    let city = "Mumbai"
    async function weatherApiCall() {

        let month = [

            "Jan.",

            "Feb.",

            "March",

            "April",

            "May",

            "June",

            "July",

            "Aug.",

            "Sept.",

            "Oct.",

            "Nov.",

            "Dec."

        ];
        try {

            var response = await fetch(`http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            var data = await response.json();

            let location = data.location;
            let currCond = data.current;

            let cityName = location.name;
            let country = location.country;

            let tempC = currCond.temp_c;
            let conditionText = currCond.condition.text;
            let conditionImg = currCond.condition.icon;
            let humidity = currCond.humidity;
            let wind = currCond.wind_kph;
            let isday = currCond.is_day;

            let dateTime = location.localtime.split(" ");

            function getDayName(dateString) {
                const date = new Date(dateString);
                const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
                return dayName;
            }

            let dayName = getDayName(dateTime[0]);
            let tt = dateTime[1].split(":");
            let am = "AM";
            let pm = "PM";
            let hour = parseInt(tt[0]);
            let minute = tt[1];
            let ampm = hour >= 12 ? pm : am;
            hour = hour % 12;
            if (hour === 0) {
                hour = 12;
            }
            dateTime[1] = `${hour}:${minute} ${ampm}`;
            let dd = dateTime[0].split("-");
            dateTime[0] = `${month[dd[1] - 1]} ${dd[2]} ${dd[0]}`;

            let weatherSectionData = `
                <div class="header-left">

                    <h1>${dayName}, ${dateTime[1]}

                    </h1>

                    <h2>${dateTime[0]}</h2>

                    <h3>${cityName} (${country})</h3>

                </div>

                <div class="header-right">

                    <div class="des">

                        <h1>${tempC}°C</h1>

                        <img src="${conditionImg}" alt="weather-condition">

                    </div>

                    <h2>${conditionText}</h2>

                    <h3>Humidity: ${humidity}%</h3>

                    <h3>Wind: ${wind} km/h</h3>

                </div>

                            `;

            let weatherSection = document.querySelector(".upper-main");
            weatherSection.innerHTML = weatherSectionData;

            if (isday == 0) {
                weatherSection.style.backgroundImage = "url('./assets/night-sky.jpg')";
            }
        } catch (error) {
            console.error("Failed to fetch weather data:", error);
        }

    }
    weatherApiCall();
    setInterval(function () {
        weatherApiCall();
    }, 60000);

}

weather();

//theme
function changeTheme() {
    let theme = [
        {
            pri: "#f9d1bb",
            sec: "#FFB4A2",
            ter1: "hsla(338, 19%, 43%, 0.93)",
            ter2: "#89646c",
        },
        {
            pri: "#F0E491",
            sec: "#BBC863",
            ter1: "#658C58",
            ter2: "#31694E",
        },
        {
            pri: "#FEFAE0",
            sec: "#B1AB86",
            ter1: "#819067",
            ter2: "#0f6212ff",
        },
        {
            pri: "#faf3b0ff",
            sec: "#FFEC9E",
            ter1: "#FFBB70",
            ter2: "#ce824cff",
        },
        {
            pri: "#E3D095",
            sec: "#7965C1",
            ter1: "#483AA0",
            ter2: "#0E2148",
        },
        {
            pri: "#D1F8EF",
            sec: "#A1E3F9",
            ter1: "#578FCA",
            ter2: "#3674B5",
        },
        {
            pri: "#F4EBD3",
            sec: "#DED3C4",
            ter1: "#98A1BC",
            ter2: "#555879",
        }
    ]

    function applyTheme(themeIndex) {
        if (themeIndex >= theme.length || themeIndex < 0 || !themeIndex) {
            themeIndex = 0;
        }
        let rootEl = document.documentElement;
        rootEl.style.setProperty('--pri', theme[themeIndex].pri);
        rootEl.style.setProperty('--sec', theme[themeIndex].sec);
        rootEl.style.setProperty('--ter1', theme[themeIndex].ter1);
        rootEl.style.setProperty('--ter2', theme[themeIndex].ter2);
    }
    function nextTheme() {
        let themeIndex = parseInt(localStorage.getItem("themeIndex")) || 0;
        console.log(themeIndex);
        themeIndex++;
        if (themeIndex >= theme.length) themeIndex = 0;
        localStorage.setItem("themeIndex", themeIndex);
        applyTheme(themeIndex);
    }
    let changeThemeBut = document.querySelector(".theme");
    changeThemeBut.addEventListener("click", function () {
        nextTheme();
    })
    function themeReload() {
        let savedThemeIndex = parseInt(localStorage.getItem("themeIndex")) || 0;
        applyTheme(savedThemeIndex);
    }
    themeReload();
}

changeTheme();

//dark-light
function darkLightCheck() {
    let darkLight = document.querySelector(".dark-light");

    let dark = (localStorage.getItem("darkLight") === "true");

    function toggleDarkMode() {
        let isGoingDark = !dark;

        let darkLightVal = (isGoingDark) ? "light" : "dark";
        let inerCont = `<img src="./assets/${darkLightVal}-sign-sun.png" alt="">`;
        darkLight.innerHTML = inerCont;

        let rootEl = document.documentElement;
        let computedStyles = getComputedStyle(rootEl);

        let pt = computedStyles.getPropertyValue('--pri').trim();
        let st = computedStyles.getPropertyValue('--sec').trim();
        let tt1 = computedStyles.getPropertyValue('--ter1').trim();
        let tt2 = computedStyles.getPropertyValue('--ter2').trim();

        rootEl.style.setProperty('--pri', tt2);
        rootEl.style.setProperty('--sec', tt1);
        rootEl.style.setProperty('--ter1', st);
        rootEl.style.setProperty('--ter2', pt);

        dark = isGoingDark;
        localStorage.setItem("darkLight", dark);
    }

    darkLight.addEventListener("click", function () {
        toggleDarkMode();
    });

    if (dark) {
        dark = false;
        toggleDarkMode();
    } else {
        let inerCont = `<img src="./assets/dark-sign-sun.png" alt="">`;
        darkLight.innerHTML = inerCont;
    }
}

darkLightCheck();