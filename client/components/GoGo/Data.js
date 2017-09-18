export const TYPE_POLL = 'POLL';
export const TYPE_TEXT = 'TEXT';

export class User {
    constructor(_id, name, selected) {
        this._id = _id;
        this.name = name;
        this.selected = selected ? selected : [];
    }
}

export let users = [new User(1, 'Antoine', [2, 3]), new User(1, 'Nicolas', [2, 3]), new User(1, 'Christine', [2, 3]),];

let pollPlaces = {
    name: 'Places',
    polls: [{
        name: null, options: [
            {
                id: 20,
                name: 'Trift Glacier Suspension Bridge'
            },
            {id: 21, name: 'Titlis Cliff Walk'},
            {id: 22, name: 'Aletsch suspension bridge, Belalp - Riederalp'}
        ]
    }]
};
let pollDates = {
    name: 'Dates',
    polls: [{
        name: 'Sat, 1-May', options: [{
            id: 1,
            name: '7h00 at Lausanne train station'
        }, {
            id: 2,
            name: '6h15 at Villar Bus 30 station',
        }]
    }, {
        name: 'Sun, 2-May', options: [{
            id: 3,
            name: '7h00 at Lausanne train station. Stay and wait for me so long '
        }, {
            id: 4,
            name: '6h15 at Villar Bus 30 station',
        }]
    }]
};
let text1 = {
    name: 'Trift Glacier Suspension Bridge',
    body: 'The Trift aerial cable car takes you up across the Trift gorge and up to the Trift valley. From here you can hike up to the Trift suspension bridge where a fascinating view up to the lake and glacier will reward your efforts. The Windegg hut can be reached either along the direct path „Ketteliweg“ (Level T3) or the easier „Familienweg“ (Level T2). Surefootedness is required for the direct descent from the Windegg hut. An alpine route (Level T5) leads from the Trift bridge to the SAC Trift hut which takes 3 hours.(https://www.alpenwild.com/staticpage/suspension-bridges-in-switzerland/)'
};
let text2 = {
    name: 'Titlis Cliff Walk',
    body: "3,041 metres above sea-level. 500 metres off the ground. 150 heart-pounding steps. This is what awaits you on the TITLIS Cliff Walk, the spectacular suspension bridge high up on the summit. To cross the bridge, you'll need nerves as strong as the steel cables from which it hangs.   You'll need a healthy dose of courage and nerves of steel to tackle the TITLIS Cliff Walk. Europe's highest suspension bridge calls for a head for heights. But the views are spectacular."
};
let text3 = {
    name: 'Aletsch suspension bridge, Belalp - Riederalp',
    body: "On the traverse from Belalp to Riederalp hikers take in the incredible silence of the legendary Aletschji, savouring the Aletsch Forest nature reserve and views of the mighty Aletsch Glacier. The trail begins from Hotel Belalp, descending the Steigle to the Aletschji, continuing to the 124m-long Aletschji- Grünsee suspension bridge. Completed in July 2008, more than 30,000 eager hikers crossed the bridge during its inaugural summer. It is situated in front of the gate to the Aletsch Glacier, crossing the 80m-deep Massa Gorge. Hikers have two choices once they cross the bridge: either travel from the Grünsee to the Teife Forest, or take the Riederfurka to Riederalp via Silbersand."
};

export default {
    sections: [{type: TYPE_POLL, data: pollPlaces},
        {type: TYPE_POLL, data: pollDates},
        {type: TYPE_TEXT, data: text1},
        {type: TYPE_TEXT, data: text2},
        {type: TYPE_TEXT, data: text3}]
};


