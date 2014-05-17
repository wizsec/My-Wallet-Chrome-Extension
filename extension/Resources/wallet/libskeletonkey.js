/**
 * SkeletonKey.identify(callback)
 *
 * SkeletonKey.getCredentials(function onResult(any value))
 * SkeletonKey.getCredentials(string id, function onResult(any value))
 *
 * SkeletonKey.setCredentials(object value)
 * SkeletonKey.setCredentials(object value, function onResult(boolean success))
 * SkeletonKey.setCredentials(string id, any value)
 * SkeletonKey.setCredentials(string id, any value, function onResult(boolean success))
 *
 * SkeletonKey.authenticate(token, [authorization,] callback)
 *
 * SkeletonKey.encrypt(rawData, callback)
 *
 * SkeletonKey.decrypt(encryptedData, [authorization,] callback)
 *
 * SkeletonKey.sign(data, [authorization,] callback)
 *
 * SkeletonKey.verify(data, signature, callback)
 *
 */
(function() {
	var skeletonKeyAppID = 'ackbbbeabbmaledfnaaedkfacddkheij';

	function sendMessage(cmd, data, cb) {
		chrome.runtime.sendMessage(skeletonKeyAppID, { cmd: cmd, data: data }, cb);
	}
	function assert(expr, str) {
		if (!expr) throw (arguments.length == 2 ? str : "assertion failed");
	}

	var disconnectCallbacks = [];
	var listeningForDisconnect = false;
	function onDisconnected() {
		listeningForDisconnect = false;
		var callbacks = disconnectCallbacks;
		disconnectCallbacks = [];
		for (var i = 0; i < callbacks.length; i++)
			callbacks[i]();
	}

	var api = {};

	function defineMethod(name, fn) {
		Object.defineProperty(api, name, { value: fn });
	}

	defineMethod("init", function init(prefs, cb) {
		sendMessage("init", prefs, cb);
	});

	defineMethod("identify", function identify(cb) {
		sendMessage("identify", {}, cb);
	});

	defineMethod("listenForDisconnect", function(onDisconnect) {
		disconnectCallbacks.push(onDisconnect);
		if (!listeningForDisconnect) {
			listeningForDisconnect = true;
			sendMessage("listenForDisconnect", {}, onDisconnected);
		}
	});

	defineMethod("getCredentials", function getCredentials(id, cb) {
		if (arguments.length == 0) return;
		else if (arguments.length == 2) assert(id);
		else if (arguments.length == 1) {
			if (typeof id === 'function') { cb = id; id = null; }
		}
		assert(!id || typeof id === 'string');
		assert(!cb || typeof cb === 'function');
		sendMessage("getCredentials", { id: id }, cb);
	});

	defineMethod("setCredentials", function setCredentials(id, value, cb) {
		if (arguments.length == 3) assert(id);
		else if (arguments.length == 2) {
			if (typeof value === 'function') { cb = value; value = id; id = null; }
		} else if (arguments.length == 1) {
			value = id; id = null;
		}
		assert(!id || typeof id === 'string');
		assert(id || typeof value === 'object');
		assert(!cb || typeof cb === 'function');
		sendMessage("setCredentials", { id: id, value: value }, cb);
	});

	defineMethod("deleteCredentials", function deleteCredentials(id, cb) {
		if (arguments.length == 2) assert(id);
		else if (arguments.length == 1) {
			if (typeof id === 'function') { cb = id; id = null; }
		}
		assert(!id || typeof id === 'string');
		assert(!cb || typeof cb === 'function');
		sendMessage("deleteCredentials", { id: id }, cb);
	});

	defineMethod("authenticate", function authenticate(token, authorization, cb) {
		if (arguments.length == 2 && typeof authorization === 'function') {
			cb = authorization; authorization = null;
		}
		// TODO: type-check args
		sendMessage("authenticate", { token: token, authorization: authorization }, cb);
	});

	// Helper function to encrypt with the SkeletonKey's public key (can be done by anyone).
	// By making the key capable of performing this, a local app does not have to implement RSA.
	defineMethod("encrypt", function encrypt(rawData, cb) {
		// TODO: type-check args
		sendMessage("encrypt", { data: rawData }, cb);
	});

	defineMethod("decrypt", function decrypt(encryptedData, authorization, cb) {
		if (arguments.length == 2 && typeof authorization === 'function') {
			cb = authorization; authorization = null;
		}
		// TODO: type-check args
		sendMessage("decrypt", { data: encryptedData, authorization: authorization }, cb);
	});

	defineMethod("sign", function sign(data, authorization, cb) {
		if (arguments.length == 2 && typeof authorization === 'function') {
			cb = authorization; authorization = null;
		}
		// TODO: type-check args
		sendMessage("sign", { data: data, authorization: authorization }, cb);
	});

	// Helper method to verify something signed with the SkeletonKey private key (can be done by anyone)
	// By making the key capable of performing this, a local app does not have to implement RSA.
	defineMethod("verify", function verify(data, signature, cb) {
		// TODO: type-check args
		sendMessage("verify", { data: data, signature: signature }, cb);
	});

	Object.freeze(api);
	Object.defineProperty(this, "SkeletonKey", { value: api });

}).call(this);
