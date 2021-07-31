# Supermarket
## Technical Specification

Supermarket's implementation is built to be easily changed from within the game to test balancing. Prices, revenue, and the flow of time can all be modified in game when developer mode is enabled, to make easy changes without having to reload the game.

The components of Supermarket are as you'd expect for an incremental game:

- **Core Game Types**: Objects that define the base and current properties of the game, departments, employees, managers, upgrades, etc., and define methods that modify game state.
- **Save/Load**: Provides an abstraction over storage implementations that can save or load the game using base-64 encoded JSON representations of the game.
- **Display Types**: Types that contain information about what is displayed to the user. Properties of game types are used to build display types, which are handed to whatever is displaying the game to the user for rendering.
- **Settings Types**: Types that can be changed by the user which change the settings of the game or the display.

### Types, Properties, and Methods

- **Game**
    - Properties
        - Bank: The current amount of money the user has.
        - Customer Satisfaction: The current amount of sats the customer has.
        - Customers per Sat (C/Sat)
        - Customers per Sat per Second (C/Sat/Sec)
        - Size
        - User's Name
        - Store's Name: Chosen by the user, can be changed at any time.
        - Seniority Started On
        - Promotion Started On
        - Seniority Earnings
        - Promotion Earnings
        - Departments: A list of all deparments, initially filled with initial departments. When a department separates into multiple departments, they are inserted in place of the old department. (Example: `[Food, General Merchandise]` becomes `[Grocery, Consumables, General Merchandise]`).
        - Upgrades: A list of all upgrades.
        - Customer Service Department
        - Inventory and Pricing Department (type is just Base Department, no extra properties)
        - Customer Accident Odds per Second
        - Customer Incident Odds per Second
        - Customer Accident/Incident Satisfaction Multiplier
        - Wage Negotiaton Information
        - Layoff Information
        - Bankruptcies
        - Promotion Information
    - Computed Properties
        - Non-Sale Customers per Second (nsC/Sec)
        - Actual Customers per Second (C/Sec): Adds effects of sales.
        - Share Size
        - Revenue per Second (R/Sec)
        - Total Wages per Second (W/Sec)
- **Base Department**
    - Initial Properties
        - Name
        - Internal ID
        - Base Price
        - Footprint
    - Properties
        - Current Base Price: Changes when upgrades retroactively cheapen department prices.
        - Current Price: Price to level department up by 1.
        - Level Price Multiplier
        - Level
        - Employee Information
        - Manager Slots: A fixed-size array of Managers.
- **Department** inherits Base Department
    - Initial Properties
        - Splits Into: An array of internal IDs of the departments that this department separates into.
        - Splits At: The level that the department splits at.
        - Base Sats per Level (bS/L)
        - Base Products per Customer (bP/C)
        - Base Price per Product (bP/P)
        - Sale Effectiveness
    - Properties
        - Shares
        - Products per Customer (P/C)
        - Price per Product (P/P)
        - Active Sales
    - Computed Properties
        - Department Customers per Second (dC/Sec)
        - Department Products Per Second (dP/Sec)
        - Department Non-Sale Revenue per Second (nsdR/Sec)
        - Department Revenue per Second (dR/Sec)
        - Actual Sats per Level (aS/L): `(game) => baseSatsPerLevel * (1 / pow(max(1, stddev(game.departments.select(d => d.level))), someNumberIWillTweak))`
- **Customer Service Department** inherits Base Department
    - Computed Properties
        - Satisfaction Multiplier: `() => 1 + (floor(level / 50) * 0.1)`
- **Sale**
    - Properties
        - Discount amount: Between 0% and 100%, chosen by the user.
        - Effectiveness: `rand(0, maximumSaleEffectiveness)`
        - Expires At:
        - Can Be Canceled At
    - Computed Properties
        - Possible Sales per Day: `(inventoryAndPricing) => ceil(inventoryAndPricing.level / 30)`
        - Sale Duration: `(inventoryAndPricing) => ceil(inventoryAndPricing.level / 15)`
        - Maximum Discount: `(inventoryAndPricing) => min(0.1, smoothstep(1 - (1 / inventoryAndPricing.level)))`
        - Maximum Sale Effectiveness: `(dept, discount, timeOfDay, timeOfYear) => min(1, (ratioMultiply(ratioMultiply(discount + (dept.saleEffectiveness / 100), timeOfDay), timeOfYear)))`
        - Share Size Multiplier: `(dept) => dept.shareSize * rand(0, maximumSaleEffectiveness)`
        - Profitability: `(dept) => dept.revenuePerSecond - dept.nonSaleRevenuePerSecond`
- **Department Employee Information**
    - Initial Properties
        - Role Names
    - Properties
        - Employee Count
        - Wage per Employee per Second (W/E/Sec)
        - Accidents Odds per Second
    - Computed Properties
        - Total Department Wages per Second (dW/Sec)
- **Manager**
    - Initial Properties
        - Name
        - Wages per Second (mW/Sec)
- **Wage Negotiaton Information**
    - Properties
        - Next Standard Negotiation Time
        - Remaining Negotiation Time
        - Is Mass Hiring Negotiation
        - Failed Negotiations Since Last Success
        - Odds of Next Negotiation Succeeding
        - Actual Requested Total Wages: Chosen from a number between the minimum and maximum
    - Computed Properties
        - Employees Currently Negotiating
    - Functions
        - Divide New Total Wages Between Employees: `(game) => ...`
- **Layoff Information**
    - Properties
        - Time Spent in the Red
