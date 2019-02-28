#! /usr/bin/env node

const program = require('commander')
const chalk = require('chalk')
const inquirer = require('inquirer')

const error = chalk.bold.redBright
const info = chalk.bold.keyword('orange')

//initialize parsing of command line arguments
program
    .version('0.0.1', '-v, --version')
    .usage('[options]')
    .option('-s, --salary <salary>', `annual salary - digits only (ie. 45000)`, parseInt)
    .option('-y, --years <years>', `Years Left Until Retirement - whole years only (ie. 25)`, parseInt)
    .option('-m, --match <match>', `Percentage of income usually matched - digit only (ie. 4)`, parseFloat)
    .option('-r, --rate <rate>', `Estimated Annual Return Rate of Retirement Fund - numbers only (ie. 6.5)`, parseFloat)
    .parse(process.argv)

getMissingValues()
    .then((nothingMissing)=>{
        const {salary, match, rate} = program;
        let yearCount = program.years;
        let totalBenefits = 0.0;
        for (yearCount; yearCount > 0; yearCount--) {
            const yearlyBenefit = calculateTotalValue(salary, match, yearCount, rate)
            totalBenefits += yearlyBenefit;
          }
        console.log('')
        console.info(info(`With an annual salary of ${returnDollars(salary)}, your employer match would have been ${returnDollars(salary * (match / 100))} per year.`));
        console.log('');
        console.info(info(`With ${program.years} years remaining until retirement, and given a annual return of ${rate}% for your retirment fund, you would have earned an additional ${returnDollars(totalBenefits)} in retirement savings.`))
        console.log('')
    })
    .catch(err => {
        console.error(error(err.message))
        console.log('')
        console.info(info('Press CMD + C or CTRL + C to exit and start again.'))
        console.log('')
        setTimeout(process.exit, 2000)
    })

/**
 * Estimates the lifetime value of a yearly contribution based on the rule of 72s
 * @param {Number} salary 
 * @param {Number} match 
 * @param {Number} years 
 * @param {Number} rate 
 * @returns {Number} total value of the match over lifetime of benefit
 */
function calculateTotalValue(salary, match, years, rate){
    const matchAmount = salary * (match / 100);
    const yearsToDouble = 72 / rate;
    const exponent = years / yearsToDouble;
    return matchAmount * Math.pow(2, exponent);
}

function returnDollars(value) {
    return value.toLocaleString(undefined, {minimumFractionDigits: 2, maximiumFractionDigits: 2, style: 'currency', currency: 'USD'});
}

function getMissingValues() {
    return new Promise((resolve, reject) => {
        // Verify which is(are) missing and prompt user for missing value(s)
        let questions = []
        const {years, salary, match, rate} = program;
        if (!salary) {
            questions.push({
                type: 'input',
                name: 'salary',
                message: 'Please enter your annual salary (Numbers Only - ie. 45000): ',
                validate: async input => {
                    const validated = parseInt(input)
                    if (validated > 0) {
                        return Promise.resolve(true)
                    } else {
                        return Promise.reject('Bad Input.')
                    }
                }
            })
        }
        if (!years) {
            questions.push({
                type: 'input',
                name: 'years',
                message: 'Please enter the number of years until your retirement (Numbers Only - ie. 25): ',
                validate: async input => {
                    const validated = parseInt(input)
                    if (validated > 0) {
                        return Promise.resolve(true)
                    } else {
                        return Promise.reject('Bad Input.')
                    }
                }
            })
        }
        if (!match) {
            questions.push({
                type: 'input',
                name: 'match',
                message: 'Please enter percentage your employer previously matched (Numbers Only - ie. 4.0): ',
                validate: async input => {
                    const validated = parseFloat(input)
                    if (validated) {
                        return Promise.resolve(true)
                    } else {
                        return Promise.reject('Bad Input.')
                    }
                }
            })
        }
        if (!rate) {
            questions.push({
                type: 'input',
                name: 'rate',
                message: 'Please enter the percentage the expected annual return on your 401k (Numbers Only - ie. 6.0): ',
                validate: async input => {
                    const validated = parseFloat(input)
                    if (validated) {
                        return Promise.resolve(true)
                    } else {
                        return Promise.reject('Bad Input.')
                    }
                }
            })
        }
        inquirer.prompt(questions).then(answers => {
            // console.log({answers})
            if (answers.salary) program.salary = +answers.salary
            if (answers.years) program.years = +answers.years
            if (answers.match) program.match = +answers.match
            if (answers.rate) program.rate = +answers.rate
            resolve(true)
        }).catch(err => {
            reject(err)
        })
    })
}

process.on('unhandledRejection', reason => {
    console.error(error('Error: ' + reason))
    setTimeout(process.exit, 2000)
})
