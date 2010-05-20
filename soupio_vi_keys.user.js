// ==UserScript==
// @name           Soup.io vi keys
// @namespace      http://foosel.org/snippets/userscripts
// @include        http://*.soup.io/*
// @description    Enables jumping from post to post on soup.io by using the vi keys (j for next, k for previous; n and p are supported as well).
// ==/UserScript==

window.addEventListener("keydown", KeyCheck, true);
var curPost = null;

function scrollDown() {
	var postDiv = document.getElementById("posts");
	var posts = getElementsByClassName("post", "div", postDiv);
	var index = findIndex(posts, curPost);
	if (index >= posts.length) {
		return;
	}
	curPost = posts[index+1];
	scrollToPost(curPost);
}

function scrollUp() {
	var postDiv = document.getElementById("posts");
	var posts = getElementsByClassName("post", "div", postDiv);
	var index = findIndex(posts, curPost);
	if (index <= 0) {
		return;
	}
	curPost = posts[index-1];
	scrollToPost(curPost);
}

function scrollToPost(post) {
	post.scrollIntoView();
	scrollVertically(post, -50); // TODO causes some flickering from time to time, better way?
}

function findIndex(elements, element) {
	if (element == null) {
		return 0;
	}
	for (var i = 0; i < elements.length; i++) {
		if (elements[i] == element) {
			return i;
		}
	}
}

/**
 * Based on http://stackoverflow.com/questions/2129303/greasemonkey-javascript-key-press-help/2129405#2129405
 */
function KeyCheck(e) {
	var key = e.keyCode;
	switch (key) {
		case 78: // "n"
		case 74: // "j"
			scrollDown();
			break;
		case 80: // "p"
		case 75: // "k"
			scrollUp();
			break;
	}
}

/**
 * Taken from http://forums.devshed.com/javascript-development-115/can-i-offset-scrollintoview-by-x-amount-of-pixels-535180.html
 */
function scrollVertically(element, offset) {
	var re=/html$/i;
	while (!re.test(element.tagName) && (1 > element.scrollTop))
		element = element.parentNode;
	if (0 < element.scrollTop) element.scrollTop += offset;
}

/**
 * Developed by Robert Nyman, http://www.robertnyman.com
 * Code/licensing: http://code.google.com/p/getelementsbyclassname/
 */
var getElementsByClassName = function (className, tag, elm){
	if (document.getElementsByClassName) {
		getElementsByClassName = function (className, tag, elm) {
			elm = elm || document;
			var elements = elm.getElementsByClassName(className),
				nodeName = (tag)? new RegExp("\\b" + tag + "\\b", "i") : null,
				returnElements = [],
				current;
			for(var i=0, il=elements.length; i<il; i+=1){
				current = elements[i];
				if(!nodeName || nodeName.test(current.nodeName)) {
					returnElements.push(current);
				}
			}
			return returnElements;
		};
	}
	else if (document.evaluate) {
		getElementsByClassName = function (className, tag, elm) {
			tag = tag || "*";
			elm = elm || document;
			var classes = className.split(" "),
				classesToCheck = "",
				xhtmlNamespace = "http://www.w3.org/1999/xhtml",
				namespaceResolver = (document.documentElement.namespaceURI === xhtmlNamespace)? xhtmlNamespace : null,
				returnElements = [],
				elements,
				node;
			for(var j=0, jl=classes.length; j<jl; j+=1){
				classesToCheck += "[contains(concat(' ', @class, ' '), ' " + classes[j] + " ')]";
			}
			try	{
				elements = document.evaluate(".//" + tag + classesToCheck, elm, namespaceResolver, 0, null);
			}
			catch (e) {
				elements = document.evaluate(".//" + tag + classesToCheck, elm, null, 0, null);
			}
			while ((node = elements.iterateNext())) {
				returnElements.push(node);
			}
			return returnElements;
		};
	}
	else {
		getElementsByClassName = function (className, tag, elm) {
			tag = tag || "*";
			elm = elm || document;
			var classes = className.split(" "),
				classesToCheck = [],
				elements = (tag === "*" && elm.all)? elm.all : elm.getElementsByTagName(tag),
				current,
				returnElements = [],
				match;
			for(var k=0, kl=classes.length; k<kl; k+=1){
				classesToCheck.push(new RegExp("(^|\\s)" + classes[k] + "(\\s|$)"));
			}
			for(var l=0, ll=elements.length; l<ll; l+=1){
				current = elements[l];
				match = false;
				for(var m=0, ml=classesToCheck.length; m<ml; m+=1){
					match = classesToCheck[m].test(current.className);
					if (!match) {
						break;
					}
				}
				if (match) {
					returnElements.push(current);
				}
			}
			return returnElements;
		};
	}
	return getElementsByClassName(className, tag, elm);
};
