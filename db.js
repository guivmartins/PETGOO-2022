const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://guivmartins:senha1234@cluster0.w9jfr.mongodb.net/PETGOO?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
	useNewUrlParser: true,
	useUnifiedTopology: true
});
client.connect(err => {
	const collection = client.db("test").collection("devices");
	// perform actions on the collection object
	client.close();
});