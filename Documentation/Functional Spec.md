# Supermarket
## Functional Specification

### Introduction
Supermarket is an incremental game written in JavaScript, HTML5, and CSS. In the game, the user plays a store director for a location of a supermarket chain. The store starts empty, with no departments or employees, and a small initial amount of money. This money can be used to open a Food department, which stocks a wide yet shallow variety of foods and beverages, not unlike a convenience store.

After the Food department is purchased, it appears to the user at Level 1. It can be raised to Level 2, but that costs a bit more than the department cost to unlock. The department can be levelled up more and more, but each level costs more than the last.

Another measure that appears after purchasing the Food department is a Customer Satisfaction number, which is measured in a unit called "customer satisfaction units", or "sats" for short. Sats can be prefixed with SI units, from "yocto-" to "yotta-". 1,000 yottasats is expressed as 1 kiloyottasat, and so forth, up to 1 yottayottasats, which is expressed as yotta₂sats, and so forth. **Customer Satisfaction does not change on its own; the user's actions change it.** Buying the Food department raises the Customer Satisfaction to 1 nanosat.

Customer satisfaction directly ties into the number of customers who visit the store and buy something each second, hereafter called **Customers per Second**, or C/S for short. **Initially, each nanosat gives 1 customer per second**, but this can be increased through upgrades and employees (see below). This measure is called **Customers per Sat**, or C/Sat, and is initially equal to 1,000,000,000 Customers per Sat (or 1 Customer per Nanosat). This measure does not need to be an integer.

**Each customer will buy a certain number of products**, called the **Products per Customer**, or P/C for short. This number is initally 1 for the Food department, but can be increased through upgrades and employees. This number does not need to be an integer.

**Each product bought by a customer has a certain price**, called the **Price per Product**, or P/P for short. Each department has a different price per product, depending on what it sells. **Departments with a higher price per product tend to have a lower initial products per customer, and vice-versa.** The initial price per product of the Food department is $1.00.

Therefore, through purchasing Food, the user receives 1 nanosat of customer satisfaction, which contributes 1 customer per second, each buying 1 product, each product for $1.00, leading to a **Revenue Per Second** of $1.00.

### Departments
Departments are the main revenue generating agents of the game. **The user may only have one of each department.** Each department has the following key constants:

* **Name**: The name of the department.
* **Base Price**: The price of unlocking the department.
* **Price Multiplier**: After unlocking the department, or levelling it up, the price is multiplied by this value.
* **Footprint**: The size of the department, in square feet.
* **Base Satisfaction per Level**: **Levelling up a department contributes customer satisfaction**, and this number tells how much satisfaction is given... sort of. See "Balancing Levelling" below.
* **Initial Products per Customer**: How many products each customer buys, before any upgrades.
* **Initial Price per Product**: How much each product contributes to revenue when bought, before any upgrades.
* **Sale Effectiveness**: Used to determine if a sale is profitable. See "Sales" below.

Each department has these key variables:
* **Current Base Price**: Some upgrades apply discounts to the price of levelling up a department, which is applied by applying the discount to the base price. This is the price used to calculate the Current Price.
* **Current Price**: The price of levelling up the department. Multiplied by the Price Multiplier after each levelling.
* **Actual Satisfaction per Level**: The actual amount of satisfaction contributed by levelling up this department. See "Balancing Levelling" below.
* **Products per Customer** and **Price per Product**: These key values after any upgrades have been applied.
* **Share Size**: How many customers visit this department per level. See "Shares" below.
* **Active Sales**: Any active sales applied to this department. See "Sales" below.
* **Employee Information**: Information about employees who work for this department. See "Employees" below.
* **Manager Information**: Information about managers who work for this department. See "Managers" below.

Each department can calculate these values:
* **Department Customers per Second**: How many customers are visiting this department per second.
* **Department Revenue per Second**: How much money this department is making per second.
* **Products Sold per Second**: The total number of products sold by this department in a second.

Other values include the number of products sold and revenue generated from the department for all time.

#### Size and Footprint
Each department has a footprint, expressed in square feet. The user's store has a certain amount of space. **A department can only be unlocked if there's enough space in the store for it.** Levelling up a department does not change its footprint.

