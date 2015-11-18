angular.module('bbMasonry')

.directive('bpMasonryLayout', ['$window', function($window) {
	var el;
	var columnCount;
	var columnHeights = [];
	var container;
	var containerHeight;
	var onResize;
	
	return {
		transclude: true,
		template: '<div class="bp-masonry-layout" style="position:static;"><div style="position:relative;" ng-transclude></div></div>',
		scope: {
			columnWidth: '@',
			spacing: '@'
		},
		link: function(scope, element, attr) {
			el = element;
			container = angular.element(element[0].childNodes[0]);
			angular.element($window).on('resize', onResize);
		},
		controller: ['$scope', function($scope){
			/**
			 * Array to hold all the bricks in the layout
			 */
			var bricks = [];
			
			/**
			 * True if a call to doLayout is on the event queue.
			 */
			var layoutPending = false;
			
			/**
			 * Put columnWidht on the object so the bricks can access it.
			 */
			this.columnWidth = $scope.columnWidth;
			
			/**
			 * Called by the brick's link function, this function adds the brick to the
			 * layout and ensures it is repainted.
			 */
			this.addBrick = function(brick) {
				bricks.push(brick);
				invalidate();
			}	
			
			/**
			 * Called when the window has been resized. Takes further action only if the 
			 * number of columns is changed 
			 */
			onResize = function() {
				// No update unless column count is different.
				if (getColumnCount() === columnCount)
					return;
				invalidate();
			}
						
			/** 
			 * Put a call to doLayout in the event queue if there isn't one there already.
			 * This is called whenever the layout may be changed. 
			 */ 
			function invalidate() {

				if (layoutPending)
					return;
				
				setTimeout(doLayout,0);
				layoutPending = true;
			}
			
			/**
			 * Loops through each brick in the layout and positions them,
			 */ 
			function doLayout() {
				columnCount = getColumnCount();
				containerHeight = 0;
				// Create and init new columnHeights array
				columnHeights = Array
					.apply(null, {length: columnCount})
					.map(function() {return 0;});
				
				for (var i = 0; i < bricks.length; i++){
					setPosition(bricks[i]);
				}
				
				container.css({
					height: containerHeight + 'px',
					width: ((columnCount * $scope.columnWidth) + ((columnCount - 1) * $scope.spacing)) + 'px'
				});
				layoutPending = false;
			}
			
			/**
			 * Returns the number of columns that can fit in the current width of the container.
			 * @return {Number}
			 */
			function getColumnCount() {
				var layoutWidth = el[0].offsetParent.clientWidth;
				// TODO: Not exact as it adds an extra spacing to the end. Refactor if it is a problem.
				return  Math.max(
							Math.floor(
								layoutWidth / (parseInt($scope.columnWidth) + parseInt($scope.spacing))
							), 
							1
						);
			}
			
			/**
			 * Returns the shortest column in the layout, which is where the next brick will 
			 * be inserted.
			 * @return {Number}
			 */
			function shortestColumn() {
				var min = columnHeights[0],
					col = 0;
					
				for (var i = 1; i < columnCount; i++) {
					if (columnHeights[i] < min) {
						min = columnHeights[i];
						col = i;
					}
				}
				
				return col;
			}
			
			/**
			 * Called by doLayout for each brick, this functions positions the brick in the 
			 * next available space.
			 * @param {element} brick
			 */
			function setPosition(brick){
				var col = shortestColumn();
								
				brick.css({
					left: (col * (parseInt($scope.columnWidth) + parseInt($scope.spacing))) + 'px',
					top: columnHeights[col] + 'px'
				});
				
				columnHeights[col] += brick[0].offsetHeight + parseInt($scope.spacing); 
				containerHeight = Math.max(containerHeight, columnHeights[col]);
			}
		}]
	}
}])

.directive('bpMasonryBrick', function() {
	return {
		transclude: true,
		template: '<div class="bp-masonry-brick" ng-transclude></div>',
		scope: {},
		require: '^bpMasonryLayout',
		link: function(scope, element, attr, masonryLayout) {
			masonryLayout.addBrick(element);
			element.css({
				position: 'absolute',
				listStyle: 'none',
				width: masonryLayout.columnWidth + 'px'
			})
		}
	}
})
