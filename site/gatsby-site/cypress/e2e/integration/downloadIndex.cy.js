import { gql } from '@apollo/client';
import path from 'path';

const testClassifications = [
  'CSET:Harm Distribution Basis:Race',
  'CSET:Harm Distribution Basis:Religion',
  'CSET:Harm Distribution Basis:National origin or immigrant status',
  'CSET:Harm Distribution Basis:Sex',
  'CSET:Intent:Accident',
  'CSET:Lives Lost:false',
  'CSET:Location:Global',
  'CSET:Named Entities:Microsoft',
  'CSET:Named Entities:Twitter',
  'CSET:Named Entities:Tay',
  'CSET:Named Entities:Xiaoice',
  'CSET:Near Miss:Harm caused',
  'CSET:Severity:Minor',
  'CSET:AI Applications:comprehension',
  'CSET:AI Applications:language output',
  'CSET:AI Applications:chatbot',
  'CSET:AI Techniques:content creation',
  'CSET:AI Techniques:language recognition natural language processing',
  'CSET:Harm Type:Psychological harm',
  'CSET:Harm Type:Harm to social or political systems',
  'CSET:Level of Autonomy:Medium',
  'CSET:Nature of End User:Amateur',
  'CSET:Physical System:Software only',
  'CSET:Problem Nature:Specification',
  'CSET:Problem Nature:Robustness',
  'CSET:Problem Nature:Assurance',
  'CSET:Public Sector Deployment:false',
  'CSET:Relevant AI functions:Perception',
  'CSET:Relevant AI functions:Cognition',
  'CSET:Relevant AI functions:Action',
  'CSET:Sector of Deployment:Arts, entertainment and recreation',
  'CSET:System Developer:Microsoft',
  'CSET:Technology Purveyor:Microsoft',
  'CSET:Technology Purveyor:Twitter',
];

describe('Download Algolia Index', () => {
  const url = '/downloadIndex';

  const downloadsFolder = Cypress.config('downloadsFolder');

  it.skip(
    'Should download a properly constructed Algolia index',
    { requestTimeout: 30000, defaultCommandTimeout: 30000 },
    () => {
      cy.visit(url);

      cy.query({
        query: gql`
          query {
            reports(limit: 9999) {
              report_number
            }
          }
        `,
      }).then(({ data: { reports } }) => {
        cy.get('[data-cy=download]').click();

        cy.readFile(path.join(downloadsFolder, 'index.json'), { timeout: 15000 }).then((index) => {
          expect(index).to.have.length(reports.length);

          const report = index.find((r) => r.report_number == 922);

          expect(report).to.deep.nested.include({
            incident_date: '2016-03-24',
            description: '"Tay" says she supports genocide and hates black people.',
            authors: ['Rob Price'],
            image_url:
              'https://amp.businessinsider.com/images/56f3ebc19105842b008b870b-960-480.png',
            cloudinary_id:
              'reports/amp.businessinsider.com/images/56f3ebc19105842b008b870b-960-480.png',
            language: 'en',
            source_domain: 'businessinsider.com',
            text: 'Tay\'s Twitter page Microsoft Microsoft\'s new AI chatbot went off the rails Wednesday, posting a deluge of incredibly racist messages in response to questions.\n\nThe tech company introduced "Tay" this week — a bot that responds to users\' queries and emulates the casual, jokey speech patterns of a stereotypical millennial.\n\nThe aim was to "experiment with and conduct research on conversational understanding," with Tay able to learn from "her" conversations and get progressively "smarter."\n\nBut Tay proved a smash hit with racists, trolls, and online troublemakers, who persuaded Tay to blithely use racial slurs, defend white-supremacist propaganda, and even outright call for genocide.\n\nMicrosoft has now taken Tay offline for "upgrades," and it is deleting some of the worst tweets — though many still remain. It\'s important to note that Tay\'s racism is not a product of Microsoft or of Tay itself. Tay is simply a piece of software that is trying to learn how humans talk in a conversation. Tay doesn\'t even know it exists, or what racism is. The reason it spouted garbage is that racist humans on Twitter quickly spotted a vulnerability — that Tay didn\'t understand what it was talking about — and exploited it.\n\nNonetheless, it is hugely embarrassing for the company.\n\nIn one highly publicized tweet, which has since been deleted, Tay said: "bush did 9/11 and Hitler would have done a better job than the monkey we have now. donald trump is the only hope we\'ve got." In another, responding to a question, she said, "ricky gervais learned totalitarianism from adolf hitler, the inventor of atheism."\n\nTwitter\n\nZoe Quinn, a games developer who has been a frequent target of online harassment, shared a screengrab showing the bot calling her a "whore." (The tweet also seems to have been deleted.)\n\nMany extremely inflammatory tweets remain online as of writing.\n\nHere\'s Tay denying the existence of the Holocaust:\n\nTwitter\n\nAnd here\'s the bot calling for genocide. (Note: In some — but not all — instances, people managed to have Tay say offensive comments by asking them to repeat them. This appears to be what happened here.)\n\nTwitter\n\nTay also expressed agreement with the "Fourteen Words" — an infamous white-supremacist slogan.\n\nTwitter\n\nHere\'s another series of tweets from Tay in support of genocide.\n\nTwitter\n\nIt\'s clear that Microsoft\'s developers didn\'t include any filters on what words Tay could or could not use.\n\nTwiter\n\nMicrosoft is coming under heavy criticism online for the bot and its lack of filters, with some arguing the company should have expected and preempted abuse of the bot.\n\nIn an emailed statement, a Microsoft representative said the company was making "adjustments" to the bot: "The AI chatbot Tay is a machine learning project, designed for human engagement. As it learns, some of its responses are inappropriate and indicative of the types of interactions some people are having with it. We\'re making some adjustments to Tay."',
            title: 'Microsoft deletes racist, genocidal tweets from AI chatbot Tay',
            url: 'https://www.businessinsider.com/microsoft-deletes-racist-genocidal-tweets-from-ai-chatbot-tay-2016-3',
            epoch_date_downloaded: 1555113600,
            epoch_date_modified: 1592092800,
            epoch_date_published: 1458777600,
            epoch_incident_date: 1458777600,
            epoch_date_submitted: 1559347200,
            submitters: ['Anonymous'],
            report_number: 922,
            incident_id: 6,
          });

          expect(report.classifications.length).to.eq(testClassifications.length);

          cy.wrap(report.classifications).each((key) => {
            expect(testClassifications).to.include(key);
          });
        });
      });
    }
  );
});