A prestige mechanic (see "Promotions" below) will, among other things, increase the size of the store directed by the user. **Eventually, the store will grow to accomodate all departments.**

Additionally, each store has a Size Metric, which starts at 100% for the first store directed by a user. Subsequent stores will have larger size metrics, equal to `current store size / first store size`. **The Size Metric serves as a multiplier to the Customer Satisfaction value.**

#### Shares
A "share" is a portion of the total customers per second that the store receives. The size of a share is equal to `customers per second / sum of all department levels`. For example, if a store has 1,000,000 customers per second, and the sum of all department levels is 100, then the size of a share is 10,000 customers per second.

Each department, by default, receives a number of shares equal to its level. Therefore, a level 25 department in the example store above receives 25 shares, or 250,000 customers per second. Notably, this means that levelling up a department doesn't always give the same-sized boost to customers per second because of how satisfaction diminishes through levelling (see "Balancing Levelling" below). Also, if one department has an immense amount of levels over other departments, it will hoard most of the customers to the store. It is best to keep all departments around the same level to keep the satisfaction up and customers increasing.

#### Sales
A sale is a discount applied to the product price for a department. **Sales increase the number of customers in a department, thereby hopefully offsetting the loss from the sale.** Sales can only be applied once the Inventory and Pricing Special Department is unlocked.

The user can only issue up to 1 sale per day per 30 levels on the Inventory and Pricing department. Each sale will last `ceil(department level / 15)` days, or about 7 days per every 100 levels.

**Sales increase the customers per second in a department without taking them from anywhere else in the store.** The department's share size is multiplied by a given factor without changing the number of customers to any other department. Thus, **the Customers per Second measure displayed to the user, which is the sum of all department C/S, is higher than the actual calculated C/S, which is based on customer satisfaction**.

Sales are one of the only luck-based elements in Supermarket, as a sale's effectiveness will depend on the department for which the sale is issued, and the time of day/year. First, we calculate a factor, which is a number between 1 and 2, which becomes the sale's share multiplier. **All sales increase a department's C/S, but that increase has to be higher than the discount in order to make a profit on the sale.** The factor is calculated based on the following values:

* The amount of the discount (**D**), equal to `1 - discount`, where `discount` is between 0 (0%) and 1 (100%).
* The department in question. Each department has a Sale Effectiveness (**E**) value. Higher values mean a better chance of a sale being profitable.
* The time of day the sale was started (**T**). This value is determined by Table 1 below.
* The time of year the sale was started (**Y**). This value is determined by Table 2 below.

##### Ratios
In order to calculate sale effectiveness, let's talk about ratios. Given a percentage between 0% and 100%, there is a *complement* which is 100% minus that percentage. For example, if a percentage is 55%, its complement is 45%. The ratio between the percentage and complement is equal to `percentage / complement`. For 45% and 55%, the ratio is expressed as `(45% / 55%) = 0.45 / 0.55 = 0.8181818...`. We'll express it as 0.8181818:1.

Ratios come in handy when multiplying a percentage. Imagine that we want to provide a 3x boost to the 45% value above. Just multiplying it by three would give us 135%, which is out of range of the percentage. Instead, we can just multiply the ratio by 3 and then calculate a new percentage and complement based on that.

Multiplying our ratio above by 3, we get 2.4545454:1. We can then add the two sides of the ratio (2.4545454 and 1) to get the total number of "parts", which is 3.4545454. Then, just take `1 / 3.4545454` to find how many percent each part is worth - in this case, 28.947%. Then, we can multiply 28.947% by 2.4545454 to get 71.053%. This allows us to "multiply" percentages by larger numbers and still get a value between 0 and 1.

We'll define `ratioMultiply(percent, factor)` as follows:

```javascript
var ratioMultiply = function(percent, factor) {
	var complement = 1 - percent;
	var ratio = percent / complement;
	var newRatio = ratio * factor;
	var numberOfParts = newRatio + 1;
	var percentPerPart = 1 / numberOfParts;
	return percentPerPart * newRatio;
}
```

