// Requires jQuery to be loaded befor this script
////////////////////////////////////////////////////////
// Game Data
////////////////////////////////////////////////////////
var gameData = {
    scenes: [
	{ 
	    number: 1, // scene number
	    opening: { // maybe we should make this in flash?
	    	visuals: 'galaxy and image of coyote',
	    	    eng: "A long time ago the rain didn't come so the plants couldn't grow to feed the people. The people were very hungry and they prayed to Tqaltkukwpi7 for help. Tqaltkukwpi7 heard the prayers of the people",
	    	    spl: 'spl_o_1'
	    },
	    images: [ // images will be layered in, back to front
	    	{
                    id: 'w000', // id of the <img>
                    index: 0, // word index for quick lookup in dictionary
		    xPos: '50%', // position it on the screen
                    yPos: '50%',
                    img: 'images/drawingOfCoyote.jpg' // image source
		}
	    ],
	    instruction: { // top of the screen instruction
		eng: 'Tqaltkukwpi7 needs a helper, ask for help from...',
		spl: 'spl_i_1'
	    },
	    answer: "Sek'lap", // expected answer
	    closing: { // maybe we should make something in flash?
		sfx: 'coyoteLaugh'
	    }
	},
	{
	    number: 2,
            opening: { 
                visuals: 'coyote appears and grins', 
                    eng: 'Coyote laughs! He must have heard his name.',
                    spl: 'eng_o_2'
            },
            images: [
		{
		    id: 'w000',
                    index: 0,
                    xPos: '50%',
                    yPos: '50%',
		    img: 'images/coyote2.png'
		},
                {
                    id: 'w001',
                    index: 1,
                    xPos: '25%',
                    yPos: '25%',
                    img: 'images/hello.png'
		}
	    ],
	    instruction: {
		eng: 'Hello!',
		spl: 'Waytk!'
	    },
	    answer: 'Waytk',
	    closing: {
		visuals: 'Coyote Smiles',
		    sfx: 'coyoteLaugh'
	    }
	},
	{
            number: 3,
            opening: {
                visuals: 'coyote appears and grins', 
                    eng: 'and so he sent his helper coyote to take some salmon from the ocean and feed the people. ',
                    spl: 'spl_o_3'
            },
            images: [
		{
                    id: 'w003',
                    index: 2,
                    xPos: '50%',
		    yPos: '50%',
                    img: 'images/river.png'
		}
	    ],
            instruction: {
                eng: 'Help coyote find the ocean. What can you follow to find the ocean?',
                spl: 'spl_i_3'
	    },
            answer: "Ck'mu'7lucw",
	    closing: {
		eng: 'Tqaltkukwpi7 told Coyote, "make sure the salmon will be well cared for in their new home before you leave them."',
		spl: 'spl_c_3',
		visuals: 'vis_c_3',
		sfx: 'sfx_c_3'
	    }
	}
    ],
// Dictionary //////////////////////////////////////////////////////////
    dictionary: [
	{ // index 0
            id: 'w000', // id to help us keep track of the word
            eng: 'Coyote', // english
            spl: "Sek'lap", // splatsin
            img: 'images/dictionary/coyote.png', // small image
	    def: 'def_w000' // definition or hint
	},
	{// index 1
            id: 'w001',
            eng: 'Hello',
            spl: 'Waytk',
            img: 'images/dictionary/hello.png',
            def: 'def_w001'
        },
        {// index 2
            id: 'w002',
            eng: 'River',
            spl: "Ck'mu'7lucw",
            img: 'images/dictionary/river.png',
            def: 'def_w002'
        }
    ]   
};

////////////////////////////////////////////////////////
// Game Variables
////////////////////////////////////////////////////////
var game = { // game variables
        level : 0,
        minimumWordLength : 3,
        wordsByIndex : gameData.dictionary, // we could instead use a subset of words
        wordsCollected : [
            false,
            false,
            false,
            false
        ],
        currentScene: undefined,
        currentSceneIndex: 0
    },
    currentLanguage = 'eng'; // not currently used but we could use it
////////////////////////////////////////////////////////
// Game Functions & Setup
////////////////////////////////////////////////////////
// any key strokes cause the focus to shift to the input line
window.onkeypress = function () {
    jQuery('#input').focus();
    window.onkeypress = null;
}
// deciding if words are equal, we can allow for accepted spelling variation here if needed
function wordsAreEqual(sWord1, sWord2) {
    // are they the same length?
    var answer = sWord1.length === sWord2.length;
    // are they also the same in lower case?
    answer = answer && sWord1.toLowerCase() === sWord2.toLowerCase();
    return answer;
}

