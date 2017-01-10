# angular-masonry-directive
Masonry layout (Pinterest/Google+ style)

Created by Ruben Ravatsaas. Check out my website at [binarypoetry.co](http://binarypoetry.co)

Written and tested with Angular 1.4.x.

It still has some bugs when sorting and changing the collection. Feel free to push your changes back here if you resolve those.

# How to use:
1. Download the bpMasonryDirective.js file and link to it from your index.html file
2. Change module name in line 1, or add bpMasonry to your module dependencies.
3. Use it like this:
```html    
<bp-masonry-layout column-width="400" spacing="24">
	<bp-masonry-brick ng-repeat="thing in things">
		{{thing}}
	</bp-masonry-brick>
</bp-masonry-layout>
```

That's all there's to it. Enjoy!