##### Calculating Sale Effectiveness
The maximum sale effectiveness is equal to `min(1, (ratioMultiply(ratioMultiply(D + (E / 100), T), Y)))`. A random number between 0 and the maximum sale effectivness is generated and becomes the sale effectiveness. This effectiveness is added to 1 to make the factor by which the department's share size is multiplied by.

**A sale will display information about how profitable it is to the user.** Sales can be canceled by the user after 0.1% of the sale's duration has passed, in case they got an unprofitable sale.

Thus, sales have the following key variables:
* **Discount**: The percentage off the price per product.
* **Sale Effectiveness**: As calculated above.
* **Share Multiplier**: `1 + Sale Effectiveness`. The share size is multiplied by this.
* **Profitability**: How much extra money is made (or lost) because of this sale. Equal to `revenue per second during sale - revenue per second by default`.
* **Expires At**: A timestamp which states when the sale expires on it's own.
* **Can Be Canceled At**: A timestamp which states when the sale can be cancelled by the user.

**Table 1: Time of Day value for Sale Effectivess:**

| Time of day                | Value |
|----------------------------|-------|
| Overnight (9:00pm-8:00am)  | 0.6   |
| Daytime (8:00am-5:00pm)    | 1     |
| Drive Time (5:00pm-7:00pm) | 1.5   |
| Evening (7:00pm-9:00pm)    | 0.8   |

**Table 2: Time of Year value for Sale Effectivess:**

| Time of year                        | Value |
|-------------------------------------|-------|
| Winter (December 26 to March 1)     | 0.9   |
| Default (March 1 to November 1)     | 1     |
| Holiday (November 1 to December 25) | 1.8   |

#### Balancing Levelling
In order to keep all departments at roughly the same level, a nerf is applied to the amount of satisfaction contributed by levelling up a department, the Satisfaction per Level. The Actual Satisfaction per Level is equal to `Base Satisfaction per Level * (1 / (standard deviation of all department levels)^k)`, for some value of `k` which I'll have to tweak. **If the standard deviation of all department levels is less than 1, it is set to 1.** This is to ensure that a department never contributes more satisfaction than its Base Satisfaction per Level.

This balancing, combined with the exponential cost of levelling up a department, helps to keep every department useful throughout the game.

#### Department Tree
Some departments have a maximum level at which they can be. When the user reaches this level, they must split the department into 2 or more sub-departments in order to keep levelling up. Sub-departments tend to have better revenue and upgrades than their parent departments. **When a department is split, all of its subdepartments are unlocked - the user cannot choose to unlock just one or a few.**

In order to split a department, the user must have enough space to hold all subdepartments. If there is not enough space, the user isn't even presented with the "Unlock" option. The user must also have enough money to unlock all subdepartments. After a department is split, all of its subdepartments behave as standard departments.

#### Special Departments
Certain departments are considered "special". These departments do not directly contribute to revenue, but instead improve other metrics, such as employee productivity, safety, and customer satisfaction. These departments also unlock powerful upgrade trees and display certain cosmetic statistics to the customer.

##### Receiving
The Receiving department is a special department that, story-wise, receives the product to stock on the shelves. The user is shown "products received" and "products received per second" - cosmetic values equal to `products sold * 1.1` that have no other impact on gameplay. Levelling up Receiving increases customer satisfaction (still subject to diminishing returns per "Balancing Levelling" above) and increases the effectiveness of employees in all non-special department by 1% per level (see Employees below).

##### Customer Service
The Customer Service department is a special department that, story-wise, checks out customer orders and provides a Service Desk for customers to perform returns, among other things. Customer Service is a bit strange in that levelling it up only provides miniscule boosts to the effectiveness of its own employees and no other buffs. However, it has very powerful boosts every 50 levels, each of which add +10% to the customer satisfaction level.

##### Inventory and Pricing
This department is not available until the user has been promoted at least once. This department performs both Inventory (which, story-wise, ensures that products are available, which, in turn, increases customer satisfaction) and Pricing, which unlocks sales (see "Sales" above).

Levelling up this department increases both the maximum discount that can be applied to a sale, how long the sale can last, and how many sales can be issued in a 24-hour period.

Given L as the level of this department, the following equations calculate maximum discount amount, sale duration, and sales per day:

* Maximum Discount: `min(0.1, smoothstep(1 - (1 / L)))`.
* Sale Duration: `ceil(L / 15)` days. Essentially, the sale cast last about 7 days for each 100 levels.
* Sales per Day: `ceil(L / 30)` sales per day. Essentially, the user can issue 1 sale per day for each 30 levels.

Where `smoothstep(x) = x * x * (3 - 2 * x)`.

### Employees
Each department can hire employees to help run it. Each department has a one or more *roles*, such as Stocker, Customer Assistant, or Desk Attendant. Each hired employee provides a boost to a given stat, such as customer satisfaction, price per product, or products per customer.

Each employee costs a certain amount in wages, calculated as a certain number of dollars per second. **Wages do not increase for each hired employee;** each subsequent employee costs as much to hire as the previous one. However, wages do increase over time; see Wage Negotiations below. Whereas buying most things reduces the bank, hiring employees reduces the profit per second.

The user may hire as many employees as he can afford, and each employee provides the same boost. Some employees may not be active at certain times - for example, they may be training. **Note that there is no concept of shifts or scheduling; all employees will be working at all times unless otherwise inactive.** Each department keeps track of the number of inactive employees and reduces their boosts accordingly.

#### Employee and Customer Safety
Employees are at risk of accidents. This risk is expressed as an odds-per-second that an employee will suffer an accident. This number is fairly low by default, meaning that accidents in stores with only a few dozen team members are rather rare. However, as the user hires more employees, more of them will suffer accidents.

Any employee who suffers an accident will always be forced to quit. This occurs automatically, but the user is notified of the loss of the employee with a humorous message. If the user loses multiple employees over an idle period (for example, the browser being closed), a single humorous message will be displayed for all the lost employees.

Additionally, customers can experience accidents in the store and incidents relating to the products they buy, such as food poisoning. Customers have two odds-per-second measures, one for accidents in the store (such as falls, slips, or injuries inflicted by careless employees), and one for incidents from the products they buy (such as food poisoning, or acid burns from defective batteries). The former class of accidents occur more commonly than the latter. Accidents reduce customer satisfaction by a small percentage, but incidents reduce customer satisfaction by a larger percentage.

Several upgrades are available that increase the safety of both employees and customers. Each upgrade is usuallly a large reduction in the odds of an accident, such as a 10x or 20x reduction in odds. Some upgrades only improve employee safety, some only improve customer safety, and some improve both. Any upgrade that reduces the odds of a customer accident will reduce both odds (accident and incident) by the same amount.

### Managers
Each department has at least one slot for a manager. A manager is a special employee who costs more in wages but provides more boosts to stats. The user can select managers from a pool of available managers, which displays each manager's wages and their boosts. Users can only assign as many managers to a department as their are slots, but can move and remove managers from departments at will.

Managers do not suffer accidents and are not affected by safety upgrades. They are also always active.

#### Hiring Assistants
After some gameplay, the user will have to manage hiring for many different departments. In order to simplify this, the user may hire a Hiring Assistant Manager that unlocks a menu with buttons that allow the user to hire 1, 10, or 100 employees to every role in every department. This will increase the wages accordingly, but will immediately provide the employee boosts. **If hiring that many employees will increases the wages above the revenue, the hiring button will be red.**

The user also has buttons to lay off 1, 10, or 100 employees to every role in every department. If there are less employees in a given role than the button laid off, all employees of that role will be laid off. This reduces wages.

### Wage Negotiations
Since employee wages increase linearly, but progress increases exponentially, the user will eventually reach a point where they can hire millions or billions of employees and enjoy tremendous boosts. In order to keep wages a non-trivial share of the total revenue of the store, the employees will begin wage negotiations regularly.

Wage negotiations may start at any point, but tend to start about every 3 to 5 days of real-world time. **During negotiations, all employees and managers will have their boosts reduced by 50%.** **The wage negotiation timer does not reset upon promotion (see Promotions below).** The wages they negotiate for will be about 20% to 30% of the revenue per second *as recorded at the start of negotiations*, to avoid the user reducing their revenue to reduce the amount they asked for. Depending on how much growth the user has had in the last few days, this could be an increase of hundreds or thousands of times.

