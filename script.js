        // Game state variables
        let words = {};
        let randomPropName = "";
        let randomValueValue = "";
        let wrongAttemps = 0;
        let lettersContainer = document.querySelector(".letters");
        let wordDisplayContainer = document.querySelector(".word-display");
        let theDraw = document.querySelector(".hangman-draw");
        let guessSpans = [];
        
        // Opening screen animation
        function showOpeningScreen() {
            const openingScreen = document.getElementById('openingScreen');
            const loadingBar = document.getElementById('loadingBar');
            const loadingText = document.getElementById('loadingText');
            const gameContainer = document.getElementById('gameContainer');
            
            let progress = 0;
            const interval = setInterval(() => {
                progress += 1;
                loadingBar.style.width = `${progress}%`;
                
                // Update loading text based on progress
                if (progress < 30) {
                    loadingText.textContent = "Loading game assets...";
                } else if (progress < 60) {
                    loadingText.textContent = "Initializing game engine...";
                } else if (progress < 90) {
                    loadingText.textContent = "Preparing word database...";
                } else {
                    loadingText.textContent = "Almost ready...";
                }
                
                if (progress >= 100) {
                    clearInterval(interval);
                    
                    // Hide opening screen and show game
                    setTimeout(() => {
                        openingScreen.classList.add('hidden');
                        gameContainer.classList.add('visible');
                        initGame();
                    }, 500);
                }
            }, 30); // Adjust speed of loading bar
        }
        
        // Initialize the game
        async function initGame() {
            try {
                // Show loading state
                document.getElementById('category-name').textContent = 'Loading...';
                wordDisplayContainer.innerHTML = '<div class="loading">Loading words...</div>';
                
                // Use the provided JSON data
                words = {
                    "players": [
                        "Cristiano Ronaldo",
                        "Lionel Messi",
                        "Kylian Mbappe",
                        "Erling Haaland",
                        "Mohamed Salah",
                        "Kevin De Bruyne",
                        "Vinicius Junior",
                        "Lamine Yamal",
                        "Jude Bellingham",
                        "Antoine Griezmann"
                    ],
                    "countries": [
                        "Egypt",
                        "Saudi Arabia",
                        "Morocco",
                        "Argentina",
                        "Brazil",
                        "France",
                        "Germany",
                        "Japan",
                        "South Korea",
                        "United States"
                    ],
                    "movies": [
                        "Oppenheimer",
                        "Barbie",
                        "Dune",
                        "Interstellar",
                        "Inception",
                        "Avengers",
                        "The Batman",
                        "Joker",
                        "Frozen",
                        "Inside Out"
                    ],
                    "programming": [
                        "JavaScript",
                        "Python",
                        "C Sharp",
                        "Java",
                        "PHP",
                        "Go",
                        "Rust",
                        "TypeScript",
                        "Kotlin",
                        "Swift"
                    ],
                    "sports": [
                        "Football",
                        "Basketball",
                        "Tennis",
                        "Volleyball",
                        "Handball",
                        "Swimming",
                        "Cycling",
                        "Wrestling",
                        "Athletics",
                        "Boxing"
                    ],
                    "fruits": [
                        "Apple",
                        "Banana",
                        "Orange",
                        "Strawberry",
                        "Mango",
                        "Watermelon",
                        "Pineapple",
                        "Grapes",
                        "Kiwi",
                        "Peach"
                    ]
                };
                
                // Start the game with the fetched words
                startGame();
            } catch (error) {
                console.error('Error loading words:', error);
                // Fallback to default words if there's an error
                words = {
                    programming: ["javascript", "python", "java"],
                    movies: ["inception", "interstellar", "avengers"],
                    countries: ["egypt", "france", "brazil"]
                };
                startGame();
            }
        }
        
        // Start the game with the selected words
        function startGame() {
            // Reset game state
            wrongAttemps = 0;
            updateAttemptsDisplay();
            theDraw.className = "hangman-draw";
            lettersContainer.classList.remove("finished");
            lettersContainer.innerHTML = "";
            wordDisplayContainer.innerHTML = "";
            document.getElementById('restart-btn').style.display = 'none';
            
            // Generate letter buttons
            const letters = "abcdefghijklmnopqrstuvwxyz";
            const lettersArray = Array.from(letters);
            
            lettersArray.forEach((letter) => {
                let span = document.createElement("span");
                let theLetter = document.createTextNode(letter);
                span.appendChild(theLetter);
                span.className = "letter-box touch-feedback";
                lettersContainer.appendChild(span);
            });
            
            // Get random category and word
            let allKeys = Object.keys(words);
            let randomPropNumber = Math.floor(Math.random() * allKeys.length);
            randomPropName = allKeys[randomPropNumber];
            let randomPropValue = words[randomPropName];
            let randomValueNumber = Math.floor(Math.random() * randomPropValue.length);
            randomValueValue = randomPropValue[randomValueNumber];
            
            // Set category info
            document.getElementById("category-name").innerHTML = randomPropName;
            
            // Create word display spans
            let lettersAndSpace = Array.from(randomValueValue);
            lettersAndSpace.forEach((letter) => {
                let emptySpan = document.createElement("span");
                if (letter === " ") {
                    emptySpan.className = "with-space";
                }
                wordDisplayContainer.appendChild(emptySpan);
            });
            
            // Get reference to guess spans
            guessSpans = document.querySelectorAll(".word-display span");
            
            // Show restart button
            document.getElementById('restart-btn').style.display = 'block';
        }
        
        // Update wrong attempts display
        function updateAttemptsDisplay() {
            document.getElementById('wrong-attempts').textContent = wrongAttemps;
        }
        
        // Event listener for letter clicks
        document.addEventListener("click", (e) => {
            if (e.target.className.includes("letter-box")) {
                e.target.classList.add("clicked");
                
                let theClickedLetter = e.target.innerHTML.toLowerCase();
                let theChosenWord = Array.from(randomValueValue.toLowerCase());
                let theStatus = false;
                
                theChosenWord.forEach((wordLetter, wordIndex) => {
                    if (theClickedLetter === wordLetter) {
                        theStatus = true;
                        guessSpans.forEach((span, spanIndex) => {
                            if (wordIndex === spanIndex) {
                                span.innerHTML = theClickedLetter;
                                span.classList.add("letter-reveal");
                            }
                        });
                    }
                });
                
                if (theStatus !== true) {
                    wrongAttemps++;
                    updateAttemptsDisplay();
                    theDraw.classList.add(`wrong-${wrongAttemps}`);
                    document.getElementById("fail").play();
                    
                    if (wrongAttemps === 8) {
                        endGame();
                        lettersContainer.classList.add("finished");
                    }
                } else {
                    document.getElementById("success").play();
                    
                    let allGuessed = true;
                    guessSpans.forEach((span, index) => {
                        if (span.innerHTML === "" && theChosenWord[index] !== " ") {
                            allGuessed = false;
                        }
                    });
                    
                    if (allGuessed) {
                        successGame();
                        lettersContainer.classList.add("finished");
                    }
                }
            }
        });
        
        // End game function
        function endGame() {
            let overlay = document.createElement("div");
            overlay.className = "overlay";
            document.body.appendChild(overlay);
            
            let div = document.createElement("div");
            div.innerHTML = `
                <h2>Game Over!</h2>
                <p>The word was:</p>
                <span class="highlighted-word">${randomValueValue}</span>
                <p>Better luck next time!</p>
            `;
            div.className = "popup fail-popup";
            document.body.appendChild(div);
            
            overlay.addEventListener('click', function() {
                document.body.removeChild(div);
                document.body.removeChild(overlay);
            });
        }
        
        // Success game function 
        function successGame() {
            let overlay = document.createElement("div");
            overlay.className = "overlay";
            document.body.appendChild(overlay);
            
            let div = document.createElement("div");
            let performanceMessage = "";
            
            if (wrongAttemps === 0) {
                performanceMessage = "Flawless Victory! You're a Hangman Master! 🧠";
            } else if (wrongAttemps <= 2) {
                performanceMessage = "Excellent! You're really smart! 🎯";
            } else if (wrongAttemps <= 4) {
                performanceMessage = "Great job! You're good at this! 👍";
            } else if (wrongAttemps <= 6) {
                performanceMessage = "Well done! You made it! 🎉";
            } else {
                performanceMessage = "Close call! But you did it! 💪";
            }
            
            div.innerHTML = `
                <h2>Congratulations!</h2>
                <p>You guessed the word correctly!</p>
                <span class="performance-message">${performanceMessage}</span>
                <p>Wrong attempts: ${wrongAttemps}</p>
            `;
            div.className = "popup popup-success";
            document.body.appendChild(div);
            
            overlay.addEventListener('click', function() {
                document.body.removeChild(div);
                document.body.removeChild(overlay);
            });
        }
        
        // ========>Restart button event listener<=====
        document.getElementById('restart-btn').addEventListener('click', initGame);
        
        //============> Start the opening screen animation when page loads<===========
        window.addEventListener('DOMContentLoaded', showOpeningScreen);
