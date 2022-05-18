import discoverIndexGenerator from '../../src/utils/discoverIndexGenerator';
import allClassifications from '../fixtures/classifications/allClassifications.json';

describe('Generate a Algolia index', () => {
  it('Should return a properly constructed Algolia index', () => {
    discoverIndexGenerator({ graphql: () => allClassifications }).then((index) => {
      expect(index).to.have.length(10);
      expect(index[0]).to.deep.nested.include({
        objectID: '5d34b8c29ced494f010ed469',
        incident_date: '2014-08-14',
        mongodb_id: '5d34b8c29ced494f010ed469',
        description:
          'Increasing numbers of low-income mothers and fathers are at the center of a new collision that pits workplace scheduling technology against the routines of parenting.',
        authors: ['Jodi Kantor'],
        image_url:
          'https://static01.nyt.com/images/2014/08/13/us/worker-hours-1407960684740/worker-hours-1407960684740-articleLarge.jpg',
        cloudinary_id: null,
        language: 'en',
        source_domain: 'nytimes.com',
        text: 'SAN DIEGO — In a typical last-minute scramble, Jannette Navarro, a 22-year-old Starbucks barista and single mother, scraped together a plan for surviving the month of July without setting off family or financial disaster.\nIn contrast to the joyless work she had done at a Dollar Tree store and a KFC franchise, the $9-an-hour Starbucks job gave Ms. Navarro, the daughter of a drug addict and an absentee father, the hope of forward motion. She had been hired because she showed up so many times, cheerful and persistent, asking for work, and she had a way of flicking away setbacks — such as a missed bus on her three-hour commute — with the phrase, “I’m over it.”\nJannette Navarro at Starbucks.\nNewly off public assistance, she was just a few credits shy of an associate degree in business and talked of getting a master’s degree as some of her co-workers were. Her take-home pay rarely topped $400 to $500 every two weeks; since starting in November, she had set aside $900 toward a car — her next step toward stability and independence for herself and her 4-year-old son, Gavin.\nBut Ms. Navarro’s fluctuating hours, combined with her limited resources, had also turned their lives into a chronic crisis over the clock. She rarely learned her schedule more than three days before the start of a workweek, plunging her into urgent logistical puzzles over who would watch the boy. Months after starting the job she moved out of her aunt’s home, in part because of mounting friction over the erratic schedule, which the aunt felt was also holding her family captive. Ms. Navarro’s degree was on indefinite pause because her shifting hours left her unable to commit to classes. She needed to work all she could, sometimes counting on dimes from the tip jar to make the bus fare home. If she dared ask for more stable hours, she feared, she would get fewer work hours over all.\n“You’re waiting on your job to control your life,” she said, with the scheduling software used by her employer dictating everything from “how much sleep Gavin will get to what groceries I’ll be able to buy this month.”\nLast month, she was scheduled to work until 11 p.m. on Friday, July 4; report again just hours later, at 4 a.m. on Saturday; and start again at 5 a.m. on Sunday. She braced herself to ask her aunt, Karina Rivera, to watch Gavin, hoping she would not explode in annoyance, or worse, refuse. She vowed to somehow practice for the driving test that she had promised her boyfriend she would pass by the previous month. To stay awake, she would formulate her own behind-the-counter coffee concoctions, pumping in extra shots of espresso.\nA sign with a missed deadline hanging in the kitchen.\nScheduling Chaos\nLike increasing numbers of low-income mothers and fathers, Ms. Navarro is at the center of a new collision that pits sophisticated workplace technology against some fundamental requirements of parenting, with particularly harsh consequences for poor single mothers. Along with virtually every major retail and restaurant chain, Starbucks relies on software that choreographs workers in precise, intricate ballets, using sales patterns and other data to determine which of its 130,000 baristas are needed in its thousands of locations and exactly when. Big-box retailers or mall clothing chains are now capable of bringing in more hands in anticipation of a delivery truck pulling in or the weather changing, and sending workers home when real-time analyses show sales are slowing. Managers are often compensated based on the efficiency of their staffing.\nScheduling is now a powerful tool to bolster profits, allowing businesses to cut labor costs with a few keystrokes. “It’s like magic,” said Charles DeWitt, vice president for business development at Kronos, which supplies the software for Starbucks and many other chains.\nYet those advances are injecting turbulence into parents’ routines and personal relationships, undermining efforts to expand preschool access, driving some mothers out of the work force and redistributing some of the uncertainty of doing business from corporations to families, say parents, child care providers and policy experts.\nIn Brooklyn, Sandianna Irvine often works “on call” hours at Ashley Stewart, a plus-size clothing store, rushing to make arrangements for her 5-year-old daughter if the store needs her. Before Martha Cadenas was promoted to manager at a Walmart in Apple Valley, Minn., she had to work any time the store needed; her mother “ended up having to move in with me,” she said, because of the unpredictable hours. Maria Trisler is often dismissed early from her shifts at a McDonald’s in Peoria, Ill., when the computers say sales are slow. The same sometimes happens to Ms. Navarro at Starbucks.\nBy Saturday afternoon of the Fourth of July weekend, Ms. Navarro had made it through “clopening,” closing late at night and opening again just a few hours later. But she had not yet worked up the courage to ask Ms. Rivera and Ms. Rivera’s boyfriend, Osc',
        title: 'Working Anything but 9 to 5',
        url: 'https://www.nytimes.com/interactive/2014/08/13/us/starbucks-workers-scheduling-hours.html',
        date_downloaded: '2019-04-13',
        date_modified: '2020-06-14',
        date_published: '2014-08-14',
        epoch_date_downloaded: 1555113600,
        epoch_date_modified: 1592092800,
        epoch_date_published: 1407974400,
        epoch_incident_date: 1407974400,
        epoch_date_submitted: 1559347200,
        submitters: ['Catherine Olsson'],
        date_submitted: '2019-06-01',
        report_number: 16,
        incident_id: 10,
        ref_number: 0,
        classifications: [
          'CSET:Intent:Unclear',
          'CSET:Lives Lost:false',
          'CSET:Location:Global',
          'CSET:Named Entities:Starbucks',
          'CSET:Named Entities:Kronos',
          'CSET:Near Miss:Unclear/unknown',
          'CSET:Severity:Negligible',
          'CSET:Harm Type:Psychological harm',
          'CSET:Infrastructure Sectors:Food and agriculture',
          'CSET:Public Sector Deployment:false',
          'CSET:Sector of Deployment:',
          'CSET:Technology Purveyor:Starbucks',
          'resources:Datasheets for Datasets:false',
          'resources:MSFT AI Fairness Checklist:true',
        ],
      });
    });
  });
});