**Wage negotiations will not start if 20%-30% of the revenue at the stary of negotiations is less than their current wages, or if the user hasn't progressed more than a given percentage in revenue since the last negotiations.**

Negotiations take anywhere from 30 minutes to 3 hours of real-world time. The user can immediately choose to accept the increase, thereby ending the negotiations and restoring the lost 50% to boosts, or they can wait it out. Negotiations may fail or succeed on their own randomly, but the more previous consecutive fails, the more likely this negotiation will succeed. Multiple failed negotiations also add +2% to the wages asked for at each new negotiation, capped at 50% of revenue per second.

If negotiations fail, employees return to work and restore the lost 50% to boosts; they do not quit or walk out. If negotiations succeed, they still return to work, this time with higher wages.

#### Mass Hiring Negotiation
If the user hires a bunch of employees within 1 hour, wage negotiations start immediately. This is to prevent the user from hiring billions of cheap employees for insane boosts. These special negotiations will complete within 3 to 5 minutes, and ask for 30% to 40% of the current revenue in wages. They are 10x more likely to succeed.

#### Automatic Layoffs
If the total wages of all employees is more than the revenue per second for a period of 15 minutes, an automatic layoff occurs to prevent the store from going bankrupt. The most expensive employees are laid off first, followed by less expensive employees. Layoffs stop as soon as wages dip back below revenue. Layoffs are atomic - all employees who will be laid off are laid off at once. The user is notified of the layoff with a message.

##### Bankruptcy
Ordinarily, the user cannot buy anything (department levels or upgrades) that would put their bank in the red. However, employee wages per second can exceed revenue per second for 15 minutes before automatic layoffs occur. With a low enough bank, it is possible to cause a bankruptcy, which occurs as soon as the total in the bank drops below zero.

A bankruptcy is a deeply undesirable thing. The store is liquidated and the user is forced to be promoted (see Promotions below). They gain only 50% of the VIPs they would have gained through a normal promotion and customer satisfaction suffers a permanent -1%.

### Upgrades
Upgrades are one-time purchases that cost money from the bank. Upgrades typically improve a stated measure of gameplay, such as:

* Customer satisfaction, either by a given amount of sats or a percentage
* Customers per nanosat, products per customer, or price per product for one department, some departments, or all departments
* Customer and/or employee odds of an accident, typically by a factor of 10 or more
* The maximum discount or duration of sales
* Employee effectiveness
* Department and upgrade prices, such as a reduction by percentage or a change to the price calculation formula
* Boosts to VIP power or the rate at which they're attracted (see Promotions below).
* ...and more.

Upgrades become visible to the user according to a certain condition, such as a total amount in the bank, or a department reaching a certain level. Once visible, upgrades remain visible even if the condition is no longer fulfilled.

Upgrades are bought using cash from the bank. The user can only buy upgrades which they can afford. Upgrades immediately provide their benefits.

### Time of Day and Year Effects
Real retail stores are busier at certain times of day and certain times of the year. The stores in Supermarket are the same. The total customers per sat is multiplied by two numbers from the tables below, based on time of day and year:

| Time of day                   | Multiplier |
|-------------------------------|------------|
| Morning (8:00am to 12:00pm)   | 0.95       |
| Lunch (12:00pm to 2:00pm)     | 1.1        |
| Afternoon (2:00pm to 5:00pm)  | 1          |
| Drive Time (5:00pm to 7:00pm) | 1.25       |
| Evening (7:00pm to 10:00pm)   | 1          |
| Overnight (10:00pm to 8:00am) | 0.85       |

| Time of year                                          | Multiplier |
|-------------------------------------------------------|------------|
| Winter (January 1 to February 28/29)                  | 0.99       |
| Spring (March 1 to April 30)                          | 1          |
| Gardening Season (May 1 to May 31)                    | 1.05       |
| Summer (June 1 to August 31)                          | 1          |
| Fall (October 1 to the Wednesday before Thanksgiving) | 1          |
| Holiday Shopping Season (Thanksgiving to Christmas)   | 1.5        |
| Post-Holidays (December 26 to December 31)            | 1.0001     |

