var express = require('express');
var router = express.Router();
var console = require('console');
var colors = require('colors');
var mongojs = require('mongojs');
var db = mongojs('mongodb://admin:h5Td_n3Kd$kL@ds153659.mlab.com:53659/ruen_dict');
var GLOBAL_errorMsg=''; // Глобальная переменная для хранения текста ошибки

/*===================================== Начало блока для работы с файлами ===================================== */
/* 
  Если читаем из файла
*/

var fs = require('fs');
var http = require('http');
var readline = require('readline');
var s = require('string');

// vars
var fileData;
var wordsArr = [],
	errorMsg = [],
	answers = [];
// IO interface
var rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});


/*===================================== Начало блока для работы с файлами ===================================== */

// Имя файла со словарем
var dictionaryFileName = 'dictionary.txt';
// var dictionaryFileName = 'small_ltest_dict.txt';

/* ------------------ */

function returnObjectArray(arr) {
	var objArray = [];
	
	for (var i=0; i<arr.length; i++) {
		obj= { "engWord" : arr[i][0],
			"rusWord" : arr[i][1]}
		objArray.push(obj);
	
	}
	return objArray;
}

/* ================== Функция чтения данных из файла и проверки на ошибки ================== */
function readDataFromFile() {
	fileData = fs.readFileSync(dictionaryFileName, 'utf-8');

	var linesArr = s(fileData).trim().lines();

	console.log('--------------\r\n');

	for (var x=0; x<linesArr.length; x++) {
		wordsArr.push(linesArr[x].split(' - '));
		console.log(wordsArr[x]);

		// Проверяем на наличие ошибок
		if (wordsArr[x].length != 2) {
			errorMsg.push("Error: There is no ENG or RUS word in line "+ x + ": " + linesArr[x]);
			errorMsg.push(wordsArr[x]);
			errorMsg.push('-------------\r\n');
		}
	}

	if (errorMsg.length) {
		console.log('--------------\r\n');
		GLOBAL_errorMsg = 'Found ' + errorMsg.length + ' errors';
		console.log((GLOBAL_errorMsg+":").red.bgWhite+'\r\n');
		console.log(errorMsg);
	}
	else
	console.log("OK!\r\n");
	console.log('total lines: ' + wordsArr.length);

	console.log('--------------\r\n');
}

/* ================== Запуск инициализации данных ================== */

readDataFromFile();
var dataJSON = returnObjectArray(wordsArr); // преобразование данных в единый массив объектов словаря

/* ================== Обработка запроса HTTP ================== */

/* ... если загружаем словарь из файла */
router.get('/dict', function(req, res, next) {
	console.log("\r\n\r\nЗапрос от клиента...\r\n");
	if (!GLOBAL_errorMsg) {
		res.json(dataJSON);
	}
	else
		res.json({"Dictionary error(s)": GLOBAL_errorMsg});
});

/* ========= ... окончание блока для работы с файлами ===================================== */

/* ... если загружаем словарь из MongoDB (раскомментировать) */
/*

router.get('/dict', function(req, res, next) {
	db.dictionary.find(function(error, dict) {
		if (error) {
			res.send(error);
		}
		res.json(dict);
		console.log(dict.toString());
	});
});

*/

router.get('/word/:id', function(req, res, next) {
	db.dictionary.findOne({ _id: mongojs.ObjectId(req.params.id)},function(error, word) {
		if (error) {
			res.send(error);
		}
		res.json(word);
	});
});


module.exports = router;