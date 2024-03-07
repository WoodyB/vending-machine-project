# vending-machine-project

## Purpose

This main purpose of this project is learning and sharing. I'm learning and I'm hoping by sharing my adventure it may help you learn. If nothing else, maybe it will at least entertain you. Watching me make bonehead mistakes and hopefully discover them and fix them may be slightly entertaining. I have enabled [Discussions](https://github.com/WoodyB/vending-machine-project/discussions) in this project if you would like to drop a line or ask a question.

## Goals

[See Continuous Delivery Pipelines: Dave Farley Style](https://woodyb.github.io/vending-machine-project/design/CD-Deployment-Pipelines.pdf) in this project.

* Create a working example of [Minimum CD](https://minimumcd.org/minimumcd/)
* Demonstrate a [TDD](https://www.youtube.com/watch?v=fSvQNG7Rz-8) *test driven design* approach to developing a small project
* Demonstrate an [ATDD](https://www.youtube.com/watch?v=JDD5EEJgpHU) *acceptance test driven design* approach.

## Releases

Releases can be found on Box.com in the [vending-machine-project-releases](https://app.box.com/s/rdff61foy8s2y3uoo4j0qbhijkt1er17/folder/250524193403) folder. The application is a NodeJS console app that runs in your terminal. You will need to install NodeJS in order to run it. Install Node version20.x or greater from [NodeJS Org](https://nodejs.org/en/download). The app doesn't do much right now but if you want to execute it simply unzip the release then in the root directory

``` bash
node bin/index
```

## Disclaimer

ISC License

THE SOFTWARE IS PROVIDED “AS IS” AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.

## Why The Vending Machine Code Kata

I think the the vending machine code kata is particularly interesting to me for two reasons. Firstly, it is a little larger than other katas like FizzBuzz. Secondly, the first assignment in a software engineering class at university back in the day was to implement a vending machine in code. I was really disappointed that my team received a grade of B. We failed to understand that we were supposed to implement a real-time system. The assignment didn't mention a real-time system, but to be fair, we didn't ask. I learned a valuable lesson and ended up with an A for the class at the end so no damage. However, I think it will be fun to correct the past wrong.

## Design Notes

See the [design directory](https://github.com/WoodyB/vending-machine-project/tree/main/design/developers-log) in this project for a developer's log along with supporting documents. Here's where I'm posting status updates as I go along. Often I will put in links so you can see how the code was at the time of writing the status. My hope is this will help show how the code evolves or maybe (I hope not) devolves over time.s

## Instructions as presented at <https://cyber-dojo.org>

### Vending Machine Kata

In this exercise you will build the brains of a vending machine.  It will accept money, make change, maintain
inventory, and dispense products.  All the things that you might expect a vending machine to accomplish.

The point of this kata to to provide a larger than trivial exercise that can be used to practice TDD.  A significant
portion of the effort will be in determining what tests should be written and, more importantly, written next.

### Features

### Accept Coins
  
*As a vendor*  
*I want a vending machine that accepts coins*
*So that I can collect money from the customer*

The vending machine will accept valid coins (nickels, dimes, and quarters) and reject invalid ones (pennies).  When a
valid coin is inserted the amount of the coin will be added to the current amount and the display will be updated.
When there are no coins inserted, the machine displays INSERT COIN.  Rejected coins are placed in the coin return.

NOTE: The temptation here will be to create Coin objects that know their value.  However, this is not how a real
  vending machine works.  Instead, it identifies coins by their weight and size and then assigns a value to what
  was inserted.  You will need to do something similar.  This can be simulated using strings, constants, enums,
  symbols, or something of that nature.

### Select Product

*As a vendor*  
*I want customers to select products*
*So that I can give them an incentive to put money in the machine*

There are three products: cola for $1.00, chips for $0.50, and candy for $0.65.  When the respective button is pressed
and enough money has been inserted, the product is dispensed and the machine displays THANK YOU.  If the display is
checked again, it will display INSERT COIN and the current amount will be set to $0.00.  If there is not enough money
inserted then the machine displays PRICE and the price of the item and subsequent checks of the display will display
either INSERT COIN or the current amount as appropriate.

### Make Change

*As a vendor*  
*I want customers to receive correct change*
*So that they will use the vending machine again*

When a product is selected that costs less than the amount of money in the machine, then the remaining amount is placed
in the coin return.

### Return Coins

*As a customer*
*I want to have my money returned*
*So that I can change my mind about buying stuff from the vending machine*

When the return coins button is pressed, the money the customer has placed in the machine is returned and the display shows
INSERT COIN.

### Sold Out

*As a customer*  
*I want to be told when the item I have selected is not available*
*So that I can select another item*

When the item selected by the customer is out of stock, the machine displays SOLD OUT.  If the display is checked again,
it will display the amount of money remaining in the machine or INSERT COIN if there is no money in the machine.

### Exact Change Only

*As a customer*
*I want to be told when exact change is required*
*So that I can determine if I can buy something with the money I have before inserting it*

When the machine is not able to make change with the money in the machine for any of the items that it sells, it will
display EXACT CHANGE ONLY instead of INSERT COIN.