function setPopupContent(wordIndex, posX, posY) {
    console.log('setPopupContent ' + wordIndex);
    var popup = document.getElementById('popup'),
    wordObject = game.wordsByIndex[wordIndex];
    /* Expected dom:
            <img class='vocab_image' />
            <h1 class='vocab_word'></h1>
            <h2 class='vocab_english'></h2>
            <p class='vocab_definition'></p>
    */
    popup.getElementsByTagName('img')[0].src = wordObject.img; // set image
    popup.getElementsByTagName('h1')[0].textContent = wordObject.spl; // set splatsin text
    popup.getElementsByTagName('h2')[0].textContent = wordObject.eng; // set eenglish text
    popup.getElementsByTagName('p')[0].textContent = wordObject.def; // set definition/hint
    popup.style.top = posY + 'px';
    popup.style.left = posX + 'px';
}
function setPopupPosition(x, y) {
    console.log('setPopupPosition ' + x + ' ' + y);
    var popup = document.getElementById('popup');
    popup.setAttribute('left', x);
    popup.setAttribute('top', y);
}
function loadScene(iSceneNumber) {
    var scene, i, l, div, img, instructions;
    console.log('loadScene ' + iSceneNumber);
    // set next scene
    scene = gameData.scenes[iSceneNumber];
    // if no next scene, we are done! 
    if (!scene) {
        // TODO: roll credits?
        alert('Tqaltkukwpi7 told Coyote, "make sure the salmon will be well cared for in their new home before you leave them."');
        return;
    }
    // destroy previous domScene content
    game.domScene.innerHTML = "";
    // add div for backgound
    div = document.createElement('div');
    div.setAttribute('id', 'bg');
    game.domScene.appendChild(div);
    // add div for clickable elements
    div = document.createElement('div');
    div.setAttribute('id', 'clickable_elements');
    game.domScene.appendChild(div);
    // loop through images and place them in the dom
    l = scene.images.length;
    for (i = 0; i < l; i++) {
        // place images
        img = document.createElement('img');
        img.setAttribute('id', scene.images[i].id);
        img.setAttribute('position', 'absolute');
        img.setAttribute('src', scene.images[i].img);
        img.setAttribute('left', scene.images[i].xPos);
        img.setAttribute('top', scene.images[i].yPos);
        img.setAttribute('data-word-index', scene.images[i].index);
        img.setAttribute('data-clickable', 'true');
        img.onclick = imageClickHandler;
        div.appendChild(img);
    }
    // TODO: set expected words
    // set text
    instructions = document.getElementById('instructions');
    instructions.textContent = scene.instruction[currentLanguage];
    // set answer
    game.answer = scene.answer;
    // TODO: play sound
    // play cut scene
    document.getElementById('cut_scene_text').textContent = scene.opening[currentLanguage];
    playScene();
    
}
// simple play cut scene
function playScene() {
    game.cutScene.style.display = 'block';
    // TODO: start cut scene animation
}
// simple stop cut scene
function skip() {
    game.cutScene.style.display = 'none';
    // TODO: stop and unload cut scene animation
}
// image click event handler
function imageClickHandler(e) {
    var wordIndex;
    console.log('image click');
    // get index that was stored in the img object
    wordIndex = e.currentTarget.getAttribute('data-word-index');
    // collect the word clicked!
    game.wordsCollected[wordIndex] = true;
    // set a popup based on mouse position
    setPopupContent(wordIndex, e.clientX, e.clientY);
    // show mask
    jQuery('#mask').show();
    // show pop-up
    jQuery('#popup').show();
    e.stopPropagation();
}
// imput change event handler
function inputChange (e) {
    var isCorrect = game.check(this.value),
        wordObj,
        i,
        l = game.wordsByIndex.length;
    if (isCorrect) {
        // TODO: run correct animation & move to the next stage
        game.level++;
        game.currentSceneIndex++;
        window.alert('Correct!');
        loadScene(game.currentSceneIndex)
        this.value='';
    } else if (this.value.length > game.minimumWordLength) {
        for (i = 0; i < l; i++) {
            wordObj = game.wordsByIndex[i];
            if (wordsAreEqual(wordObj.spl, this.value)) {
                game.level--;
                setPopupContent(i, 500, 100);
                // show mask
                jQuery('#mask').show();
                // show pop-up
                jQuery('#popup').show();
                this.value='';
            }
        }
    }
}
// if we need to add more step to check the word, we can add them here
game.check = function (sWord) {
    if (wordsAreEqual(this.answer, sWord)) {
        return true;
    }
    return false;
}
// hide popup event handler
game.hidePopup = function (e) {
    jQuery('#mask').hide();
    jQuery('#popup').hide();
    e.stopPropagation();
};
// Init
function init() {
    // hide the popups
    jQuery('#mask').hide();
    jQuery('#popup').hide();
    // set current dom elements
    game.domScene = document.getElementById('sequence_container');
    game.cutScene = document.getElementById('cut_scene');
    // set pointers to popup & mask
    game.popup = document.getElementById('popup');
    game.mask = document.getElementById('mask');
    // add behaviours
    game.popup.onclick = game.hidePopup;
    game.mask.onclick = game.hidePopup;
    // add a change listener to the input box
    document.getElementById('input').addEventListener('input', inputChange);
    // finally: load current scene
    loadScene(game.currentSceneIndex);
}
// Start
jQuery(document).ready(init);