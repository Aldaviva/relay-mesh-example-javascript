var restify = require('restify');

var serverPort = 6374;
var server = restify.createServer();

server.use(restify.queryParser());
server.use(restify.bodyParser());

/**
 * Capabilities method
 * @see https://relay.bluejeans.com/docs/mesh.html#capabilities
 */
server.get('/:ipAddress/capabilities', function(req, res, next){
	console.info("Received capabilities request", {
		ipAddress: req.params.ipAddress,
		port: req.query.port,
		name: req.query.name
	});

	res.send({
		JOIN: true,
		HANGUP: true,
		STATUS: true,
		MUTE_MICROPHONE: true
	});
});
/**
 * Status method
 * @see https://relay.bluejeans.com/docs/mesh.html#status
 */
server.get('/:ipAddress/status', function(req, res, next){
	console.info("Received status request", {
		ipAddress: req.params.ipAddress,
		port: req.query.port,
		name: req.query.name
	});

	res.send({ callActive: false, microphoneMuted: false });
});

/**
 * Join method
 * @see https://relay.bluejeans.com/docs/mesh.html#join
 */
server.post('/:ipAddress/join', function(req, res, next){
	console.info("Received join request", {
		ipAddress     : req.params.ipAddress,
		dialString    : req.query.dialString,
		meetingId     : req.query.meetingId || null,
		passcode      : req.query.passcode || null,
		bridgeAddress : req.query.bridgeAddress || null,
		endpoint      : req.body
	});

	res.send(204);
});

/**
 * Mute Microphone method
 * @see https://relay.bluejeans.com/docs/mesh.html#mutemicrophone
 */
server.post('/:ipAddress/mutemicrophone', function(req, res, next){
	console.info("Received mutemicrophone request", {
		ipAddress: req.params.ipAddress,
		endpoint: req.body
	});

	res.send(204);
});

/**
 * Unmute Microphone method
 * @see https://relay.bluejeans.com/docs/mesh.html#mutemicrophone
 */
server.post('/:ipAddress/unmutemicrophone', function(req, res, next){
	console.info("Received unmutemicrophone request", {
		ipAddress: req.params.ipAddress,
		endpoint: req.body
	});

	res.send(204);
});

/**
 * Hangup method
 * @see https://relay.bluejeans.com/docs/mesh.html#hangup
 */
server.post('/:ipAddress/hangup', function(req, res, next){
	console.info("Received hangup request", {
		ipAddress: req.params.ipAddress,
		endpoint: req.body
	});

	res.send(204);
});

server.on('uncaughtException', function(req, res, route, err){
	console.error("Uncaught exception", err);
	console.error(err.stack);
	console.error({
		client  : req.connection.remoteAddress,
		date    : req.time(),
		method  : req.method,
		url     : req.url,
		headers : req.headers,
		body    : req.body
	});
});

server.use(function errorLogger(req, res, next){
	var originalEnd = res.end.bind(res);

	res.end = function(){
		if(res.statusCode >= 500){
			logger.error(res.statusCode, (res._body.stack || res._body));
		}
		originalEnd.apply(arguments);
	};

	next();
});

server.on('error', function(err){
	console.error("Server error", err);
});
	
server.listen(serverPort, function(err){
	if(err){
		console.error("Server failed to start", err);
	} else {
		console.info("Listening on "+server.url);
		console.info("Press Ctrl+C to exit");
	}
});
