/**
 * ----------------------------------------------------------------------------
 * 
 * # About
 * 
 * **Name**				:	dmuka2.Html.ImageTransformers
 * 
 * **Author**			:	Muhammet Kandemir (github.com/muhammet-kandemir-95)
 * 
 * **Version**			:	1.0.0.0
 * 
 * ----------------------------------------------------------------------------
 * 
 * # Description
 * 
 * You can add 3d transform effects to your images.
 * Thus you will have beautiful effects on your website.
 * @param {HTMLElement} el Which element will be changed.
 * @param {String[]} animationTypes Animation type when it is active.
 * @param {Number} count Which image show firtsly.
 * @param {Number} maxTransation Animation transation as second.
 * @param {Number} width What will be width as pixel?
 * @param {Number} height What will be height as pixel?
 * @param {Number} pieceCountHorizontal This is about animation. You should write a number which you want how many piece will it be divided on horizontal. This must be a the even number.
 * @param {Number} pieceCountVertical This is about animation. You should write a number which you want how many piece will it be divided on vertical. This must be a the even number.
 */
dmuka2.Html.ImageTransformers = function (params) {
	//#region Declare Class Objects
	var self = this;
	//#endregion

	//#region Read Params
	var el = typeof params.el === 'string' ? document.querySelector(params.el) : params.el;
	var animationTypes = params.animationTypes || ['random'];
	var counter = params.counter || 0;
	var maxTransation = Math.max((params.maxTransation || 5) - 1, 1);
	var width = params.width;
	var height = params.height;
	// We are changing values if they aren't the even number or they are less than 2. Because algorithm is working according to the even number.
	var pieceCountHorizontal = Math.max(params.pieceCountHorizontal % 2 === 0 ? params.pieceCountHorizontal : params.pieceCountHorizontal + 1, 2);
	var pieceCountVertical = Math.max(params.pieceCountVertical % 2 === 0 ? params.pieceCountVertical : params.pieceCountVertical + 1, 2);
	//#endregion

	//#region Init

	// It will be only string array. We will get image src list via elements which are in el.
	var imageList = [];
	var imageElementsInEl = el.querySelectorAll('img');
	for (let index = 0; index < imageElementsInEl.length; index++) {
		const element = imageElementsInEl[index];
		imageList.push(element.getAttribute('src'));
		element.remove();
	}

	// We will need a parent to put the animation elements. We may want to change some css styles. It may be about position of elements or scale of elements.
	var animationElementsParent = document.createElement('div');
	animationElementsParent.classList.add('dmuka2-image-transformers-animation-elements-parent');
	animationElementsParent.style.width = width + 'px';
	animationElementsParent.style.height = height + 'px';
	el.appendChild(animationElementsParent);

	// This has animation elements which will be transformed when animation is active.
	var animationElements = {};
	// This has position of elements by point.
	var positionElements = {};
	/**
	 * Element that you want will be changed position by new point.
	 * This function can calculate all styles for new position.
	 * You only have to send point.
	 * @param {HTMLElement} animationElement Which element change position.
	 * @param {Number} x New position X. 
	 * @param {Number} y New position Y. 
	 */
	function elementSetPosition (animationElement, x, y) {
		var positionElement = positionElements['x' + x + 'y' + y];

		animationElement.style.backgroundPosition = positionElement.backgroundPosition;
		animationElement.style.left = positionElement.left;
		animationElement.style.top = positionElement.top;
		animationElement.style.width = positionElement.width;
		animationElement.style.height = positionElement.height;
	}

	/**
	 * Element that you want will be cleared transform via '__dmuka2ImageTransform.transform'
	 * @param {HTMLElement} animationElement Which element clear transform.
	 */
	function elementSetTransform(animationElement) {
		animationElement.style.transform = 'rotateX(' + animationElement.__dmuka2ImageTransform.transform.x + 'deg) rotateY(' + animationElement.__dmuka2ImageTransform.transform.y + 'deg) rotateZ(' + animationElement.__dmuka2ImageTransform.transform.z + 'deg)';
	}

	/**
	 * Element that you want will be changed transition randomly.
	 * @param {HTMLElement} animationElement 
	 */
	function elementSetRandomTransation(animationElement) {
		// We are adding transition randomly.
		animationElement.style.transition =
			'background-image ' + (Math.floor(Math.random() * (maxTransation * 100)) / 100 + 1) +
			's, transform ' + (Math.floor(Math.random() * (maxTransation * 100)) / 100 + 1) +
			's, left ' + (Math.floor(Math.random() * (maxTransation * 100)) / 100 + 1) +
			's, top ' + (Math.floor(Math.random() * (maxTransation * 100)) / 100 + 1) + 's';
	}

	// We are calculate what will width of piece is on horizontal.
	var widthOfPiece = width / pieceCountHorizontal;
	// We are calculate what will height of piece is on vertical.
	var heightOfPiece = height / pieceCountVertical;
	// We will need this values to create animation elements. Because we have to know pieces size to put these to correct positions.

	// We are creating animation elements.
	for (let x = 0; x < pieceCountHorizontal; x++) {
		for (let y = 0; y < pieceCountVertical; y++) {
			var animationElement = document.createElement('div');
			// We are creating some properties for animation will be regular
			animationElement.__dmuka2ImageTransform = {
				stayX: 0,
				stayY: 0,
				stayZ: 0,
				randomX: Math.floor(Math.random() * 2),
				randomY: Math.floor(Math.random() * 2),
				randomZ: Math.floor(Math.random() * 2),
				transform: {
					x: 0,
					y: 0,
					z: 0
				}
			};
			animationElement.classList.add('dmuka2-image-transformers-animation-element');
			animationElement.style.backgroundSize = width + 'px ' + height + 'px';
			animationElement.style.backgroundImage = 'url("' + imageList[counter] + '")';

			var address = 'x' + x + 'y' + y;
			// We are putting elements to correct positions using pieces size.
			var animationElementLeft = (widthOfPiece * x);
			var animationElementTop = (heightOfPiece * y);
			positionElements[address] = {
				backgroundPosition: '-' + animationElementLeft + 'px -' + animationElementTop + 'px',
				left: animationElementLeft + 'px',
				top: animationElementTop + 'px',
				width: widthOfPiece + 'px',
				height: heightOfPiece + 'px'
			};
			elementSetPosition(animationElement, x, y);

			animationElements[address] = animationElement;
			animationElementsParent.appendChild(animationElement);
		}
	}

	// This is only animation counter
	var animationCounter = -1;
	// This is image index which show on screen.
	Object.defineProperty(self, 'counter', {
		get: function () {
			return counter;
		},
		set: function (value) {
			// We are getting new value with chech max index.
			counter = value % imageList.length;
			animationCounter = (animationCounter + 1) % animationTypes.length;

			var animationType = animationTypes[animationCounter];
			switch (animationType) {
				case 'random':
				default: {
					// We will set positions randomly.
					// This variable will be used to check repeat.
					var beforePositions = {};
					for (let x = 0; x < pieceCountHorizontal; x++) {
						for (let y = 0; y < pieceCountVertical; y++) {
							var address = 'x' + x + 'y' + y;
							var randomX = 0;
							var randomY = 0;

							do {
								randomX = Math.floor(Math.random() * pieceCountHorizontal);
								randomY = Math.floor(Math.random() * pieceCountVertical);
							} while (beforePositions['x' + randomX + 'y' + randomY] !== undefined);
							beforePositions['x' + randomX + 'y' + randomY] = true;

							var animationElement = animationElements[address];
							animationElement.__dmuka2ImageTransform.randomX = (animationElement.__dmuka2ImageTransform.randomX + 1) % 2;
							animationElement.__dmuka2ImageTransform.randomY = (animationElement.__dmuka2ImageTransform.randomY+ 1) % 2;
							animationElement.__dmuka2ImageTransform.randomZ = (animationElement.__dmuka2ImageTransform.randomZ + 1) % 2;
							// We are setting new image src to all animation elements.
							animationElement.style.backgroundImage = 'url("' + imageList[counter] + '")';
							// We are also adding new degree.
							animationElement.__dmuka2ImageTransform.transform = {
								x: (animationElement.__dmuka2ImageTransform.randomX * 360),
								y: (animationElement.__dmuka2ImageTransform.randomY * 360),
								z: (animationElement.__dmuka2ImageTransform.randomZ * 360)
							};
							elementSetTransform(animationElement);
							elementSetRandomTransation(animationElement);
							// We are setting new position to all animation elements.
							elementSetPosition(animationElement, randomX, randomY);
						}
					}
				}
					break;
				case 'stay':
				case 'stayX':
				case 'stayY':
				case 'stayZ':
					{ 
						for (let x = 0; x < pieceCountHorizontal; x++) {
							for (let y = 0; y < pieceCountVertical; y++) {
								var address = 'x' + x + 'y' + y;
	
								var animationElement = animationElements[address];
								
								// We are setting new image src to all animation elements.
								animationElement.style.backgroundImage = 'url("' + imageList[counter] + '")';
								// We are also adding new degree.
								var animationDirection = Math.floor(Math.random() * 3);
								if ((animationType === 'stay' && animationDirection === 0) || animationType === 'stayX') {
									animationElement.__dmuka2ImageTransform.stayX = (animationElement.__dmuka2ImageTransform.stayX + 1) % 2;
									// If it will be same animation, we have to change index.
									if (animationElement.__dmuka2ImageTransform.transform.x === (animationElement.__dmuka2ImageTransform.stayX * 360)) {
										animationElement.__dmuka2ImageTransform.stayX = (animationElement.__dmuka2ImageTransform.stayX + 1) % 2;
									}

									animationElement.__dmuka2ImageTransform.transform.x = (animationElement.__dmuka2ImageTransform.stayX * 360);
								} else if((animationType === 'stay' && animationDirection === 1) || animationType === 'stayY') {
									animationElement.__dmuka2ImageTransform.stayY = (animationElement.__dmuka2ImageTransform.stayY + 1) % 2;
									// If it will be same animation, we have to change index.
									if (animationElement.__dmuka2ImageTransform.transform.y === (animationElement.__dmuka2ImageTransform.stayY * 360)) {
										animationElement.__dmuka2ImageTransform.stayY = (animationElement.__dmuka2ImageTransform.stayY + 1) % 2;
									}

									animationElement.__dmuka2ImageTransform.transform.y = (animationElement.__dmuka2ImageTransform.stayY * 360);
								} else if((animationType === 'stay' && animationDirection === 2) || animationType === 'stayZ') {
									animationElement.__dmuka2ImageTransform.stayZ = (animationElement.__dmuka2ImageTransform.stayZ + 1) % 2;
									// If it will be same animation, we have to change index.
									if (animationElement.__dmuka2ImageTransform.transform.z === (animationElement.__dmuka2ImageTransform.stayZ * 360)) {
										animationElement.__dmuka2ImageTransform.stayZ = (animationElement.__dmuka2ImageTransform.stayZ + 1) % 2;
									}

									animationElement.__dmuka2ImageTransform.transform.z = (animationElement.__dmuka2ImageTransform.stayZ * 360);
								}
								elementSetTransform(animationElement);
								elementSetRandomTransation(animationElement);
							}
						}
					}
					break;
			}
		}
	});
	//#endregion
};