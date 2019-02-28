# Lost Benefits Estimator CLI

This is a command-line interface for the sole purpose of estimating, [via the rule of 72](https://en.wikipedia.org/wiki/Rule_of_72), total lost retirement benefits if your employer quits offering matching retirement fund contributions

## Installation Instructions

Requires:
```
node v8.5+
```

Install:
```
npm install -g lost-benefits-calculator
```

## Usage Instructions

From the command-line, run `calc-benefits` to enter start the interface. Answer the questions you see on the screen. 

* You will be prompted to enter your annual salary, the years remaining until your retirement, the previous matching percentage by your employer, and your estimated annual return from your retirment fund.


### Command-line Options

This interface allows you to skip all questions by entering the values directly on the command line when you call the function via options.

**To view the complete options, run:**
```
calc-benefits -h
```

**Format:** _do not include commas to separate thousands and no $ or % signs_
```
calc-benefits -s <integer: salary> -y <integer: years_to_retirment> -m <float: matching_percentage> -r <float: annual_401k_return_rate>
```

**Example:**
```
calc-benefits -s 50000 -y 30 -m 4.0 -r 8.5
```