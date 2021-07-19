const fetch = require('node-fetch')
const moment = require('moment')

const getDispo = async (name, date) => {
    const result = await fetch("https://tennis.paris.fr/tennis/jsp/site/Portal.jsp?page=recherche&action=ajax_load_planning", {
      "headers": {
        "accept": "*/*",
        "accept-language": "en-GB,en-US;q=0.9,en;q=0.8,fr;q=0.7",
        "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
        "sec-ch-ua": "\" Not;A Brand\";v=\"99\", \"Google Chrome\";v=\"91\", \"Chromium\";v=\"91\"",
        "sec-ch-ua-mobile": "?0",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "x-requested-with": "XMLHttpRequest",
        "cookie": "JSESSIONID=7F5BDBB6A41EDD6A55D9545E756284DA.T23-PR-V1-TOM02; NSC_WT_TUE11_0000101_iuuq_cbdlfoe01=14b5a3d99033e463b698b6a0d88f87f9f2a86446398d5ebf4b409ea7489f22a5b754215a; _pk_ref.263.aecb=%5B%22%22%2C%22%22%2C1626696904%2C%22https%3A%2F%2Fwww.google.com%2F%22%5D; _pk_ses.263.aecb=*; _pk_id.263.aecb=01597afbfba7875c.1626696904.1.1626697861.1626696904."
      },
      "referrer": "https://tennis.paris.fr/tennis/jsp/site/Portal.jsp?page=recherche&view=planning&name_tennis=Alain+Mimoun",
      "referrerPolicy": "strict-origin-when-cross-origin",
      "body": "date_selected=" + encodeURIComponent(date) + "&name_tennis=" + encodeURIComponent(name),
      "method": "POST",
      "mode": "cors"
    }).then(a => a.text())

    const courts = result.match(/Court \d+/g)
    // console.log(courts)

    const times = result.match(/\d+h - \d+h/g)
    // console.log(times)

    const isFree = 
        result.match(/(<td>\s*<span>LIBRE<\/span>\s*<\/td>|<td class="reservation-cell">)/g)
        .map(l => l.match(/LIBRE/) ? 1 : 0)
    // console.log(isFree)

    const data = []
    times.forEach((time, i) => data.push({
        time: +time.match(/^(\d+)/)[1],
        timeString: time,
        free: isFree.slice(i * courts.length, (i+1) * courts.length)
    }))

    return {courts, data}
}

module.exports = async (stadiums) => {
  const weekDays = [0,1,2,3,4,5,6].map(lag => moment().startOf('day').add(lag, 'days').format('DD/MM/YYYY'))

  const dispos = await Promise.all(stadiums.map(async (stadium) => {
      return Promise.all(weekDays.map(date => {
          return getDispo(stadium, date)
      }))
  }))

  return dispos
  // console.log(JSON.stringify(dispos, null, 2))
}