The time used is the current system time and time zone. At each launch, if a network connection is available, the game checks the real current time against the system time, and if there's a large discrepancy (more than 1 minute either way), the user is chided, but the effect still takes place. The time check also occurs if a large (30 second or more) timeskip is detected. If no network connection is available, the time check does not occur.

The time of day multiplier changes in the first second of the time period. For instance, Drive Time starts at exactly 5:00:00pm each day. The time of year multiplier changes at midnight on the first day in the period and lasts until 11:59:59pm on the last day in the period.

From the tables, the most productive time is Drive Time during the holidays, leading to a multiplier of 1.875. The worst time is Overnight during Winter, leading to a multiplier of 0.8415.

#### On the Seasonal Departments
At the bottom of the department tree of Seasonal, there are multiple departments that serve items from a specific season year-round. These items don't sell very well while out of season, but enjoy huge boosts while in season. The share size multiplier for each department is taken from the table below. This multiplier is applied to the share size of the department while not affecting the share sizes in any other department.

| Department Name                    | In Season                                  | Out-of-Season Multiplier | In-Season Multiplier |
|------------------------------------|--------------------------------------------|--------------------------|----------------------|
| Health and Wellness                | December 26 to January 13                  | 0.1                      | 1                    |
| Valentine's Center                 | January 14 to February 14                  | 0.4                      | 2.5                  |
| Easter Lane and Spring Garden      | February 15 to the day before Memorial Day | 0.125                    | 1.85                 |
| Summer Furniture and Pool Supplies | Memorial Day to July 13                    | 0.1                      | 2                    |
| Back to School                     | July 14 to September 7                     | 0.35                     | 2.25                 |
| Halloween Street                   | September 8 to October 31                  | 0.4                      | 3                    |
| Christmas Cove                     | November 1 to December 25                  | 0.01                     | 15                   |

### Promotions
Like most incremental games, Supermarket features the concept of prestige, where the user gains a currency they can utilize upon a reset to boost their production.

After the user earns enough money, their retail prowess attracts an industry mover-and-shaker called a VIP. The next VIP "costs" more than the next, and so forth, along an polynomial curve.

The user can put VIP to use at reset. When the user has at least 1 VIP, they can reset the game, which is called a Promotion. Each promotion opens a new store that the store director has been assigned to run, and all the VIPs then follow. Each VIP gives a `+x%` boost to the Customers per Sat metric, where `x` is a value that may be tweaked in the future, but should be around 1-2%.

Each promotion forces the user to start over from nearly scratch. They keep any achievements, VIPs, and Promotion Upgrades (see below), but lose their departments, upgrades, and employees. They must start over, but they can use the VIP-boosted Customer per Sat to progress faster through the game.

#### Store Size Increases
The total size of each store increases upon each promotion. Initially, not all the departments could fit in the store, but as gameplay continues, more and more departments are able to fit.

The store reaches a maximum size, just enough to hold all departments, when the user reaches a certain number of VIPs. Each promotion brings the user logarithmically to the maximum size. For example, if the store reaches maximum size at 10 trillion VIPs (10^13), then each power of 10 increase in the VIPs would bring the user 1/13th of the way to the maximum store size.

