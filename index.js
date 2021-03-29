const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');

mongoose.connect("mongodb://localhost:27017/libraryDB", {useNewUrlParser: true, useUnifiedTopology: true});

const options = {
	weekday: 'long',
 	day: 'numeric',
	month: 'long'
}
let date = new Date()
let day = date.toLocaleString('en-US', options)

const recordSchema = mongoose.Schema({
	title: String,
	author: String,
	nameOfRecipient: String,
	class_section: String,
	dateIssued: String
});

const Record = mongoose.model('Record', recordSchema);

// const newRecord = new Record({
// 	title: "Harry Potter",
// 	author: "JK",
// 	nameOfRecipient: "Mike",
// 	class_section: "III",
// 	dateIssued: "12-12-2000"
// });

// newRecord.save()

app.get('/', (req, res)=>{
	Record.find((err, result)=>{
		if(!err) {
			if(result) {
				res.render('home', {listOfRecords: result});
			}
		}
	})
	
});

app.get('/add', (req, res)=>{
	res.render('add')
})

app.post('/add', (req, res)=>{
	///////////////////////////////////////////////
	let date = req.body.dateIssued

	let bookTitle = req.body.title;
	let bookAuthor = req.body.author;
	let recipientName = req.body.recipient;
	let classNsection = req.body.class;
	let dateOfIssuing = date;
	
	const newRecord = new Record({
		title: bookTitle,
		author: bookAuthor,
		nameOfRecipient: recipientName,
		class_section: classNsection,
		dateIssued: dateOfIssuing
	});
	newRecord.save();
	res.redirect('/');
});

app.post('/delete', (req, res)=>{
	let idOfRecord = req.body.delBtn;
	Record.findByIdAndDelete(idOfRecord, (err)=>{
		if(err){
			console.log('error');
		} else {
			console.log('deleted')
			res.redirect('/')
		}
	})
});
let editedRecordId = '';
let titleEdit = '';
let authorEdit = '';
let recipientEdit = '';
let classEdit = '';
let dateEdit = '';
app.post('/edit', (req, res)=>{
	let editBtn = req.body.editBtn;
	let info = JSON.parse(editBtn);
	
	titleEdit = info.title;
	authorEdit = info.author;
	recipientEdit = info.nameOfRecipient;
	classEdit = info.class_section;
	dateEdit = info.dateIssued;
	editedRecordId = info._id;
	res.render('edit', {
		previousTitle: titleEdit,
		previousAuthor: authorEdit,
		previousName: recipientEdit,
		previousClass: classEdit,
		previousDate: dateEdit
	});
	
});

app.post('/save-edit', (req, res)=>{
	titleEdit = req.body.newTitle;
	authorEdit = req.body.newAuthor;
	recipientEdit = req.body.newName;
	classEdit = req.body.newClass;
	dateEdit = req.body.newDate
	Record.updateOne({_id:editedRecordId}, {
		title: titleEdit,
		author: authorEdit,
		nameOfRecipient: recipientEdit,
		class_section: classEdit,
		dateIssued: dateEdit 
	}, (err)=>{
		if(err) {
			console.log('error in updation');
		} else {
			console.log('updated successfully');
			res.redirect('/');
		}
	});
});

app.get('/records/:idOfRecord', (req, res)=>{
	let id = req.params.idOfRecord;
	Record.findById(id, (err, result)=>{
		if(!err) {
			if(result){
				res.render('single', {
					name: result.nameOfRecipient,
					class_section: result.class_section,
					title: result.title,
					author: result.author,
					date: result.dateIssued
				})
			}
		}
	})
});

app.listen(3000);