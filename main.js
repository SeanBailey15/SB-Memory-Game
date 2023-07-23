//create variable to store the div that will contain the "tile divs"
const tilesContainer = document.querySelector(".tiles");
//create an array of colors, the number of items within will dictate the size of the game
//game will create twice as many tiles as there are colors listed in this array
const colors = [
  "red",
  "blue",
  "green",
  "yellow",
  "orange",
  "purple",
  "pink",
  "teal",
];
//create a second array based off the initial color list, containing two of each color
const colorsPickList = [...colors, ...colors];
//set a variable containing the number of game tiles, based off the above array
const tileCount = colorsPickList.length;

//game state, these variables will be used in functions to update the game's status
//how many tiles have been successfully revealed(matched)
let revealedCount = 0;
//contains the identity of the first revealed tile each turn, set to null at the beginning of each turn/round
let activeTile = null;
//condition that will determine if the user has finished the current turn
let awaitingEndOfMove = false;

//set up the initial game state on every refresh, based off the for loop over our colorPickList array
function buildTile(color) {
  //create a div that will be referred to as "element"
  const element = document.createElement("div");
  //assign the div the tile class
  element.classList.add("tile");
  //set the data-color attribute to whichever color was passed into this function from our array loop
  element.setAttribute("data-color", color);
  //set the data-revealed attribute to false to indicate this tile has not been matched yet
  element.setAttribute("data-revealed", "false");

  //event listener for clicking on tiles, which allows the function to continue further
  element.addEventListener("click", () => {
    //get the revealed status of the tile to check against the condition below
    const revealed = element.getAttribute("data-revealed");

    //prevent user from clicking on tiles if they are already revealed or matched
    //or during the small window when incorrect matches are returning to their hidden state (end of move)
    if (awaitingEndOfMove || revealed === "true" || element === activeTile) {
      //function does not continue further if any of the above conditions are true UPON A USER CLICK
      return;
    }

    //turns the color "on" upon clicking the given tile element
    element.style.backgroundColor = color;

    //if there is no active tile at the moment
    //on the user's second move the activeTile is set, so the function moves on to the next code block
    if (!activeTile) {
      //active tile is set to the tile (generic element) that is first clicked on the current turn
      //this allows it to be stored and checked against throughout the function
      activeTile = element;
      //end the function here to set up for next user selection
      return;
    }

    //logic to check for matched tiles
    //create a variable that holds the color associated with the activeTile
    const colorToMatch = activeTile.getAttribute("data-color");

    //if the activeTile (first clicked) color matches the second selected (currently clicked) "element's" color
    if (colorToMatch === color) {
      //set the revealed status of the activeTile to true
      activeTile.setAttribute("data-revealed", "true");
      //set the revealed status of the second selected (currently clicked) tile to true
      element.setAttribute("data-revealed", "true");
      //reset the game state variables
      awaitingEndOfMove = false;
      activeTile = null;
      //add to the revealed tiles count to check against the total number of tiles
      //to see if the user has revealed all tiles
      revealedCount += 2;

      //check if user has revealed all tiles
      if (revealedCount === tileCount) {
        //if so, use an alert to end the game and direct the user to start again
        alert("You Win! Refresh to play again!");
      }
      return;
    }

    //if the function has made it this far, it is now the end of a turn (two moves have been made)
    awaitingEndOfMove = true;

    //end of move is now true(see first condition below event listener)
    //create a small window (1s) where the user cannot make a selection and the tiles reset to hidden
    setTimeout(() => {
      //reset the tiles color to null, clearing whichever color it had revealed
      //"element" is the generic name in reference to the event listener
      //in this case, it is the SECOND tile selected by the user
      //the first tile selected is attached to the activeTile variable until the end of this timeout
      element.style.backgroundColor = null;
      //reset the active tile to hidden as well
      activeTile.style.backgroundColor = null;

      //reset the game state
      //no longer preventing a user selection once the 1s delay has ended
      awaitingEndOfMove = false;
      //clearing whichever element was attached to the activeTile
      activeTile = null;
    }, 1000);
  });

  //gives us a div element to append to the container div
  //by running it through the for loop
  return element;
  //this function gets called on every iteration of the loop below, and everything below the click listener above,
  //gets called on every click
  //so even though the function is running continuously, the first few lines only run for as long as the for loop iterates
}

//build up tiles
//loop over the colorPickList array, using the tileCount length as our number of iterations
for (let i = 0; i < tileCount; i++) {
  //get a random index number on every iteration
  const randomIndex = Math.floor(Math.random() * colorsPickList.length);
  //get a color according to that random index number
  const color = colorsPickList[randomIndex];
  //pass that collor through the buildTile function and call it tile for this current loop
  //the tile is now a div of the returned "element" the buildTile function
  const tile = buildTile(color);

  //remove the current randomIndex from the pool of possible indexes
  colorsPickList.splice(randomIndex, 1);
  //place the currently generated tile into our div container
  tilesContainer.appendChild(tile);
  //repeat until all colors have been picked
}
