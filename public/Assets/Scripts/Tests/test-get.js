define(['Utils/isIE', 'Utils/DOM/getType', 'Utils/get'], function(isIE, getType, get){

	// Test Suite
	describe('Get methods tests', function() {
		
		var h2 = document.getElementsByTagName('h2')[0];
		
		// Add our own matcher to check if an object is an Array
		beforeEach(function() {			
			this.addMatchers({
				toBeArray: function(expected) {
					return getType(this.actual) === 'Array' ? true : false;
				},
				toBeNumber: function(expected) {
					return /\d+/.test(this.actual);
				}
			});
		});
		
		// Spec
		it('should return the element with the specified id', function() {			
			
			expect(get.el('mytest')).not.toBeNull();
			
		});
		
		// Spec
		it('should return the first h2 element', function() {			
			
			expect(get.tag({ tag:'h2', first:true })).not.toBeNull();
			
		});
		
		// Spec
		it('should return all h2 elements as an NodeList', function() {
			
			// Can't just check if the returned value is an Array as it's actually a NodeList (which is similar but missing all Array methods).
			// We also can't check against the string NodeList because in IE it returns Object instead.
			// We also can't check if (element instanceof NodeList) as that just returns undefined in IE6/7.
			
			// So one extremely basic option would be to check if the return value is not 'undefined'.
			expect(get.tag({ tag:'h2' })).toBeDefined();
			
			// IE <= 7 returns undefined when checking constructor property
			if (!isIE || isIE > 7) {
				// NodeList Constructor changes across browsers (WebKit = NodeList(), Firefox = Object(), IE = [object HTMLCollection])
				expect(/HTMLCollection|NodeList(?:Constructor)?|Object\(\)/i.test(get.tag({ tag:'h2' }).constructor.toString())).toBeTruthy();
			}
			
			// A slightly better option is to use duck-typing (where you check available properties/methods)
			// Specification: http://www.w3.org/TR/DOM-Level-2-Core/core.html#ID-536297177
			expect(get.tag({ tag:'h2' }).length).toBeNumber(); 		// NodeList should have 'length' property
			expect(get.tag({ tag:'h2' }).item).toBeDefined(); 		// NodeList should have 'item' method defined (Array doesn't have this). IE returns 'object', other browsers return 'function' so we just check that it's defined
			expect(get.tag({ tag:'h2' }).slice).toBeUndefined(); 	// NodeList doesn't have Array method .slice()
			
		});
		
		// Spec
		it('should return the height of the document', function() {			
			
			expect(get.docheight()).toBeNumber();
			
		});
		
		// Spec
		it('should return an object with the offset properties x/y', function() {			
			
			expect(get.offset(h2).left).toBeNumber();
			expect(get.offset(h2).top).toBeNumber();
			
		});
		
		// Spec
		it('should return the value "Array"', function() {			
			
			var myarray = ['a', 'b', 'c'];
			expect(myarray).toBeArray();
			
		});
		
	});

});