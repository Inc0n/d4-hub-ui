/* score.js

   Description:
   The utility module to help manipulate user data, should rename to something other than score.js

   Structure of a user object:
   user:		 { name, devices }
   device:		 { (name: data)* }
   data:		 [ dated_data ]
   dated_data:	 { date, value }
*/

// Calculate the total score of a device, which is cached
// also re-process date as Date object
function deviceTotalScore(data, weighting) {
  if (data == null) return 0;

  return data.reduce((total, dateddata) => {
    const score = dateddata.value * weighting;
    dateddata.score = score;                                  // cache score
    dateddata.date = new Date(dateddata.date.seconds * 1000); // replace date data with Date object
    return (total + score);
  }, 0);
}

// Calculate the total score of a user
function calcUserTotalScore(user, weightings) {
  const devices = user.devices;
  if (devices == null) {
    user.score = 0;
  } else {
    const deviceTotalScoreNamed = (devName) => {
      return deviceTotalScore(devices[devName], weightings[devName] || 1);
    };
    const score = Object.keys(devices).reduce(
      (total, devName) => (total + deviceTotalScoreNamed(devName)),
      0);
    user.score = Math.floor(score);
  }
  return user.score;
}

// calculate the user total scores
export default function calcUserTotalScores(users, weightings) {
  users.forEach(user => calcUserTotalScore(user, weightings));
  return users;
}

// Date object same day predicate
const oneDayMiliSecs = 3600 * 24 * 1000;
const dateSameDayp = (dateA, dateB) => {
  return Math.abs(dateA - dateB) < oneDayMiliSecs;
};

// Append and modifies to sorted list,
// keep sorted list order by comparing dates
function adjoinDate(date, lst) {
  const idx = lst.findIndex((dateB) => date > dateB);
  const dateB = lst[idx];
  if (!dateSameDayp(date, dateB)) {
    lst.splice(idx, 0, date);
  }
}

// Compute the sorted and unique list of device dates that user have on their records
function getUserDevicesDates(user) {
  if (user === null || user.devices == null) return [];

  const devices = user.devices;

  const labelsSet = Object.keys(devices).reduce((accSet, devName) => {
    const devData = devices[devName];
    devData.forEach(data => adjoinDate(data.date, accSet));
    return accSet;
  }, []);
  return labelsSet.sort((a, b) => a - b);
}

// Extract the labels for user device list from all the of dates in the device
export function getUserDeviceDateLabels(user) {
  const dateToString = (date) => {
    const options = {month: 'short', day: '2-digit'};
    return date.toLocaleString('default', options);
  };
  return getUserDevicesDates(user).map(dateToString);
}

// compute the datasets for a given user to plot with chart.js
// this datasets will be an array of data of each device
export function getUserDeviceDatasets(user) {
  // == is intended here
  if (user === null || user.devices == null) return [];

  const devices = user.devices;
  const dates = getUserDevicesDates(user);
  // TODO: use more sophisticated method in production
  const colors = ['#D6E9C6', '#FAEBCC', '#EBCCD1'];
  // const colors = ["rgb(0,10,200)", "rgb(220,0,10)","rgb(220,0,0)"];

  return Object.keys(devices).map((devName, idx) => {
    const devData = devices[devName];
    const color = colors[idx];

    return {
      label: devName,
      borderColor: color,
      fill: false,
      // cubicInterpolationMode: 'monotone',
      lineTension: 0.0,
      data: dates.map((date) => {
        const data = devData.find((data) => dateSameDayp(data.date, date));
        return data
          ? data.score
          : 0;
      })
    };
  });
}

// the datasets parameter should be computed from getUserDeviceDatasets
export function getUserAccScoreDatasets(datasets) {
  return datasets.map(({fill, data, ...dataset}) => {
    return {
      fill: true,
      data: data.reduce(([total, ...totals], score) => {
        const newtotal = total + score;
        return [newtotal, ...totals, newtotal];
      }, [0]).slice(1),
      ...dataset // retain the other properties of normal datasets
    };
  });
}