- **Upgrades and Businesses**
    - Properties
        - Name
        - Price
        - Is Promotion Upgrade
    - Functions
        - Should Be Visible: `(game) => ...`
- **Promotion Information**
    - Initial Properties
        - Satisfaction Boost per VIP
        - VIPs Required For Full Size Store
    - Properties
        - Promotion Count
        - VIP Count
        - Lost VIP Count
    - Functions
        - Total VIPs for Seniority Earnings: `(earnings) => ...`
- **Statics**
    - Fields
        - Full Department List
        - Single Employee Accident Reasons
        - Bulk Employee Accident Reasons
        - Customer Accident Reasons
        - Customer Incident Reasons
        - Job Titles and VIP Amounts for Titles
    - Functions
        - Ratio Multiply
        - Random Real Number
        - Table Lookup
        - Standard Deviation
        - Power
        - Min
        - Max
        - Floor
        - Ceiling
        - Smoothstep: `(x) => x * x * (3 - 2 * x)`
    - Tables
        - Time of Day multipliers for sales
        - Time of Year multipliers for sales
        - Time of Day multiplier for C/Sat
        - Time of Year multiplier for C/Sat

### Statistics Display Modes

One thing I'd like to have in incremental games is multiple ways of showing prices and revenues. For instance, I can manually calculate that it will take 20 seconds to earn enough to buy a $400 item if I'm earning $20/second, but it would be more convenient to be able to see that.

#### Numbers

Numbers show with two decimal places as long as they're less than 1,000 (i.e. `456.72`). After 1,000, they're separated by commas every 3 digits up to 1 trillion (i.e. `262,856,394,020`).

At 1 trillion, the user can choose to display in short scale with three decimals (`406.856 septillion`), or as third-power-of-ten (`406.856 * 10^24`), with a center dot and a superscript exponent. Either way, the exponent only changes when the number reaches a new power of 1,000.

Customer satisfaction is always displayed in SI notation, as described in the functional spec.

#### Times

Times that are zero or negative are shown as `now!`

Times less than 1 second are shown in SI notation (`22.458 milliseconds`, `1.112 yoctoseconds`). Times less than 1 yoctosecond are shown as `<1 yoctosecond`.

Times less than 1 minute are shown as `47 seconds`.

Times less than 1 hour are shown as `11m14s`.

Times less than 1 day are shown as `22h14m18s`.

Times less than 1 week are shown as `4d11h52m24s`.

Times less than 1 year are shown as `22w6d3h14m59s`.

Times less than 10,000 years are shown as `222 years`.

Times more than 10,000 years are shown as `more than 10,000 years`.

#### Price Display Modes

- Default: `$82.945 trillion`
- Equivalent Revenue Time: The duration it would take to earn enough to buy this. `4m56s of bank`
- Time Until Available: The duration until the bank has enough to buy this. `in 4d14h22m18s`.
- Base Cost per Revenue: Calculates the price of the item and divides it by the additional revenue. Displayed as "602.585 BCR".
- Base Cost per Sat: Calculates the price of the item and divides it by the additional satisfaction. Displayed as "25.854 octillion BCS".

### Type System

The above list of types, properties, and methods resemble a standard object-oriented type system. The list of types contain fields, initial properties (a.k.a. constants), properties, and functions. Each field and property has a type, each function may return an instance of a type and accept zero or more arguments of a certain type. Additionally, a minimal amount of inheritance is used to avoid redefining the same members on multiple types.

This type system is generally usable in C# and JavaScript, which now has classes, inheritance, and properties (!). However, we wish to add a couple additional requirements for numbers:

- Numbers should work with an abstraction of an underlying numeric type, which allows us to swap out, say, double-precision floats with an arbitrary-precision decimal type in the future.
- Numbers should be editable by the user in debug mode.

Let's see how this is implemented.

#### The Number Type

The number type abstracts over a numeric type provided by the language, such as `double` in C#. This allows us to switch out the underlying type with another type without having to rewrite the many, many places numbers would be used in the game.

Instances of numbers have both _names_ and _group paths_. The group path is a string containing `>` characters that split the string into _group names_, such as `General > Customer Satisfaction`. Group names are trimmed of whitespace when the group path is split on `>`.

When a number is made, it registers itself with a _number list_. The number list is a list of named groups (where the groups are built from the group paths), ending in lists of numbers. The number list can then be used by rendering code to show a list of all numbers to the user in debug mode, allowing them to edit the underlying number. The renderer can choose how numbers are edited; via textbox, numeric up/down, slider, or buttons that add/multiply/divide the number.

When a number's edit is saved to the number, it can optionally invoke an action, such as recalculating other game properties based on the number's new value.

Numbers are fundamentally mutable; changing an often-calculated value thousands of times per second doesn't lend itself well to copying dozens of bytes every time.

A C# implementation may look like this:

```csharp
class Number<T>
{
    T value;

    T Value { get; }
    string DebugName { get; }
    string GroupPaths { get; }
    string[] GroupNames { get; }
    Action OnChange { get; }

    Number(string debugName, string groupName, T initialValue);

    void Set(T newValue);
    void SetAndInvoke(T newValue);

    void Add(T that);
    void Subtract(T that);
    void Multiply(T that);
    void Divide(T that);
    // ...other mathematical operations as needed
}

class DebugGroup<T>
{
    Dictionary<string, DebugGroup> groups;
    Dictionary<string, Number<T>> numbers;

    Number<T> this[string groupAndNumberName] { get; set; }
    // ...
}
```