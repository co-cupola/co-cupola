//@@@add shirado
	var screenPercent = 100;//キューポラマスクとgoogle earthの表示スケール(百分率)
	var screenOverlay = null;
	var plusOverlay = null; 
	var minusOverlay = null; 
	var key1Overlay = null; 
	var key2Overlay = null; 
	var key3Overlay = null; 
//--------------------------------

//@@@add ------------------------shirado
	function updateMaskWindow()
	{
		var samplecontainer;
		var per=screenPercent;

		if(fullScreenState===true){
			samplecontainer = document.getElementById('fullscreencontainer');
		}else{
	       	samplecontainer = document.getElementById('sizecontainer');
		}
		if(screenOverlay!==null){
			// Set the overlay's size in pixels
			var minPer;
			
			if(samplecontainer.offsetWidth>samplecontainer.offsetHeight){
				minPer=samplecontainer.offsetWidth/1280.0;
			}else{
				minPer=samplecontainer.offsetHeight/1280.0;
			}
			var w=1280*parseFloat(per)/100.0*minPer;
			var h=800*parseFloat(per)/100.0*minPer;

console.log("h="+h+" samplecontainer.offsetWidth="+samplecontainer.offsetWidth+"\n");
			screenOverlay.getSize().setXUnits(ge.UNITS_PIXELS);
			screenOverlay.getSize().setYUnits(ge.UNITS_PIXELS);
			screenOverlay.getSize().setX(w);
			screenOverlay.getSize().setY(h);
console.log("h="+h+" w="+w+"\n");
		}
	}
	
	/*
		マスク画像を生成し、オーバーレイに追加する
		type=0...マスクなし
		type=1...黒ふちキューポラ
		type=2...写真加工キューポラ
	*/
	function createMaskWindow(type)
	{
		//-----マスク画像チェック
		if(screenOverlay===null){
			// Create the ScreenOverlay
			screenOverlay = ge.createScreenOverlay('');
		}else{
			ge.getFeatures().removeChild(screenOverlay);
		}

console.log("type="+type+"\n");

		//-----マスク画像生成
		// Specify a path to the image and set as the icon
		var icon = ge.createIcon('');

		icon.setHref("http://co-cupola.github.com/co-cupola/imgs/cupola_mask_"+type+".png");
		screenOverlay.setIcon(icon);

		// Set the ScreenOverlay's position in the window
		var samplecontainer;

		if(fullScreenState===true){
			samplecontainer = document.getElementById('fullscreencontainer');
		}else{
	       		samplecontainer = document.getElementById('sizecontainer');
		}

		screenOverlay.getOverlayXY().setXUnits(ge.UNITS_PIXELS);
		screenOverlay.getOverlayXY().setYUnits(ge.UNITS_PIXELS);
		screenOverlay.getOverlayXY().setX(samplecontainer.offsetWidth/2);
		screenOverlay.getOverlayXY().setY(samplecontainer.offsetHeight/2);

		// Set the overlay's size in pixels
		screenOverlay.getSize().setXUnits(ge.UNITS_PIXELS);
		screenOverlay.getSize().setYUnits(ge.UNITS_PIXELS);
		screenOverlay.getSize().setX(samplecontainer.offsetWidth);
		screenOverlay.getSize().setY(samplecontainer.offsetHeight);

		updateMaskWindow();

		// Specify the point in the image around which to rotate
		//screenOverlay.getRotationXY().setXUnits(ge.UNITS_FRACTION);
		//screenOverlay.getRotationXY().setYUnits(ge.UNITS_FRACTION);
		//screenOverlay.getRotationXY().setX(0.5);
		//screenOverlay.getRotationXY().setY(0.5);

		// Rotate the overlay
		//screenOverlay.setRotation(25);

		// Add the ScreenOverlay to Earth
		ge.getFeatures().appendChild(screenOverlay);
	}

	function createOverlay()
	{
		//-----もろもろのボタン
		// create the buttons
		// x, y, width, height
		if(key1Overlay===null){
			var ajustPlus = function(){
				screenPercent++;
				updateMaskWindow();
			};
			var ajustMinus = function(){
		      if(screenPercent>0){
				screenPercent--;
				updateMaskWindow();
				}
			};
			var onKey1Down = function(){
		      createMaskWindow(0);
			};
			var onKey2Down = function(){
		      createMaskWindow(1);
			};
			var onKey3Down = function(){
		      createMaskWindow(2);
			};

//			plusOverlay=createScreenOverlayButton(10, 10, 40, 50,'plus',ajustPlus); 
//			minusOverlay=createScreenOverlayButton(70, 10, 40, 50,'minus',ajustMinus); 
			createMaskWindow(0);
			key1Overlay=createScreenOverlayButton(10, 10, 128, 32,'setting',onKey1Down); 
			key2Overlay=createScreenOverlayButton(20+128, 10,128, 32,'black',onKey2Down); 
			key3Overlay=createScreenOverlayButton(30+256, 10,128, 32,'winodw',onKey3Down); 
		}
	}

	/*
		オーバーレイボタン周り
		from サンプル
	*/

	/**
	 * Helper function for element.addEventListener/attachEvent
	 */
	function addDomListener(element, eventName, listener) {
	  if (element.addEventListener)
	    element.addEventListener(eventName, listener, false);
	  else if (element.attachEvent)
	    element.attachEvent('on' + eventName, listener);
	}

	/**
	 * Helper function to get the rectangle for the given HTML element.
	 */
	function getElementRect(element) {
	  var left = element.offsetLeft;
	  var top = element.offsetTop;
	  
	  var p = element.offsetParent;
	  while (p && p != document.body.parentNode) {
	    if (isFinite(p.offsetLeft) && isFinite(p.offsetTop)) {
	      left += p.offsetLeft;
	      top += p.offsetTop;
	    }
	    
	    p = p.offsetParent;
	  }
	  
	  return { left: left, top: top,
	           width: element.offsetWidth, height: element.offsetHeight };
	}


	/**
	 * Create a custom button using screen overlays
	 * at the given x, y offset from the top left of the plugin container.
	 */
	function createScreenOverlayButton(x, y, width, height,filename,clickfunc) {
	  var _addOverlayForState = function(suffix, drawOrder, visible) {
	    // Create the loading overlay.
	    var icon = ge.createIcon('');
		var filepath = 'http://co-cupola.github.com/co-cupola/imgs/'+ filename + suffix + '.png';
	    icon.setHref(filepath);

	//console.log("filepath="+filepath+"\n");

	    var overlay = ge.createScreenOverlay('');
	    overlay.setDrawOrder(drawOrder || 0);
	    overlay.setVisibility(visible || false);
	    overlay.setIcon(icon);
	    overlay.getOverlayXY().set(x, ge.UNITS_PIXELS, y, ge.UNITS_INSET_PIXELS);
	    overlay.getScreenXY().set(0, ge.UNITS_FRACTION, 1, ge.UNITS_FRACTION);
	    overlay.getSize().set(width, ge.UNITS_PIXELS, height, ge.UNITS_PIXELS);
	    ge.getFeatures().appendChild(overlay);
	    
	    return overlay;
	  };
	  
	  var overlayReg = _addOverlayForState('', 1, true);
	  var overlayHover = _addOverlayForState('_hover', 2, false);
	  var overlayDown = _addOverlayForState('_down', 3, false);
	  
	  var _setState = function(state) {
	    overlayHover.setVisibility(state == 'hover');
	    overlayDown.setVisibility(state == 'down');
	  };
	  
	  // NOTE: if you have many screen overlay controls, you should collapse
	  // this code down to one listener per event to handle all controls.
	  
	  var _isMouseOnButton = function(mx, my) {
	    return x <= mx && mx <= x + width &&
	           y <= my && my <= y + height;
	  };
	  
	  var buttonDown = false;
	  
	  google.earth.addEventListener(ge.getWindow(), 'mousedown', function(evt) {
	    if (evt.getButton() != 0) // left click
	      return;
	    
	    if (_isMouseOnButton(evt.getClientX(), evt.getClientY())) {
	      buttonDown = true;
	      _setState('down');
	      event.preventDefault();
	      return false;
	    }
	  });
	  
	  google.earth.addEventListener(ge.getWindow(), 'mousemove', function(evt) {
	    if (_isMouseOnButton(evt.getClientX(), evt.getClientY())) {
	      _setState(buttonDown ? 'down' : 'hover');
	    } else {
	      _setState(buttonDown ? 'hover' : '');
	    }
	    
	    if (buttonDown) {
	      event.preventDefault();
	      return false;
	    }
	  });
	  
	  google.earth.addEventListener(ge.getWindow(), 'mouseup', function(evt) {
	    if (buttonDown) {
	      buttonDown = false;
	      _setState(_isMouseOnButton(evt.getClientX(), evt.getClientY()) ?
	          'hover' : '');
	      event.preventDefault();
	      return false;
	    }
	  });
	  
	  google.earth.addEventListener(ge.getWindow(), 'click', function(evt) {
	    if (evt.getButton() === 0 &&
	        _isMouseOnButton(evt.getClientX(), evt.getClientY())) {
				clickfunc();
	      buttonDown = false;
	    }
	  });
	}
//@@@add ------shirado----------------------------------------------
