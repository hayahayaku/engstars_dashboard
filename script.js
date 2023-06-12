// Reference variables, in milliseconds
const referenceTime = 1655694000000 // the start of first "event period"
const ONE_DAY = 8.64e+7
const eventPeriodLength = 1209600000
const onDuration = 727200000
const offDuration = 482400000
const eventProportion = offDuration / eventPeriodLength

var now = new Date().getTime()// + ONE_DAY*20
var nowSinceFirstEvent = now - referenceTime
var eventEnded = (nowSinceFirstEvent/eventPeriodLength + 1) % 1 < eventProportion
var currentPeriod =  Math.floor(nowSinceFirstEvent / eventPeriodLength) + 1
var startTime = referenceTime + ((currentPeriod - 1) * eventPeriodLength) + offDuration
var endTime = referenceTime + ((currentPeriod) * eventPeriodLength)

let eventType;

// https://stackoverflow.com/questions/15493521/how-do-i-calculate-a-duration-time
const timeDistance = (from, to) => {
    if (from > to) return !eventEnded ? "Event Finished" : "Event Started"
    let distance = Math.abs(from - to);
    const days = Math.floor(distance / 86400000);
    distance -= days * 86400000;
    const hours = Math.floor(distance / 3600000);
    distance -= hours * 3600000;
    const minutes = Math.floor(distance / 60000);
    distance -= minutes * 60000;
    const seconds = Math.floor(distance / 1000);
    return `${days} d ${('0' + hours).slice(-2)}:${('0' + minutes).slice(-2)}:${('0' + seconds).slice(-2)}`;
};

document.getElementById("eventheader").textContent = eventEnded ? "Next Event" : "Current Event"

document.getElementById("banner").setAttribute("src", "https://yaycupcake.github.io/engstars-events/chapter-banner/banners/chapter_campaign_rectangle1_" + (22000000 + currentPeriod) + ".png")

// utilizing https://github.com/benborgers/opensheet#readme

var url = "https://opensheet.elk.sh/1UjSHWpiW6prpe1-9-XP2SiDZXGZCHgsDFW-phnBTdcc/EventName!A" + currentPeriod + ":B" + (currentPeriod + 1)

fetch(url)
  .then((res) => res.json())
  .then((data) => {
    document.getElementById("eventname").textContent = data[0][Object.keys(data[0])[0]]
    var shorthand = data[0][Object.keys(data[0])[1]] + " Event (Event No. " + currentPeriod + ")"
    eventType = shorthand.split(" ").at(-5)
    document.getElementById("eventshorthand").textContent = shorthand
    if (eventType == "Tour") {
        document.getElementById("tourremarks").textContent = "For tour events the cards are listed from the lowest to highest points required for the first copy"
    }
    if (!eventEnded && eventType == "Tour") {
        document.getElementById("tourstarry").style.display = 'block';    
    }
  });

document.getElementById("starttime").textContent = new Date(startTime).toString()

document.getElementById("endtime").textContent = new Date(endTime).toString()

// https://stackoverflow.com/questions/39418405/making-a-live-clock-in-javascript/67149791#67149791
// setInterval(() => console.log(new Date().toLocaleTimeString()),1000);

if (!eventEnded) {
    document.getElementById("countdown_header").textContent = "Time Left"

    setInterval(() => {
        now = new Date().getTime()// + ONE_DAY*20
        document.getElementById("countdown").textContent = (timeDistance(now,endTime))
    })
    setInterval(() => {
        var currentDay = Math.floor((now-startTime+(ONE_DAY/2))/ONE_DAY)
        document.getElementById("eventday").textContent = "Event Day: " + currentDay
        var starryDay = Math.floor((now-startTime+ONE_DAY)/ONE_DAY)
        document.getElementById("starryday").textContent = "Starry Day: " + starryDay
        document.getElementById("extrapts").textContent = "Extra points left from starries and talent (assuming max talent): " + ((5000 * 3 * (9-starryDay)) + (6000 * (9 - (currentDay + 1))))
        if (eventType == "Unit" || eventType == "Shuffle") {
            var passesLeft = 50 * (9 - (currentDay + 1))
            document.getElementById("freewhispass").textContent = "Passes left from daily missions: " + passesLeft
        } else if (eventType == "Tour") {
            var whistlesLeft = 2 * (9 - (currentDay + 1))
            document.getElementById("freewhispass").textContent = "Whistles left from daily missions: " + whistlesLeft
            document.getElementById("tsmin").textContent = "Doing only 10 dia starries a day: " + ((starryDay * 2.5) + 7.5) 
            document.getElementById("tsmax").textContent = "Doing all 12 starries a day: " + ((starryDay * 3) + 3) 
        }
        document.getElementById("vip2").textContent = "Whistles left from VIP II: " + (15 * (8 - currentDay))
    })
} else {
    document.getElementById("countdown_header").textContent = "Time Until Start"
    setInterval(() => {
        now = new Date().getTime()// + ONE_DAY*20
        document.getElementById("countdown").textContent = (timeDistance(now,startTime))
    })
    setInterval(() => {
        document.getElementById("daycountremark").textContent = "Event day and starry day counter will be shown when the event starts"
        document.getElementById("extrapts").textContent = "Extra points from starries and talent (assuming max talent): " + 189000
        if (eventType == "Unit" || eventType == "Shuffle") {
            document.getElementById("freewhispass").textContent = "Extra passes from daily missions: " + 400
        } else if (eventType == "Tour") {
            document.getElementById("freewhispass").textContent = "Extra whistles from daily missions: " + 16
        }
        document.getElementById("vip2").textContent = "Extra whistles from VIP II: " + (15 * 14)
    })
}