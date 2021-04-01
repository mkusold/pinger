# Website Pinger

This little node script can be used to constantly ping and query a website to alert you when it's up. Useful for high traffic events like Covid vaccine websites, ticketing, raffles etc. or for monitoring development environments.

## Setup

- install node
- `npm install`
- go into `main.js` and set the constants to point to the site you want to ping and the sound you want to play. (default sound should work for Macs)
- `npm start`

## Result

A noise will play when the website is deemed 'up'