#### Promotion Upgrades
Between promotions, the user is given access to a set of prestige upgrades. These act mostly like normal upgrades, except they persist between promotions. Some cost money from the bank of the old store (which doesn't get any revenue while on the promotion upgrade menu), others cost VIPs, and some cost both.

Promotion upgrades tend to be more powerful than normal upgrades.

#### Lost VIPs
Bankruptcies force an immediate promotion, even if there are 0 VIPs ready to be claimed. The total number of VIPs that would be gained through a promotion is halved, and the half that was lost are considered Lost VIPs. This means that the price of each VIP is the same as it would have been had the Lost VIPs been claimed.

For example, if the user will gain 1,000,000 VIPs on a promotion, but only gains 500,000 VIPs after a bankruptcy promotion, the game still calculates the price of the next VIP based on the 1,000,000 VIPs that would have been claimed.

### Buying Businesses
As the user is promoted, they gain more and more control of the retail chain they work for (see Progression below), and can eventually buy distributors, manufacturers, and scientific researcher companies. These businesses will appear as standard upgrades that, when purchased, reduce costs across the board and unlock a series of new, powerful upgrades that greatly increase production rate. While the retail chain employing the user owns these businesses, the user does not directly manage them.

As noted in Progression, as the store becomes more wealthy, it has the power to buy larger businesses.

#### Distributors
Distributors are businesses that transport freight from manufacturers to stores, and they're the first that can be bought. While the store always has its own supply chain made of Distribution Facilities (DFs), the distributors are companies similar to UPS or FedEx; they supply the stores with freight that the DFs do not pick up on their own.

#### Manufacturers
Manufacturers are the companies which manufacture the products that are sent to the stores. While most stores have their own brand, buying Manufacturers in Supermarket literally entails buying the entire production chain, from base materials to the checkout lane. Buying Manufacturers means that the retail chain runs entirely on things it owns. Manufacturers are far more expensive to buy than just Distributors.

#### Scientific Research Companies
As the story progresses, and the user has reached the top of the retail world, they can branch into buying scientific research companies who will then research advanced upgrades to the retail environment. They start by making small but useful improvements to the supply chain, such as drone-delivered packages, and then take a turn into the absurd, such as padded flooring to reduce fall accidents, magnetic cart attractors to herd carts from the lot, and even Material Synthesis which converts an advanced fluid into any and all parts or products of the retail chain.

Eventually, the science companies even manage to break the laws of conservation, leading to free energy and free matter, which immensely reduces costs.

### Progression
Listed in the headings below are a series of stages of gameplay. Each stage is achieved when the user passes a certain number of VIPs and then is promoted to another store. Each stage unlocks new standard upgrades and new abilities.

**Please note that, even though the character in the game becomes the manager of many stores, the user will only ever control one at a time.**

#### Store Director
This is the first phase of the game. The user plays as a Store Director for a given store. They unlock and level departments, buy upgrades, and hire employees and managers to earn revenue and attract VIPs.

#### Market Director
This is the second phase of the game. The Store Director character has been promoted to direct all the stores in a market, typically between 4 and 7 stores. The only real change is a set of one-time loans from other stores in the market equal to some small percent of the revenue earned this promotion. This can be useful for saving up for a large purchase.

#### Regional Director
The user now manages all the stores in a single geographic region. The "store loan" upgrades mentioned above are now more powerful, but are still one-time-use only. A set of promotion upgrades for advertising become available.

#### Full Retail
The user is now President of the entire corporation. A set of more powerful, more expensive managers are added to the pool, along with even more powerful promotion upgrades.

#### Retail-Distribution
The user can now purchase Distributor companies at large costs.

#### Supply Chain
The user can now purchase Manufacturer companies at even larger costs. All employees gain a small boost because of the addition of a universal employee discount.

#### Science
The user can now purchase Scientific Research Companies at immense costs. A series of technologically unlikely upgrades become available.

#### Ascended
The character has passed away from old age. They ascend to heaven, along with all of their VIPs and the bank from the last store they managed while alive. An angel commends the character for their retail accomplishments and offers them reincarnation with their retail experience and VIPs.

The user can accept this offer, unlocking more upgrades and content. They may also turn down this offer, in which case the game completes. The user receives a certificate, a textbox containing the save code in case they wish to continue in the future, and a button to restart from nothing.

#### Angel
The character passes away again. They meet the same angel, who commends them again on being such a retail mogul. The angel then inducts the character into the ranks of the angels. Divine and heavenly promotion upgrades more powerful than even Material Synthesizers are unlocked, and some angels appear as new managers in the pool.

#### Archangel
By this point, any in-game clock now passes far more quickly. The character has died and been reincarnated many times, even in the same promotion. The character has now become an Archangel, a very high ranking. They join the Council of Archangels, who appear in the manager pool as insanely powerful managers.

#### God
After enough promotions, the character becomes a deity of retail. The most powerful upgrades are available here. Upon the next promotion, the game ends once more, and the user receives another certificate, the save code for the game, a reset button, and a continue button. The continue button warns that there are no further upgrades available at this time and that the user has truly completed the game.

### Tracks
A track is a sort of minigame that is unlocked when the user reaches a certain amount of revenue-earned-all-time.