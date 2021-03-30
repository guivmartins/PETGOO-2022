require('dotenv/config');
const express = require('express')
var expressValidator = require("express-validator");
const app = express()
const bodyParser = require('body-parser')
var path = __dirname + '/views/';
const ObjectId = require('mongodb').ObjectID
const MongoClient = require('mongodb').MongoClient
const http = require('http'); 
const uri = process.env.DB_CONNECTION;
var mongoose = require('mongoose');
mongoose.connect('mongodb://guivmartins18:cesusc18@ds143293.mlab.com:43293/aulamongo');
 
var customerSchema = new mongoose.Schema({
    nome: String,
    bairro: String,
    
}, { collection: 'customers' }
);
 
module.exports = { Mongoose: mongoose, CustomerSchema: customerSchema }

app.use(bodyParser.urlencoded({
	extended: true
}))

MongoClient.connect(uri, (err, client) => {
	if (err) return console.log(err)
	db = client.db('PETGOO')

	app.listen(process.env.PORT, () => {
		console.log(`Servidor está rodando na porta ${process.env.PORT}.`)
	})
})

app.set('view engine', 'ejs')

app.route('/')
	.get(function (req, res) {
		const cursor = db.collection('data').find()
		res.render('login.ejs')
	})

	app.route('/index')
	.get(function (req, res) {
		const cursor = db.collection('data').find()
		res.render('index.ejs')
	})

	.post((req, res) => {
		db.collection('data').save(req.body, (err, result) => {
			if (err) return console.log(err)

			console.log('Dados gravados com sucesso.')
			res.redirect('/show')
		})
	})

app.route('/show')
	.get((req, res) => {
		db.collection('data').find().toArray((err, results) => {
			if (err) return console.log(err)
			res.render('show.ejs', {
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
		db.collection('data').find({ $or: [{ nome: { '$regex': req.query.query } },
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
	
	app.route('/contact')
	.get(function (req, res) {
		res.render('contact.ejs')
		//res.sendFile(path + "contact.html");
	})

app.route('/edit/:id')
	.get((req, res) => {
		var id = req.params.id

		db.collection('data').find(ObjectId(id)).toArray((err, result) => {
			if (err) return res.send(err)
			res.render('edit.ejs', {
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
			res.redirect('/show')
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
			res.redirect('/show')
		})
	})

app.use('*', function (req, res) {
	res.sendFile(path + "404.html")
})
