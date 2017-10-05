## Additional UI Elements for Supermarket

This document describes certain elements and displays for Supermarket, most of which are cosmetic.

### In-Game Clock
This displays the current date and time of the store in the format **Tue, Jul 27, 2019 4:26pm**. It is based on the system clock and updates once every 10 seconds. This is the clock used to determine time-of-day and of-year effects. This clock will run much faster when the user reaches the Archangel stage of gameplay.

### Weather Display
A random temperature and weather condition is generated once an hour. The temperature's range depends on the in-game clock and is determined by picking a temperature out of one of the seasonal ranges below, then adding or subtracting a random number of degrees based on the time of day:

* Winter: 20-50 degrees Fahrenheit
* Spring: 50-80 degrees Fahrenheit
* Summer: 70-100 degrees Fahrenheit
* Fall: 50-75 degrees Fahrenheit

* 12:00am to 8:00am: -10 degrees
* 8:00am to 2:00pm: +0 degrees
* 2:00pm to 4:00pm: +10 degrees
* 4:00pm to 12:00am: +0 degrees

### Employee Names
Employee information is **not** stored in the game, but generated randomly on the fly using a bank of first and last names.

### Humorous Accident Messages
When an employee or customer experiences an accident, a humorous message will be displayed. If more than three accidents occur in a 24-hour period, all accident information is rolled up into one message.

For instance, a single accident message may appear as:

> Mark Mills drove a forklift into a shelf on the sales floor. He's fine, but the forklift's not. As a result, we've decided to terminate his employment.

A message for a customer's accident may appear as:

> Oh no! A customer slipped on a pile of bouncy balls left out in Produce! Customer satisfaction -200 millisats!

A message for multiple employee accidents may appear as:

> 396 employees decided to get into the new fad of sun-watching. They were last seen handing in their badges with smoke emanating from their eyes.

### Store Messaging System

The user has access to a messaging system where they can see messages from employees, managers, corporate executives and news articles. These messages can involve:

* Gameplay guides and hints
* Positive or negative information about store growth
* News about how VIPs are impressed by the store director
* Angry messages from corporate if customer accidents are too common
* Requests from unassigned managers to be assigned if there are many empty manager slots
* Seasonal messages depending on the time of year
* Weather information from the auto-generated weather data
* If it's nighttime, corporate executives asking why the user is still up

...and so forth.