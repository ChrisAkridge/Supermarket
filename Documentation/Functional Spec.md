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

#### Employee Safety

### Managers

### Wage Negotiations

### Upgrades

### Time of Day and Year Effects

#### On the Seasonal Departments

### Promotions

#### Store Size Increases

#### Promotion Upgrades

### Buying Businesses

#### Distributors

#### Production Companies

#### Scientific Researchers

### Progression

#### Store Director

#### Market Director

#### Regional Director

#### Full Retail

#### Retail-Distribution

#### Supply Chain

#### Science

#### Ascended

#### Angel

#### Archangel

#### God