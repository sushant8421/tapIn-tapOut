const puppeteer = require('puppeteer');
const schedule 	= require('node-schedule');
const moment	= require('moment');
const USER_NAME = process.env.USER_NAME;
const PASSWORD 	= process.env.PASSWORD;

async function click(selector, page) {
    try {
      await page.waitForSelector(selector , {
        timeout: 10000
      })
      await page.click(selector)
    } catch (err) {
    	console.log("click", err);
    }
}

async function type(selector, page, text){
    try {
		await page.waitForSelector(selector, {
			timeout: 10000
		});
		await page.focus(selector); 
		await page.keyboard.type(text);
	} catch (err) {
		console.log("type", err);
	}  
}

async function hit() {

	const browser = await puppeteer.launch({
		headless: true,
		args: ['--no-sandbox']
	});
	const page = await browser.newPage();
	await page.goto('https://elevate.darwinbox.in/', {
		waitUntil: 'load',
		timeout: 0
	});

	var userNameSelector 		= "#UserLogin_username";
	var passworSelector 		= '#UserLogin_password';
	var loginButtonSelector 	= '#login-submit';
	var dailySurveySelector 	= '#pulse_form > div > div > div > div.action-btns.mt-32 > button.btn.btn-secondary.ripple.db-btn.plr-32.mr-12.skip_pulse';
	var profileSelector 		= "#dasboard-bigheader > header > div.col-md-4.text-right.mt-16.desktopDisplay > ul > li:nth-child(3) > div > div";
	var clockInSelector 		= '#attendance-logger-widget'
	var clockInSubmitSelector	= '#clokInClockout > div > div > div.modal-body > div.text-right > button'
	await type(userNameSelector, page, USER_NAME);
	await type(passworSelector, page, PASSWORD);
	await click(loginButtonSelector, page);
	await click(dailySurveySelector, page);
	await click(clockInSelector, page);
	await click(profileSelector, page);
	await click(clockInSubmitSelector, page);

	await browser.close();
};

async function schedule1() {
	
	schedule.scheduleJob('0 10 * * 1,2,3,4,5', function(){ // 10am -> Weekdays 
		console.log('Checking In');
		var t = Math.floor((Math.random() * 30) + 1)*60*1000;
		setTimeout(function(){
			hit();
		}, t);
	});

	schedule.scheduleJob('30 19 * * 1,2,3,4,5', function(){ // 7:30pm -> Weekdays 
		console.log('Checking Out');
		var t = Math.floor((Math.random() * 30) + 1)*60*1000;
		setTimeout(function(){
			hit();
		}, t);
	});

}

(async function () {
	var time 	= moment().format();
	var day 	= moment().day();

	console.log('Checking', time);
	if(day == 0 || day ==6 ){
		console.log("Its Weekend!!")
	}
	else{
		var t = Math.floor((Math.random() * 30) + 1)*60*1000;
		setTimeout(function(){
			hit();
		}, t);
	}

})();