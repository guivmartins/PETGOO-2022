require('dotenv').config()
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
var path = __dirname + '/views/';
const ObjectId = require('mongodb').ObjectID
const MongoClient = require('mongodb').MongoClient
const uri = process.env.DB_CONNECTION;
const PORT = process.env.PORT ||5000;

app.use(bodyParser.urlencoded({
	extended: true
}))

MongoClient.connect(uri, (err, client) => {
	if (err) return console.log(err)
	db = client.db('PETGOO')

	app.listen(PORT, () => {
		console.log(`Servidor está rodando na porta ${PORT}.`)
	})
})

app.set('view engine', 'ejs')

app.route('/')
	.get(function (req, res) {
		const cursor = db.collection('data').find()
		res.render('login.ejs')
	})

app.route('/registro')
	.get(function (req, res) {
		const cursor = db.collection('data').find()
		res.render('registro.ejs')
	})

	.post((req, res) => {
		db.collection('data').save(req.body, (err, result) => {
			if (err) return console.log(err)

			console.log('Dados gravados com sucesso.')
			res.redirect('/exibe')
		})
	})


app.route('/exibe')
	.get((req, res) => {
		db.collection('data').find().toArray((err, results) => {
			if (err) return console.log(err)
			res.render('exibe.ejs', {
				data: results
			})
		})
	})

	app.route('/busca')
	.get((req, res) => {
		db.collection('data').find().toArray((err, data) => {
			if (err) return console.log(err)
			res.render('busca.ejs', {
				data: data
			})
		})
	})

app.route('/search')
	.get((req, res) => {
		db.collection('data').find({ $or: [{ nome: { '$regex': req.query.query.toUpperCase } },
		 { bairro: { '$regex': req.query.query } },
		 { email: { '$regex': req.query.query } },
		 { nomedopet: { '$regex': req.query.query } },
		 { racadopet: { '$regex': req.query.query } },
		 { cordopet: { '$regex': req.query.query } }] }).toArray((err, data) => {
			if (err) return console.log(err)
			res.render('busca2.ejs', {
				data: data
			})
		})
	})
	
	app.route('/contato')
	.get(function (req, res) {
		res.render('contato.ejs')
		//res.sendFile(path + "contato.html");
	})

app.route('/editar/:id')
	.get((req, res) => {
		var id = req.params.id

		db.collection('data').find(ObjectId(id)).toArray((err, result) => {
			if (err) return res.send(err)
			res.render('editar.ejs', {
				data: result
			})
		})
	})
	.post((req, res) => {
		var id = req.params.id
		var nome = req.body.nome
		var bairro = req.body.bairro
		var email = req.body.email
		var nomedopet = req.body.nomedopet
		var racadopet = req.body.racadopet
		var cordopet = req.body.cordopet

		db.collection('data').updateOne({
			_id: ObjectId(id)
		}, {
			$set: {
				nome: nome,
				bairro: bairro,
				email: email,
				nomedopet: nomedopet,
				racadopet: racadopet,
				cordopet: cordopet
			}
		}, (err, result) => {
			if (err) return res.send(err)
			res.redirect('/exibe')
			console.log('Dados atualizados com sucesso.')
		})
	})

app.route('/delete/:id')
	.get((req, res) => {
		var id = req.params.id
		db.collection('data').deleteOne({
			_id: ObjectId(id)
		}, (err, result) => {
			if (err) return res.send(500, err)
			console.log('Dado excluído com sucesso.')
			res.redirect('/exibe')
		})
	})

app.use('*', function (req, res) {
	res.sendFile(path + "404.html")
})
